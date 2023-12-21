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

// Get references to elements
const dropdownMenu = document.getElementById("dropdownMenu");
const icons = document.querySelectorAll(".icon");
const contentSections = document.querySelectorAll(".dropdown-content");

// Function to hide all content sections
function hideAllContent() {
  contentSections.forEach((section) => {
    section.classList.add("hidden");
  });
}

// Function to handle icon clicks
function handleIconClick(contentToShow) {
  hideAllContent();
  contentToShow.classList.remove("hidden");
  dropdownMenu.classList.remove("hidden");
}

// Event listener for icon clicks
icons.forEach((icon) => {
  icon.addEventListener("click", () => {
    const contentId = icon.dataset.content;
    const contentToShow = document.getElementById(contentId);
    if (contentToShow) {
      handleIconClick(contentToShow);
    } else {
      hideAllContent();
      dropdownMenu.classList.add("hidden");
    }
  });
});

// To handle click on screen elsewhere
document.addEventListener("click", (event) => {
  const isClickInsideDropdown = dropdownMenu.contains(event.target);
  const isClickInsideIcon = Array.from(icons).some((icon) =>
    icon.contains(event.target)
  );

  if (!isClickInsideDropdown && !isClickInsideIcon) {
    hideAllContent();
    dropdownMenu.classList.add("hidden");
  }
});
