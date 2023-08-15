setupLightbox();

function setupLightbox() {
  if (document.readyState === "loading") {
    return setTimeout(setupScrollToTop, 100);
  }

  const article = document.querySelector("article.content");
  if (!article) return;

  const lightbox = document.createElement("div");
  lightbox.classList.add("lightbox");
  document.body.appendChild(lightbox);

  article.addEventListener("click", (event) => {
    if (event.target instanceof HTMLImageElement) {
      const image = document.createElement("img");
      image.src = event.target.src;
      lightbox.appendChild(image);
      setTimeout(() => image.classList.add("show"));
    }
  });

  lightbox.addEventListener("click", () => {
    setTimeout(() => (lightbox.innerHTML = ""), 150);
    lightbox.firstChild?.classList.remove("show");
  });
}
