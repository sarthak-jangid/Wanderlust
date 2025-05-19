// const filters = document.querySelectorAll(".filter");
// filters.forEach((filter) => {
//   filter.addEventListener("click", function () {
//     const category = filter.querySelector("p").innerText;
//     filter.classList.add("active");
// ;
//     window.location.href = `/listings/category?category=${encodeURIComponent(
//       category

//     )}`;

//   });
// });

const filters = document.querySelectorAll(".filter");

// Get current category from URL
const urlParams = new URLSearchParams(window.location.search);
const currentCategory = urlParams.get("category");

filters.forEach((filter) => {
  const filterText = filter.querySelector("p").innerText;

  // Set active class if this is current category
  // console.log(filterText, currentCategory);

  if (currentCategory && filterText === currentCategory) {
    filter.classList.add("active");
  }

  filter.addEventListener("click", function () {
    // Remove active class from all filters
    filters.forEach((f) => f.classList.remove("active"));

    // Add active class to clicked filter
    filter.classList.add("active");

    const category = filter.querySelector("p").innerText;
    window.location.href = `/listings/category?category=${encodeURIComponent(
      category
    )}`;
  });
});
