window.addEventListener("DOMContentLoaded", () => {
  const scrollToTopButton = document.getElementById("js-scroll-back-to-top");

  if (scrollToTopButton) {
    scrollToTopButton.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });

    window.addEventListener("scroll", () => {
      if (window.scrollY > 500) {
        scrollToTopButton.classList.remove("hide");
      } else if (window.scrollY < 100) {
        scrollToTopButton.classList.add("hide");
      }
    });
  }
});
