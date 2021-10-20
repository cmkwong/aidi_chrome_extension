let time_fn = setInterval(() => {
  // First
  let project_name_el = document.querySelector("#project-name");
  if (project_name_el) {
    if (project_name_el.getAttribute("listener") !== "true") {
      project_name_el.addEventListener("mouseenter", () => {
        console.log(document.querySelector("#project-name").innerText.trim());
        //project_name_el_click = e.target;
        project_name_el.setAttribute("listener", "true");
      });
    }
  }
  // Second
  let message_el = document.querySelector(".message");
  if (message_el) {
    if (message_el.getAttribute("listener") !== "true") {
      message_el.addEventListener("click", () => {
        console.log("abc here");
        message_el.setAttribute("listener", "true");
      });
    }
  }
  // Third
  let title_el = document.querySelector(".header-wrapper");
  if (title_el) {
    if (title_el.getAttribute("listener") !== "true") {
      title_el.addEventListener("click", () => {
        console.log("asasdasdasdasdasdasdasdasdasda");
        title_el.setAttribute("listener", "true");
      });
    }
  }
}, 1000);
