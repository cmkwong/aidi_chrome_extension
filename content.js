let time_fn = setInterval(() => {
  // First
  let project_name_el = document.querySelector("#project-name");
  if (project_name_el) {
    if (!project_name_el.onclick) {
      project_name_el.onclick = () => {
        console.log(document.querySelector("#project-name").innerText.trim());
      };
    }
  }
  // Second
  let message_el = document.querySelector(".message");
  if (message_el) {
    if (!message_el.onclick) {
      message_el.onclick = () => {
        console.log("abc here");
      };
    }
  }
  // Third
  let title_el = document.querySelector(".header-wrapper");
  if (title_el) {
    if (!title_el.onclick) {
      title_el.onclick = () => {
        console.log("asasdasdasdasdasdasdasdasdasda");
      };
    }
  }
}, 1000);
