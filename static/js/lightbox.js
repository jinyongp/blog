window.addEventListener("DOMContentLoaded", async () => {
  const article = document.querySelector("article.content");
  if (!article) return;

  const images = [...article.querySelectorAll("img")];
  const sources = images.map((image) => ({ src: image.src }));

  const link = "https://cdnjs.cloudflare.com/ajax/libs/photoswipe/5.3.8";
  const [{ default: PhotoSwipeLightbox }, { default: PhotoSwipe }] =
    await Promise.all([
      import(`${link}/photoswipe-lightbox.esm.min.js`),
      import(`${link}/photoswipe.esm.min.js`),
    ]);

  const lightbox = new PhotoSwipeLightbox({
    pswpModule: PhotoSwipe,
    showHideAnimationType: "none",
    bgOpacity: 0.8,
  });

  lightbox.addFilter("useContentPlaceholder", () => false);
  lightbox.init();

  article.addEventListener("click", (event) => {
    if (event.target instanceof HTMLImageElement) {
      lightbox.loadAndOpen(images.indexOf(event.target), sources);
    }
  });
});