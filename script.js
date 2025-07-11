document.addEventListener("DOMContentLoaded", () => {
  /** === Carousel Slider === **/
  const carousel = document.getElementById("carousel");
  let slides = carousel?.querySelectorAll(".slide") || [];
  let currentIndex = 0;

  function getSlideWidth() {
    if (!slides.length) return 0;
    return slides[0].clientWidth + 20; // 20 = gap
  }

  function showSlide(index) {
    if (!carousel) return;
    const slideWidth = getSlideWidth();

    if (index >= slides.length) currentIndex = 0;
    else if (index < 0) currentIndex = slides.length - 1;
    else currentIndex = index;

    carousel.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
  }

  window.nextSlide = () => showSlide(currentIndex + 1);
  window.prevSlide = () => showSlide(currentIndex - 1);

  window.addEventListener("resize", () => {
    showSlide(currentIndex);
  });

  showSlide(currentIndex); // Initial display

  /** === Dynamic Gallery (Looped Pagination) === **/
  const totalImages = 18; // total number of images available
  const imagesPerPage = 8; // 3 rows x 4 columns
  let currentPage = 1;

  const galleryInner = document.querySelector(".gallery-inner");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");

  function renderGalleryPage(page) {
    if (!galleryInner) return;
    galleryInner.innerHTML = "";
    const start = (page - 1) * imagesPerPage + 1;
    const end = Math.min(start + imagesPerPage - 1, totalImages);

    for (let i = start; i <= end; i++) {
      const img = document.createElement("img");
      
      // Try to load the image with error handling
      img.onerror = function() {
        // If image doesn't exist, use a placeholder
        this.src = "images/placeholder.jpg";
        this.alt = "Image not available";
      };
      
      img.src = `images/vikas kame/image${i}.jpg`;
      img.alt = `Gallery Image ${i}`;
      img.className = "gallery-img";
      img.loading = "lazy"; // Add lazy loading for better performance

      const item = document.createElement("div");
      item.className = "gallery-item";
      item.appendChild(img);

      galleryInner.appendChild(item);
    }
  }

  function updateButtons() {
    if (!prevBtn || !nextBtn) return;
    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage * imagesPerPage >= totalImages;
  }

  // Function to update total images count
  function updateGallerySize(count) {
    if (count && count > 0) {
      totalImages = count;
      currentPage = 1;
      renderGalleryPage(currentPage);
      updateButtons();
    }
  }

  // Expose the function to window to allow updating from outside
  window.updateGallerySize = updateGallerySize;

  prevBtn?.addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage--;
      renderGalleryPage(currentPage);
      updateButtons();
    }
  });

  nextBtn?.addEventListener("click", () => {
    if (currentPage * imagesPerPage < totalImages) {
      currentPage++;
      renderGalleryPage(currentPage);
      updateButtons();
    }
  });

  if (galleryInner) {
    // Dynamically check how many images are available
    function checkImageAvailability() {
      let count = 0;
      let checking = true;
      let maxCheck = 100; // Set a reasonable upper limit
      
      function checkImage(index) {
        if (!checking || index > maxCheck) {
          // We've either found all images or reached the limit
          updateGallerySize(count);
          return;
        }
        
        const img = new Image();
        img.onload = function() {
          count = index;
          checkImage(index + 1);
        };
        
        img.onerror = function() {
          // If we get 3 consecutive errors, assume we've reached the end
          if (index > count + 3) {
            checking = false;
          }
          checkImage(index + 1);
        };
        
        img.src = `images/vikas kame/image${index}.jpg`;
      }
      
      // Start checking from image 1
      checkImage(1);
    }
    
    // Uncomment this line to automatically detect available images
    // checkImageAvailability();
    
    // For now, use the defined totalImages value
    renderGalleryPage(currentPage);
    updateButtons();
  }

  /** === Single Page Navigation === **/
  // Get all sections
  const sections = [
    document.getElementById("home"),
    document.getElementById("about"),
    document.getElementById("services"),
    document.getElementById("gallery"),
    document.getElementById("members"),
    document.getElementById("schemes")
  ].filter(section => section !== null);

  // Get the contact/footer section
  const contactSection = document.getElementById("contact");

  // Hide all sections except home initially
  sections.forEach(section => {
    if (section && section.id !== "home") {
      section.style.display = "none";
    }
  });

  // Get all navigation links
  const navLinks = document.querySelectorAll(".navbar nav ul li a");

  // Add click event to each navigation link
  navLinks.forEach(link => {
    link.addEventListener("click", function(e) {
      e.preventDefault();
      
      // Get the target section id
      const targetId = this.getAttribute("href").substring(1);
      
      // Hide all sections
      sections.forEach(section => {
        if (section) section.style.display = "none";
      });
      
      // Show the target section
      const targetSection = document.getElementById(targetId);
      if (targetSection) {
        targetSection.style.display = "block";
        
        // If home section, make sure carousel is initialized
        if (targetId === "home") {
          const carousel = document.getElementById("carousel");
          if (carousel) {
            // Reset carousel position
            carousel.style.transform = "translateX(0px)";
            currentIndex = 0;
          }
        }
      }
      
      // Always show the contact/footer section
      if (contactSection && targetId !== "contact") {
        contactSection.style.display = "block";
      }
      
      // Update active class on navigation links
      navLinks.forEach(navLink => {
        navLink.classList.remove("active");
      });
      this.classList.add("active");
      
      // Remove section separators
      const sectionSeparators = document.querySelectorAll(".section-separator");
      sectionSeparators.forEach(separator => {
        separator.style.display = "none";
      });
    });
  });

  // Set the first link as active by default and show the footer
  if (navLinks.length > 0) {
    navLinks[0].classList.add("active");
    if (contactSection) {
      contactSection.style.display = "block";
    }
  }
});
