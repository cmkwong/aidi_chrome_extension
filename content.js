const MAX_STANDARD_ANSWER_LEN = 6;

function getNextBtn() {
  try {
    let [link, project_id, locale, query_code] =
      getProjectLink_Id_Locale_Querycode();
    let project_type = getProjectType(project_id);
    if (project_type === 'standard') {
      return document.getElementsByClassName('forward-btn')[0];
    } else if (project_type === 'sbs') {
      return document.getElementsByClassName('forward-btn')[0];
    }
  } catch {
    (err) => {
      console.log(err);
    };
  }
}

function getSentNotice() {
  return document.querySelector('.validates-clicked');
}

function getPopUpWindow() {
  return document.querySelector('.swal2-popup .swal2-header');
}

function getPopUpBtn() {
  return document.querySelector('.swal2-actions button');
}

// notInsert is for checking if answers allowed to insert to DB. If auto, forbidden, if manual, allowed.
function getInsertedAllowed(nextBtn) {
  try {
    if (nextBtn.classList.contains('notInsert')) {
      return 'false';
    }
    return 'true';
  } catch {
    (err) => {
      console.log(err);
    };
  }
}

function getProjectType(project_id) {
  // check for sbs
  const re_sbs = /(sbs)/;
  const sbsResult = project_id.match(re_sbs);
  // check for validation project
  const re_validation = /(validation)/;
  const re_spot = /(spot)/;
  const re_saf = /(saf)/;
  const validationResult = project_id.match(re_validation);
  const spotResult = project_id.match(re_spot); // checking if project id have word spot
  const safResult = project_id.match(re_saf); // checking if project id have word saf
  if (sbsResult) {
    return 'sbs';
  } else if (
    (validationResult && spotResult) ||
    (validationResult && safResult)
  ) {
    return 'valid';
  } else return 'standard';
}

function _get_result_title(result) {
  const filters = {
    v1: '.title',
    v2: '.result-card-title',
  };
  let title;
  for (const version in filters) {
    title = result.querySelector(filters[version])?.innerText;
    if (title) break;
  }
  return title;
}

function _get_result_description(result) {
  const filters = {
    v1: '.description',
    v2: '.result-card-description',
  };
  let description;
  for (const version in filters) {
    description = [...result.querySelectorAll(filters[version])]
      ?.map((des) => des.innerText.substring(0, 200))
      .join('\n');
    if (description) break;
  }
  return description;
}

function _get_result_footnote(result) {
  const filters = {
    v1: '.footnote',
    v2: '.result-card-footnote',
  };
  let footnote;
  for (const version in filters) {
    footnote = result.querySelector(filters[version])?.innerText;
    if (footnote) break;
  }
  return footnote;
}

function getResults(project_type) {
  try {
    let all_resultDict;
    if (project_type === 'standard') {
      // new version
      let all_parsecResult = [
        ...document
          .querySelector('iframe')
          ?.contentDocument?.querySelectorAll('.result'),
      ];
      // old version
      all_parsecResult.length !== 0
        ? all_parsecResult
        : (all_parsecResult = [
            ...document
              .getElementsByClassName('iframe')[0]
              ?.getElementsByTagName('iframe')
              ?.item(0)
              ?.contentDocument?.querySelectorAll('.parsec-result'),
          ]);
      all_resultDict = all_parsecResult.map((parsecResult) => {
        let type = parsecResult.parentNode.className.split(' ')[1];
        let title = _get_result_title(parsecResult);
        let description = _get_result_description(parsecResult);
        let footnote = _get_result_footnote(parsecResult);
        let link = parsecResult.querySelector('a')?.getAttribute('href');
        let resultDict = {
          type: type ? type : '',
          title: title ? title : '',
          description: description ? description : '',
          footnote: footnote ? footnote : '',
          link: link ? link : '',
        };
        return resultDict;
      });
    } else if (project_type === 'sbs') {
      all_resultDict = [];
    }
    return all_resultDict;
  } catch (err) {
    console.log(err);
    return [];
  }
}

