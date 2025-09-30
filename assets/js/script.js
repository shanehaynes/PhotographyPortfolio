// Infinite scroll functionality disabled for GitHub Pages static hosting
// This functionality would require a backend server to provide pagination

document.addEventListener("DOMContentLoaded", function () {
  const lightbox = document.getElementById("lightbox");
  const lightboxImage = document.getElementById("lightbox-image");
  const lightboxDescription = document.getElementById("lightbox-description");
  const lightboxDate = document.getElementById("lightbox-date");
  const prevArrow = document.getElementById("prev-arrow");
  const nextArrow = document.getElementById("next-arrow");

  let images = Array.from(document.querySelectorAll(".gallery-item img"));
  let currentIndex = 0;

  // Lazy Loading Support - Add loaded class when images finish loading
  images.forEach((img) => {
    // If image is already loaded (cached)
    if (img.complete && img.naturalHeight !== 0) {
      img.classList.add('loaded');
    }
    
    // Add load event listener for images still loading
    img.addEventListener('load', function() {
      this.classList.add('loaded');
    });
    
    // Handle load errors gracefully
    img.addEventListener('error', function() {
      console.warn('Failed to load image:', this.src);
      this.classList.add('loaded'); // Still add loaded class to avoid permanent opacity
    });
  });

  function openLightbox(index) {
    if (index < 0) index = images.length - 1;
    if (index >= images.length) index = 0;

    currentIndex = index;
    lightboxImage.src = images[currentIndex].src;
    lightboxDate.innerText = images[currentIndex].dataset.date;    lightboxDescription.innerText = images[currentIndex].dataset.title;
    lightbox.classList.add("show");
  }

  images.forEach((img, index) => {
    img.addEventListener("click", function () {
      openLightbox(index);
    });
  });

  // Close lightbox when clicking outside the image or pressing Esc
  lightbox.addEventListener("click", function (event) {
    if (event.target === lightbox) {
      lightbox.classList.remove("show");
    }
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      lightbox.classList.remove("show");
    } else if (event.key === "ArrowLeft") {
      openLightbox(currentIndex - 1);
    } else if (event.key === "ArrowRight") {
      openLightbox(currentIndex + 1);
    }
  });

  // Click events for arrow navigation
  prevArrow.addEventListener("click", function () {
    openLightbox(currentIndex - 1);
  });

  nextArrow.addEventListener("click", function () {
    openLightbox(currentIndex + 1);
  });
});

