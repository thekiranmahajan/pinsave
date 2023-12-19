const searchBar = document.getElementById("searchBar");
const searchIcon = document.getElementById("searchIcon");
const crossMarkIcon = document.getElementById("crossMarkIcon");

const updateIcons = () => {
  searchBar.classList.remove("placeholder-transparent");
  if (searchBar.value === "") {
    searchIcon.classList.remove("opacity-100");
    searchIcon.classList.add("opacity-0");
    crossMarkIcon.classList.add("opacity-0");
  } else {
    searchIcon.classList.add("opacity-0");
    crossMarkIcon.classList.remove("opacity-0");
  }
};
crossMarkIcon.addEventListener("click", () => {
  searchBar.value = "";
  crossMarkIcon.classList.add("opacity-0");
});
searchBar.addEventListener("focus", updateIcons);
searchBar.addEventListener("input", updateIcons);
searchBar.addEventListener("blur", () => {
  if (searchBar.value === "") {
    searchBar.classList.add("placeholder-transparent");
    searchIcon.classList.remove("opacity-0");
  }
});


const links = document.querySelectorAll(".btnlinks");
const setActive = (link) => {
  links.forEach((e) => {
    e.classList.remove("bg-black", "text-white");
    localStorage.removeItem(e.id);
  });

  link.classList.add("bg-black", "text-white");
  localStorage.setItem(link.id, "isActive");
};

links.forEach((link) => {
  link.addEventListener("click", () => {
    setActive(link);
  });
  if (localStorage.getItem(link.id) === "isActive") {
    setActive(link);
  }
});
