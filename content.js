const MAX_STANDARD_ANSWER_LEN = 5;

function getNextBtn() {
  let [link, project_id, locale] = getProjectLinkIdLocale();
  let project_type = getProjectType(project_id);
  if (project_type === "standard") {
    return document.getElementById("grading-nav-next-shortcut");
  } else if (project_type === "sbs") {
    return document.getElementsByClassName("forward-btn")[0];
  }
}

function getPostUrl(nextBtn) {
  let url =
    "https://aidi-work-helper.herokuapp.com/api/v1/query?insertAns=true";
  if (nextBtn.getAttribute("a") === "a") {
    url = "https://aidi-work-helper.herokuapp.com/api/v1/query?insertAns=false";
  }
  return url;
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
        ?.map((des) => des.innerText)
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

function getQueryText(project_type) {
  if (project_type === "standard") {
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
  if (matched_array.length > 0) {
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

function getPostData() {
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
}

let interval_fn = setInterval(() => {
  // click the next-btn
  let nextBtn = getNextBtn();
  let message_el = document.querySelector(".message");
  if (message_el) {
    if (!message_el.onclick) {
      message_el.onclick = () => {
        let data = getPostData();
        let url = getPostUrl(nextBtn);
        console.log(data);
        $.ajax({
          type: "POST",
          data: data,
          url: url,
          success: function (output) {
            console.log(output);
          },
          error: function (err) {
            console.log(err);
          },
        });
      };
    }
  }
}, 1000);
