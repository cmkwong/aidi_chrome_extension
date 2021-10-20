// testing yahoo.com.hk
let title_el = document.querySelector("#header-wrapper");
title_el.addEventListener("click", () => {
  console.log(title_el.innerText);
});

let message_el = document.querySelector(".message");
message_el.addEventListener("click", () => {
  console.log("message clicked");
});
