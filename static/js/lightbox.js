setupLightbox();

function setupLightbox() {
  if (document.readyState === "loading") {
    return setTimeout(setupLightbox, 100);
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

      window.addEventListener(
        "keydown",
        (event) => event.key === "Escape" && resetLightbox(),
        { once: true },
      );
      window.addEventListener(
        "wheel",
        (event) => event.deltaY && resetLightbox(),
        { once: true },
      );
      window.addEventListener(
        "touchmove",
        (event) => event.touches.length && resetLightbox(),
        { once: true },
      );
      lightbox.addEventListener("click", resetLightbox, { once: true });
    }
  });

  function resetLightbox() {
    setTimeout(() => (lightbox.innerHTML = ""), 300);
    lightbox.firstElementChild?.classList.remove("show");
  }
}