function getQueryText(project_type) {
  if (project_type === 'standard') {
    return document
      .querySelector('iframe')
      ?.contentDocument?.querySelector('.search input')
      ?.getAttribute('value');
  } else if (project_type === 'valid') {
    return document.querySelector('#widget-container h1')?.innerText;
  } else if (project_type === 'sbs') {
    return document.querySelector('.utterance')?.innerText;
  } else if (project_type === 'token') {
    return document.querySelector('#input-field')?.querySelector('input')
      ?.value;
  } else if (project_type === 'classify') {
    return document.querySelector('#display-section')?.querySelector('h1')
      ?.textContent;
  }
}

function getProjectLink_Id_Locale_Querycode() {
  const url = window.location['href'];
  const re_id_locale = /\/project\/(\S+?)\/grading\/(\S+?)\/s\/(\S+?)\//;
  const matched_array = url.match(re_id_locale);
  if (matched_array) {
    return [url, matched_array[1], matched_array[2], matched_array[3]];
  }
  return ['', '', '', ''];
}

function getSearchDateLocation(project_type) {
  if (project_type === 'standard') {
    const re_date = /from (.+?)\./;
    return document
      .querySelector('.message.blue')
      ?.querySelector('p')
      ?.firstChild.textContent.match(re_date)[1];
  } else if (project_type === 'sbs') {
    return document.querySelector('.html-widget-wrapper').querySelector('p')
      .textContent;
  }
}

function getGrader() {
  return document
    .querySelector('#dd-menu__shared_component__-1-item0')
    .innerText.trim()
    .replace(/ /g, '');
}

function getAnswer(project_type) {
  if (project_type === 'standard') {
    let _ans = [];
    [...Array(MAX_STANDARD_ANSWER_LEN).keys()].forEach((el) => {
      if (
        document.getElementById(
          `result${el}_validationresult${el}_inappropriate`
        )?.checked
      ) {
        _ans.push('i');
        return;
      }
      if (
        document.getElementById(
          `result${el}_validationresult${el}_wrong_language`
        )?.checked
      ) {
        _ans.push('l');
        return;
      }
      if (
        document.getElementById(
          `result${el}_validationresult${el}_cannot_be_judged`
        )?.checked
      ) {
        _ans.push('x');
        return;
      }
      if (document.getElementById(`result${el}_relevanceexcellent`)?.checked) {
        _ans.push('e');
        return;
      }
      if (document.getElementById(`result${el}_relevancegood`)?.checked) {
        _ans.push('g');
        return;
      }
      if (document.getElementById(`result${el}_relevancefair`)?.checked) {
        _ans.push('f');
        return;
      }
      if (document.getElementById(`result${el}_relevancebad`)?.checked) {
        _ans.push('b');
        return;
      }
    });
    const ans_str = _ans.join('');
    return ans_str;
  } else if (project_type === 'sbs') {
    let ans_str;
    // check if not validation
    if (document.querySelector('#query_validationno_context')?.checked) {
      ans_str = '1';
    } else if (
      document.querySelector('#query_validationno_incomplete')?.checked
    ) {
      ans_str = '2';
    } else if (
      document.querySelector('#query_validationno_contradictory')?.checked
    ) {
      ans_str = '3';
    } else if (document.querySelector('#query_validationno_other')?.checked) {
      ans_str = '4';
      let comment = document.querySelector('textarea').value;
      if (comment) {
        ans_str += ' ' + comment;
      }
    }
    if (ans_str) return ans_str;
    // check if identical
    if (document.querySelector('#identical_responsesyes')?.checked) {
      return 's';
    }
    // check which preference and if comment ans_str existed
    // get comment
    let comment = document.querySelector('textarea').value;
    // get preference
    let _selectedPos, pref;
    let nodeList = document.querySelectorAll('#selection-group-wrapper li');
    nodeList.forEach((el, count) => {
      if (el.querySelector('input.selected')) {
        _selectedPos = count;
      }
    });
    if (_selectedPos === 0) {
      pref = 'aaa';
    } else if (_selectedPos === 1) {
      pref = 'aa';
    } else if (_selectedPos === 2) {
      pref = 'a';
    } else if (_selectedPos === 3) {
      pref = 'w';
    } else if (_selectedPos === 4) {
      pref = 'd';
    } else if (_selectedPos === 5) {
      pref = 'dd';
    } else if (_selectedPos === 6) {
      pref = 'ddd';
    }
    ans_str = pref + ' ' + comment;
    return ans_str;
  } else if (project_type === 'valid') {
    let ans_str;
    if (document.querySelector('#query_validationquery_vague')?.checked) {
      ans_str = 'v';
    } else if (
      document.querySelector('#query_validationquery_inappropriate')?.checked
    ) {
      ans_str = 'i';
    } else if (
      document.querySelector('#query_validationquery_wrong_language')?.checked
    ) {
      ans_str = 'l';
    } else if (document.querySelector('#query_validationvalid')?.checked) {
      ans_str = 'n';
    } else if (document.querySelector('#query_validationother')?.checked) {
      ans_str = '@';
    }
    return ans_str;
  }
}

