const MAX_STANDARD_ANSWER_LEN = 6;

function getNextBtn() {
  try {
    let [link, project_id, locale] = getProjectLinkIdLocale();
    let project_type = getProjectType(project_id);
    if (project_type === "standard") {
      return document.getElementsByClassName("forward-btn")[0];
    } else if (project_type === "sbs") {
      return document.getElementsByClassName("forward-btn")[0];
    }
  } catch {
    (err) => {
      console.log(err);
    };
  }
}

function getPopUpWindow() {
  return document.querySelector(".swal2-popup .swal2-header");
}

function getPopUpBtn() {
  return document.querySelector(".swal2-actions button");
}

// notInsert is for checking if answers allowed to insert to DB. If auto, forbidden, if manual, allowed.
function getInsertedAllowed(nextBtn) {
  try {
    if (nextBtn.classList.contains("notInsert")) {
      return "false";
    }
    return "true";
  } catch {
    (err) => {
      console.log(err);
    };
  }
}

function getProjectType(project_id) {
  // return project type: sbs, standard
  const re_sbs = /(sbs)/;
  const result = project_id.match(re_sbs);
  if (result) {
    return "sbs";
  } else return "standard";
}

function getResults(project_type) {
  let all_resultDict;
  if (project_type === "standard") {
    let all_parsecResult = [
      ...document
        .getElementsByClassName("iframe")[0]
        .getElementsByTagName("iframe")
        .item(0)
        .contentDocument.querySelectorAll(".parsec-result"),
    ];
    all_resultDict = all_parsecResult.map((parsecResult) => {
      let type = parsecResult.parentNode.className.split(" ")[1];
      let title = parsecResult.querySelector(".title")?.innerText;
      let description = [...parsecResult.querySelectorAll(".description")]
        ?.map((des) => des.innerText.substring(0, 200))
        .join("\n");
      let footnote = parsecResult.querySelector(".footnote")?.innerText;
      let link = parsecResult.querySelector("a")?.getAttribute("href");
      let resultDict = {
        type: type ? type : "",
        title: title ? title : "",
        description: description ? description : "",
        footnote: footnote ? footnote : "",
        link: link ? link : "",
      };
      return resultDict;
    });
  } else if (project_type === "sbs") {
    all_resultDict = [];
  }
  return all_resultDict;
}

function getResultLinks(project_type) {
  let all_resultLinkArray;
  if (project_type === "standard") {
    let all_parsecResult = [
      ...document
        .getElementsByClassName("iframe")[0]
        .getElementsByTagName("iframe")
        .item(0)
        .contentDocument.querySelectorAll(".parsec-result"),
    ];
    all_resultLinkArray = all_parsecResult.map((parsecResult) => {
      let link = parsecResult.querySelector("a")?.getAttribute("href");
      return link ? link : "NO LINK";
    });
  } else if (project_type === "sbs") {
    all_resultLinkArray = [];
  }
  return all_resultLinkArray;
}

function getQueryText(project_type) {
  if (project_type === "standard") {
    let query_txt = document
      .getElementsByClassName("iframe")[0]
      .getElementsByTagName("iframe")
      .item(0)
      .contentDocument.getElementsByClassName("search-input form-control")[0]
      .getAttribute("value");
    if (query_txt)
      return document
        .getElementsByClassName("iframe")[0]
        .getElementsByTagName("iframe")
        .item(0)
        .contentDocument.getElementsByClassName("search-input form-control")[0]
        .getAttribute("value");
  } else if (project_type === "valid") {
    return document.querySelector("#widget-container h1").innerText;
  } else if (project_type === "sbs") {
    return document.querySelector(".utterance").innerText;
  } else if (project_type === "token") {
    return document.querySelector("#input-field").querySelector("input").value;
  } else if (project_type === "classify") {
    return document.querySelector("#display-section").querySelector("h1")
      .textContent;
  }
}

function getProjectLinkIdLocale() {
  const url = window.location["href"];
  const re_id_locale = /\/project\/(\S+?)\/grading\/(\S+?)\//;
  const matched_array = url.match(re_id_locale);
  if (matched_array) {
    return [url, matched_array[1], matched_array[2]];
  }
  return ["", "", ""];
}

