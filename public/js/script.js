(() => {
  "use strict";
  const forms = document.querySelectorAll(".needs-validation");
  Array.from(forms).forEach((form) => {
    form.addEventListener(
      "submit",
      (event) => {
        if (!form.checkValidity()) {
          event.preventDefault();
          event.stopPropagation();
        }
        form.classList.add("was-validated");
      },
      false
    );
  });
})();

let explore = document.querySelector("#explore");

explore.addEventListener("mouseenter", (e) => {
  let exploreIcon = document.querySelector("#nav-icon");
  exploreIcon.style.transition = "transform 0.4s ease-in-out";
  exploreIcon.style.transform = "rotate(180deg)";
});

explore.addEventListener("mouseout", (e) => {
  let exploreIcon = document.querySelector("#nav-icon");
  exploreIcon.style.transition = "transform 0.4s ease-in-out";
  exploreIcon.style.transform = "rotate(-180deg)";
});
