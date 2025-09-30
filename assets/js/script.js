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

  // Touch event variables for swipe detection
  let touchStartX = 0;
  let touchEndX = 0;
  const minSwipeDistance = 50;

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
    lightboxDate.innerText = images[currentIndex].dataset.date;
    lightboxDescription.innerText = images[currentIndex].dataset.title;
    lightbox.classList.add("show");
    
    // Prevent body scrolling when lightbox is open (especially important on mobile)
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove("show");
    // Re-enable body scrolling
    document.body.style.overflow = '';
  }

  images.forEach((img, index) => {
    img.addEventListener("click", function () {
      openLightbox(index);
    });
  });

  // Close lightbox when clicking outside the image or pressing Esc
  lightbox.addEventListener("click", function (event) {
    if (event.target === lightbox) {
      closeLightbox();
    }
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      closeLightbox();
    } else if (event.key === "ArrowLeft") {
      openLightbox(currentIndex - 1);
    } else if (event.key === "ArrowRight") {
      openLightbox(currentIndex + 1);
    }
  });

  // Click events for arrow navigation
  prevArrow.addEventListener("click", function (e) {
    e.stopPropagation(); // Prevent lightbox from closing
    openLightbox(currentIndex - 1);
  });

  nextArrow.addEventListener("click", function (e) {
    e.stopPropagation(); // Prevent lightbox from closing
    openLightbox(currentIndex + 1);
  });

  // Touch events for mobile swipe navigation
  lightbox.addEventListener('touchstart', function(e) {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  lightbox.addEventListener('touchend', function(e) {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  }, { passive: true });

  function handleSwipe() {
    const swipeDistance = touchEndX - touchStartX;
    
    // Swipe left (show next image)
    if (swipeDistance < -minSwipeDistance) {
      openLightbox(currentIndex + 1);
    }
    // Swipe right (show previous image)
    else if (swipeDistance > minSwipeDistance) {
      openLightbox(currentIndex - 1);
    }
  }

  // Prevent image drag on desktop (interferes with touch events on mobile)
  lightboxImage.addEventListener('dragstart', function(e) {
    e.preventDefault();
  });

  // Double-tap to close on mobile
  let lastTap = 0;
  lightboxImage.addEventListener('touchend', function(e) {
    const currentTime = new Date().getTime();
    const tapLength = currentTime - lastTap;
    
    if (tapLength < 500 && tapLength > 0) {
      // Double tap detected
      closeLightbox();
      e.preventDefault();
    }
    lastTap = currentTime;
  });

  // Add pinch-to-zoom support for mobile
  // This is handled natively by the browser with the CSS touch-action property
  // No additional JavaScript needed for basic pinch-to-zoom

  // Optimize for mobile viewport changes (orientation change)
  window.addEventListener('orientationchange', function() {
    if (lightbox.classList.contains('show')) {
      // Adjust lightbox on orientation change
      setTimeout(function() {
        lightboxImage.style.maxHeight = '80vh';
      }, 100);
    }
  });
});
