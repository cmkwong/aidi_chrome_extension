const updateSection = document.getElementsByClassName("updateSection");
const updateStatus = document.getElementById("updateStatus");

function getLocaleFromPopup() {
  try {
    const message = document.querySelector("#swal2-content").innerText;
    const pos = document.querySelector("#swal2-content").innerText.search("_");
    const locale = message.substring(pos - 2, pos + 3);
    if (locale) {
      return locale;
    }
  } catch (err) {
    return false;
  }
}

function getProjectId() {
  const url = window.location["href"];
  const re_id = /\/project\/(\S+?)\/grading\//;
  const matched_array = url.match(re_id);
  if (matched_array) {
    return matched_array[1];
  }
  return false;
}

function getGrader() {
  let grader;
  try {
    grader = document
      .querySelector("#dd-menu__shared_component__-1-item0")
      .innerText.trim()
      .replace(" ", "");
  } catch {}
  return grader;
}

function getPostData(project_id, locale, grader) {
  const data = {
    project_id: project_id,
    locale: locale,
    grader: grader,
  };
  return data;
}

function messageHtml(project_id, locale, success) {
  if (success) {
    return `
    <div class="info">${project_id}(${locale})</div>
    <div class="success">Pop-up Updated</div>
    `;
  } else {
    return `
    <div class="info">${project_id}(${locale})</div>
    <div class="fail">Pop-up Not Updated</div>
    `;
  }
}

async function postData(url = "", data = {}) {
  // Default options are marked with *
  const response = await fetch(url, {
    method: "POST", // *GET, POST, PUT, DELETE, etc.
    mode: "cors", // no-cors, *cors, same-origin
    cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
    credentials: "same-origin", // include, *same-origin, omit
    headers: {
      "Content-Type": "application/json",
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: "follow", // manual, *follow, error
    referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: JSON.stringify(data), // body data type must match "Content-Type" header
  });
  return response.json(); // parses JSON response into native JavaScript objects
}

updateStatus.addEventListener("click", () => {
  // get locale
  const locale = getLocaleFromPopup();
  // get project id
  const prj_id = getProjectId();
  // get grader name
  const grader = getGrader();
  console.log(locale, prj_id, grader);
  if (locale && prj_id && grader) {
    // send post request
    const url = "https://aidi-work-helper.herokuapp.com/api/v1/project/status";
    const data = getPostData();
    postData(url, data).then((res) => {
      if (res.status === "success") {
        updateSection.append(
          messageHtml(res.data.project_id, res.data.locale, true)
        );
      } else {
        updateSection.append(
          messageHtml(res.data.project_id, res.data.locale, false)
        );
      }
    });
  } else {
    console.log("no message");
  }
});
