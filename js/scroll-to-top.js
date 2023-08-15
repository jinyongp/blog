setupScrollToTop();

function setupScrollToTop() {
  if (document.readyState === "loading") {
    return setTimeout(setupScrollToTop, 100);
  }

  const scrollToTopButton = document.getElementById("js-scroll-back-to-top");
  if (!scrollToTopButton) return;

  scrollToTopButton.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  window.addEventListener("scroll", () => {
    if (window.scrollY > 500) {
      scrollToTopButton?.classList.remove("hide");
    } else if (window.scrollY < 100) {
      scrollToTopButton?.classList.add("hide");
    }
  });
}
