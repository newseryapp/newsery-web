(() => {
  const toggleButton = document.querySelector(".nav__menuBtn");
  const drawer = document.getElementById("navDrawer");

  if (!toggleButton || !drawer) return;

  const closeButtons = drawer.querySelectorAll("[data-navdrawer-close]");
  const drawerLinks = drawer.querySelectorAll("[data-navdrawer-link]");

  const setOpen = (isOpen) => {
    if (isOpen) {
      drawer.classList.add("navDrawer--open");
      drawer.setAttribute("aria-hidden", "false");
      toggleButton.setAttribute("aria-expanded", "true");
      document.body.classList.add("is-navDrawerOpen");

      const firstLink = drawer.querySelector("[data-navdrawer-link]");
      if (firstLink && typeof firstLink.focus === "function") firstLink.focus();
      return;
    }

    drawer.classList.remove("navDrawer--open");
    drawer.setAttribute("aria-hidden", "true");
    toggleButton.setAttribute("aria-expanded", "false");
    document.body.classList.remove("is-navDrawerOpen");

    if (typeof toggleButton.focus === "function") toggleButton.focus();
  };

  toggleButton.addEventListener("click", () => {
    setOpen(!drawer.classList.contains("navDrawer--open"));
  });

  closeButtons.forEach((btn) => btn.addEventListener("click", () => setOpen(false)));
  drawerLinks.forEach((link) => link.addEventListener("click", () => setOpen(false)));

  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    if (!drawer.classList.contains("navDrawer--open")) return;
    setOpen(false);
  });
})();