function getQueryPostData() {
  try {
    let [query_link, project_id, locale, query_code] =
      getProjectLink_Id_Locale_Querycode(); // must
    let project_type = getProjectType(project_id);
    let searchDateLocation = getSearchDateLocation(project_type); // optional
    let query_text = getQueryText(project_type); // optional
    let grader_ans = getAnswer(project_type); // must
    let grader = getGrader(); // must
    let results = getResults(project_type); // optional
    let data = {
      searchDateLocation: searchDateLocation,
      query_text: query_text,
      query_link: query_link,
      grader_ans: grader_ans,
      grader: grader,
      project_id: project_id,
      locale: locale,
      query_code: query_code,
      results: results,
    };
    return data;
  } catch (err) {
    console.log(err);
  }
}

//********************Pop up*********************/
function getLocaleFromPopup() {
  try {
    const message = document.querySelector('#swal2-content').innerText;
    const pos = document.querySelector('#swal2-content').innerText.search('_');
    const locale = message.substring(pos - 2, pos + 3);
    if (locale) {
      return locale;
    }
  } catch (err) {
    return;
  }
}

function getProjectId() {
  const url = window.location['href'];
  const re_id = /\/project\/(\S+?)\//;
  const matched_array = url.match(re_id);
  if (matched_array) {
    return matched_array[1];
  }
  return;
}

function getPopUpPostData() {
  // get locale
  const locale = getLocaleFromPopup();
  // get project id
  const project_id = getProjectId();
  // get grader name
  const grader = getGrader();
  if (!locale || !project_id || !grader) return;
  const data = {
    project_id: project_id,
    locale: locale,
    grader: grader,
  };
  return data;
}

function sendPost() {
  let url = `https://aidi-work-helper.herokuapp.com/api/v1/query?insertAns=${getInsertedAllowed(
    nextBtn
  )}`;
  let data = getQueryPostData();
  if (!data) return;
  $.ajax({
    type: 'POST',
    data: data,
    url: url,
    success: function (success) {
      console.log(data);
      console.log(success);
    },
    error: function (err) {
      console.log(data);
      console.log(err);
    },
  });
}

let nextBtn, sentNotice, popUpWindow;
let interval_fn = setInterval(() => {
  nextBtn = getNextBtn();
  sentNotice = getSentNotice(); // only for using short-cut (Ctrl+]) users
  popUpWindow = getPopUpWindow();
  // click the next-btn
  if (nextBtn) {
    // for program user
    if (!nextBtn.onclick) {
      nextBtn.onclick = sendPost;
    }
    // for hand-clicked button user
    if (!nextBtn.onmousedown) {
      nextBtn.onmousedown = sendPost;
    }
    // for short-cut user
    if (!document.onkeydown) {
      document.onkeydown = (e) => {
        if (
          e.ctrlKey && // if pressed Ctrl key
          sentNotice && // if sentNotice exist
          sentNotice.getAttribute('sent') !== 'yes' // if sentNotice btn has not set to sent=yes
        ) {
          sendPost();
          sentNotice.setAttribute('sent', 'yes'); // avoid to repeated sending
        }
      };
    }
  }

  if (popUpWindow) {
    if (!popUpWindow.onclick) {
      popUpWindow.onclick = () => {
        let data = getPopUpPostData();
        let url =
          'https://aidi-work-helper.herokuapp.com/api/v1/project/status';
        if (data) {
          $.ajax({
            type: 'POST',
            data: data,
            url: url,
            success: function () {
              alert(
                `Good! pop-up is updated\n\nproject: ${data.project_id}\nlocale: ${data.locale}`
              );
            },
            error: function () {
              alert('Bad.\nNot updated.\nCheck the connect please.');
            },
          });
        } else {
          alert('Bad\nNot updated');
        }
      };
    }
  }
}, 5000);