function getSearchDateLocation(project_type) {
  if (project_type === "standard") {
    const re_date = /from (.+?)\./;
    return document
      .querySelector(".message.blue")
      .querySelector("p")
      .firstChild.textContent.match(re_date)[1];
  } else if (project_type === "sbs") {
    return document.querySelector(".html-widget-wrapper").querySelector("p")
      .textContent;
  }
}

function getGrader() {
  return document
    .querySelector("#dd-menu__shared_component__-1-item0")
    .innerText.trim()
    .replace(" ", "");
}

function getAnswer(project_type) {
  if (project_type === "standard") {
    let _ans = [];
    [...Array(MAX_STANDARD_ANSWER_LEN).keys()].forEach((el) => {
      if (
        document.getElementById(
          `result${el}_validationresult${el}_inappropriate`
        )?.checked
      ) {
        _ans.push("i");
        return;
      }
      if (
        document.getElementById(
          `result${el}_validationresult${el}_wrong_language`
        )?.checked
      ) {
        _ans.push("l");
        return;
      }
      if (
        document.getElementById(
          `result${el}_validationresult${el}_cannot_be_judged`
        )?.checked
      ) {
        _ans.push("x");
        return;
      }
      if (document.getElementById(`result${el}_relevanceexcellent`)?.checked) {
        _ans.push("e");
        return;
      }
      if (document.getElementById(`result${el}_relevancegood`)?.checked) {
        _ans.push("g");
        return;
      }
      if (document.getElementById(`result${el}_relevancefair`)?.checked) {
        _ans.push("f");
        return;
      }
      if (document.getElementById(`result${el}_relevancebad`)?.checked) {
        _ans.push("b");
        return;
      }
    });
    const ans_str = _ans.join("");
    return ans_str;
  }
}

function getQueryPostData() {
  try {
    let [query_link, project_id, locale] = getProjectLinkIdLocale();
    let project_type = getProjectType(project_id);
    let searchDateLocation = getSearchDateLocation(project_type);
    let query_text = getQueryText(project_type);
    let grader_ans = getAnswer(project_type);
    let grader = getGrader();
    let results = getResults(project_type);
    let data = {
      searchDateLocation: searchDateLocation,
      query_text: query_text,
      query_link: query_link,
      grader_ans: grader_ans,
      grader: grader,
      project_id: project_id,
      locale: locale,
      results: results,
    };
    return data;
  } catch {
    (err) => {
      console.log(err);
    };
  }
}

//********************Pop up*********************/
function getLocaleFromPopup() {
  try {
    const message = document.querySelector("#swal2-content").innerText;
    const pos = document.querySelector("#swal2-content").innerText.search("_");
    const locale = message.substring(pos - 2, pos + 3);
    if (locale) {
      return locale;
    }
  } catch (err) {
    return;
  }
}

function getProjectId() {
  const url = window.location["href"];
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

let nextBtn, popUpWindow;
let interval_fn = setInterval(() => {
  // let message_el = document.querySelector(".message");
  nextBtn = getNextBtn();
  popUpWindow = getPopUpWindow();
  // click the next-btn
  if (nextBtn) {
    if (!nextBtn.onclick) {
      nextBtn.onclick = () => {
        let data = getQueryPostData();
        let url = `https://aidi-work-helper.herokuapp.com/api/v1/query?insertAns=${getInsertedAllowed(
          nextBtn
        )}`;
        $.ajax({
          type: "POST",
          data: data,
          url: url,
          success: function () {},
          error: function () {},
        });
      };
    }
  }
  if (popUpWindow) {
    if (!popUpWindow.onclick) {
      popUpWindow.onclick = () => {
        let data = getPopUpPostData();
        let url =
          "https://aidi-work-helper.herokuapp.com/api/v1/project/status";
        if (data) {
          $.ajax({
            type: "POST",
            data: data,
            url: url,
            success: function () {
              alert(
                `Good! pop-up is updated\n\nproject: ${data.project_id}\nlocale: ${data.locale}`
              );
            },
            error: function () {
              alert("Bad.\nNot updated.\nCheck the connect please.");
            },
          });
        } else {
          alert("Bad\nNot updated");
        }
      };
    }
  }
}, 1000);
