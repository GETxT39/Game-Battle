const button = document.querySelector(".play");
const gameplay = document.querySelector(".gameplay");
const menu = document.querySelector(".menu");

button.addEventListener("click", (e) => {
  gameplay.style.display = "block";
  menu.style.display = "none";
});

addEventListener("keyup", (e) => {
  if (e.key === "p" || e.key === "P") {
    if (start === true) {
      start = false;
    } else if (start === false) start = true;
  }
});
