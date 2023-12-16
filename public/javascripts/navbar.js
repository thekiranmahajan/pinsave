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
