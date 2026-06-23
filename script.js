/**
 * ROYAL PALACE LUXURY HOTEL — Main Script
 * Handles all interactivity, animations, and form validation
 */

document.addEventListener('DOMContentLoaded', () => {
  // =========================================================
  // 1. LOADER
  // =========================================================
  const loader = document.getElementById('loader');
  
  // Hide loader after minimum time or when everything is loaded
  const hideLoader = () => {
    if (loader) {
      loader.classList.add('hidden');
      // Trigger initial animations after loader hides
      setTimeout(initRevealAnimations, 500);
    }
  };

  // Wait for window load but with a fallback timeout
  window.addEventListener('load', hideLoader);
  setTimeout(hideLoader, 2500); // Fallback

  // =========================================================
  // 2. NAVIGATION & MOBILE MENU
  // =========================================================
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  const navLinkItems = document.querySelectorAll('.nav-link');

  // Handle scroll effect for navbar
  const handleScroll = () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    
    // Handle Back to Top button visibility
    const backToTop = document.getElementById('backToTop');
    if (backToTop) {
      if (window.scrollY > 500) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });

  // Mobile menu toggle
  const toggleMenu = () => {
    if (hamburger && navLinks) {
      hamburger.classList.toggle('active');
      navLinks.classList.toggle('open');
      const isExpanded = hamburger.getAttribute('aria-expanded') === 'true';
      hamburger.setAttribute('aria-expanded', !isExpanded);
    }
  };

  if (hamburger) {
    hamburger.addEventListener('click', toggleMenu);
  }

  // Close mobile menu when link is clicked
  navLinkItems.forEach(link => {
    link.addEventListener('click', () => {
      if (navLinks && navLinks.classList.contains('open')) {
        toggleMenu();
      }
    });
  });

  // =========================================================
  // 3. SCROLL ANIMATIONS (Intersection Observer)
  // =========================================================
  const initRevealAnimations = () => {
    const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
    
    const revealOptions = {
      root: null,
      rootMargin: '0px 0px -100px 0px',
      threshold: 0.1
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, revealOptions);

    revealElements.forEach(el => {
      revealObserver.observe(el);
    });
  };

  // =========================================================
  // 4. NUMBER COUNTER ANIMATION
  // =========================================================
  const statNumbers = document.querySelectorAll('.stat-num');
  
  const animateCounters = (entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = entry.target;
        const countTo = parseInt(target.getAttribute('data-count'), 10);
        const duration = 2000; // 2 seconds
        const frames = 60;
        const step = countTo / (duration / (1000 / frames));
        let currentCount = 0;

        const updateCounter = () => {
          currentCount += step;
          if (currentCount < countTo) {
            target.innerText = Math.ceil(currentCount);
            requestAnimationFrame(updateCounter);
          } else {
            target.innerText = countTo;
          }
        };

        requestAnimationFrame(updateCounter);
        observer.unobserve(target);
      }
    });
  };

  const counterObserver = new IntersectionObserver(animateCounters, { threshold: 0.5 });
  statNumbers.forEach(stat => counterObserver.observe(stat));

  // =========================================================
  // 5. HERO PARTICLES
  // =========================================================
  const createParticles = () => {
    const container = document.getElementById('heroParticles');
    if (!container) return;
    
    const particleCount = 20;

    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      
      // Random properties
      const size = Math.random() * 4 + 2;
      const left = Math.random() * 100;
      const duration = Math.random() * 15 + 10;
      const delay = Math.random() * 5;
      
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.background = Math.random() > 0.5 ? 'rgba(201, 168, 76, 0.4)' : 'rgba(255, 255, 255, 0.2)';
      particle.style.left = `${left}%`;
      particle.style.animationDuration = `${duration}s`;
      particle.style.animationDelay = `${delay}s`;
      
      container.appendChild(particle);
    }
  };
  createParticles();

  // =========================================================
  // 6. TESTIMONIALS CAROUSEL
  // =========================================================
  const track = document.getElementById('testimonialsTrack');
  const dotsContainer = document.getElementById('carouselDots');
  
  if (track && dotsContainer) {
    const cards = Array.from(document.querySelectorAll('.testimonial-card'));
    let currentIndex = 0;
    
    // Calculate cards per view based on window width
    const getCardsPerView = () => {
      if (window.innerWidth <= 768) return 1;
      if (window.innerWidth <= 1024) return 2;
      return 3;
    };

    const updateCarousel = () => {
      const cardsPerView = getCardsPerView();
      const maxIndex = Math.max(0, cards.length - cardsPerView);
      
      // Ensure index is within bounds
      currentIndex = Math.min(currentIndex, maxIndex);
      
      // Calculate gap dynamically (28px matches CSS)
      const gap = window.innerWidth <= 768 ? 0 : 28;
      const cardWidth = cards[0].offsetWidth;
      const moveAmount = (cardWidth + gap) * currentIndex;
      
      track.style.transform = `translateX(-${moveAmount}px)`;
      
      // Update dots
      Array.from(dotsContainer.children).forEach((dot, i) => {
        dot.classList.toggle('active', i === currentIndex);
      });
    };

    // Create dots
    const createDots = () => {
      dotsContainer.innerHTML = '';
      const cardsPerView = getCardsPerView();
      const maxIndex = Math.max(0, cards.length - cardsPerView);
      
      for (let i = 0; i <= maxIndex; i++) {
        const dot = document.createElement('button');
        dot.className = `carousel-dot ${i === currentIndex ? 'active' : ''}`;
        dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
        dot.addEventListener('click', () => {
          currentIndex = i;
          updateCarousel();
        });
        dotsContainer.appendChild(dot);
      }
    };

    // Global functions for buttons
    window.carouselNext = () => {
      const maxIndex = Math.max(0, cards.length - getCardsPerView());
      if (currentIndex < maxIndex) {
        currentIndex++;
        updateCarousel();
      } else {
        currentIndex = 0; // loop back
        updateCarousel();
      }
    };

    window.carouselPrev = () => {
      if (currentIndex > 0) {
        currentIndex--;
        updateCarousel();
      } else {
        const maxIndex = Math.max(0, cards.length - getCardsPerView());
        currentIndex = maxIndex;
        updateCarousel();
      }
    };

    // Initialize carousel
    createDots();
    window.addEventListener('resize', () => {
      createDots();
      updateCarousel();
    });

    // Auto-play
    setInterval(window.carouselNext, 5000);
  }

  // =========================================================
  // 7. LIGHTBOX GALLERY
  // =========================================================
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const galleryItems = document.querySelectorAll('.gallery-item img');
  let currentImageIndex = 0;

  if (lightbox && lightboxImg && lightboxCaption && galleryItems.length > 0) {
    const galleryData = Array.from(galleryItems).map(img => ({
      src: img.src,
      caption: img.nextElementSibling.querySelector('.gallery-caption').textContent
    }));

    window.openLightbox = (index) => {
      currentImageIndex = index;
      lightboxImg.src = galleryData[index].src;
      lightboxCaption.textContent = galleryData[index].caption;
      lightbox.style.display = 'flex';
      document.body.style.overflow = 'hidden'; // Prevent scrolling
    };

    window.closeLightbox = () => {
      lightbox.style.display = 'none';
      document.body.style.overflow = 'auto'; // Restore scrolling
    };

    window.lightboxNext = () => {
      currentImageIndex = (currentImageIndex + 1) % galleryData.length;
      window.openLightbox(currentImageIndex);
    };

    window.lightboxPrev = () => {
      currentImageIndex = (currentImageIndex - 1 + galleryData.length) % galleryData.length;
      window.openLightbox(currentImageIndex);
    };

    // Keyboard navigation for lightbox
    document.addEventListener('keydown', (e) => {
      if (lightbox.style.display === 'flex') {
        if (e.key === 'Escape') window.closeLightbox();
        if (e.key === 'ArrowRight') window.lightboxNext();
        if (e.key === 'ArrowLeft') window.lightboxPrev();
      }
    });
  }

  // =========================================================
  // 8. BOOKING FORM VALIDATION
  // =========================================================
  const form = document.getElementById('bookingForm');
  const modal = document.getElementById('bookingModal');
  const modalRef = document.getElementById('modalRef');
  
  // Set minimum date for Check-In to today
  const checkInInput = document.getElementById('checkIn');
  const checkOutInput = document.getElementById('checkOut');
  
  const today = new Date().toISOString().split('T')[0];
  if(checkInInput) checkInInput.min = today;
  
  // Ensure check-out is after check-in
  if(checkInInput && checkOutInput) {
    checkInInput.addEventListener('change', () => {
      checkOutInput.min = checkInInput.value;
      if(checkOutInput.value && checkOutInput.value < checkInInput.value) {
        checkOutInput.value = checkInInput.value;
      }
    });
  }

  // Set default dates (CheckIn = tomorrow, CheckOut = +3 days)
  if(checkInInput && checkOutInput && !checkInInput.value) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const threeDays = new Date();
    threeDays.setDate(tomorrow.getDate() + 2);
    
    checkInInput.value = tomorrow.toISOString().split('T')[0];
    checkOutInput.min = checkInInput.value;
    checkOutInput.value = threeDays.toISOString().split('T')[0];
  }

  // Pre-select room based on URL hash or clicking a button
  const preSelectRoom = () => {
    const roomSelect = document.getElementById('roomType');
    if (!roomSelect) return;

    // From URL hash
    if (window.location.hash.includes('room=')) {
      const type = window.location.hash.split('room=')[1];
      if (['deluxe', 'royal', 'presidential'].includes(type)) {
        roomSelect.value = type;
      }
    }
  };
  
  // Attach specific click handlers to "Book Now" buttons in Rooms section
  const attachRoomBookingEvents = () => {
    const roomSelect = document.getElementById('roomType');
    if (!roomSelect) return;

    const mapIdsToValues = {
      'bookDeluxeBtn': 'deluxe',
      'bookDeluxeOverlay': 'deluxe',
      'bookRoyalBtn': 'royal',
      'bookRoyalOverlay': 'royal',
      'bookPresidentialBtn': 'presidential',
      'bookPresidentialOverlay': 'presidential'
    };

    Object.keys(mapIdsToValues).forEach(id => {
      const btn = document.getElementById(id);
      if (btn) {
        btn.addEventListener('click', () => {
          roomSelect.value = mapIdsToValues[id];
          // Optionally highlight the select briefly
          roomSelect.style.borderColor = 'var(--gold)';
          setTimeout(() => roomSelect.style.borderColor = '', 1000);
        });
      }
    });
  };

  preSelectRoom();
  attachRoomBookingEvents();

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePhone = (phone) => {
    // Basic phone validation allowing plus, spaces, dashes
    return /^[\d\+\-\s\(\)]{8,20}$/.test(phone);
  };

  const showError = (input, errorId, message) => {
    input.classList.add('error');
    const errorSpan = document.getElementById(errorId);
    if(errorSpan) errorSpan.textContent = message;
    return false;
  };

  const clearError = (input, errorId) => {
    input.classList.remove('error');
    const errorSpan = document.getElementById(errorId);
    if(errorSpan) errorSpan.textContent = '';
    return true;
  };

  if(form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;

      // Validate Name
      const name = document.getElementById('guestName');
      if (!name.value.trim()) {
        isValid = showError(name, 'nameError', 'Full name is required');
      } else {
        clearError(name, 'nameError');
      }

      // Validate Email
      const email = document.getElementById('guestEmail');
      if (!email.value.trim()) {
        isValid = showError(email, 'emailError', 'Email address is required');
      } else if (!validateEmail(email.value)) {
        isValid = showError(email, 'emailError', 'Please enter a valid email address');
      } else {
        clearError(email, 'emailError');
      }

      // Validate Phone
      const phone = document.getElementById('guestPhone');
      if (!phone.value.trim()) {
        isValid = showError(phone, 'phoneError', 'Phone number is required');
      } else if (!validatePhone(phone.value)) {
        isValid = showError(phone, 'phoneError', 'Please enter a valid phone number');
      } else {
        clearError(phone, 'phoneError');
      }

      // Validate Room Selection
      const room = document.getElementById('roomType');
      if (!room.value) {
        isValid = showError(room, 'roomError', 'Please select a room type');
      } else {
        clearError(room, 'roomError');
      }

      // If valid, show success modal
      if (isValid) {
        // Generate random reference number
        const refChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let ref = 'RPH-';
        for (let i = 0; i < 6; i++) {
          ref += refChars.charAt(Math.floor(Math.random() * refChars.length));
        }
        
        if(modalRef) modalRef.textContent = ref;
        
        // Show modal and reset form
        if (modal) {
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        }
        form.reset();
        
        // Reset custom dates
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const threeDays = new Date();
        threeDays.setDate(tomorrow.getDate() + 2);
        checkInInput.value = tomorrow.toISOString().split('T')[0];
        checkOutInput.value = threeDays.toISOString().split('T')[0];
      }
    });
  }

  // Clear errors on input
  document.querySelectorAll('.form-input').forEach(input => {
    input.addEventListener('input', () => {
      if (input.classList.contains('error')) {
        let finalErrorId = '';
        if (input.id === 'guestName') finalErrorId = 'nameError';
        else if (input.id === 'guestEmail') finalErrorId = 'emailError';
        else if (input.id === 'guestPhone') finalErrorId = 'phoneError';
        else if (input.id === 'roomType') finalErrorId = 'roomError';
        else if (input.id === 'checkIn') finalErrorId = 'checkInError';
        else if (input.id === 'checkOut') finalErrorId = 'checkOutError';
        
        if (finalErrorId) clearError(input, finalErrorId);
      }
    });
  });

  window.closeModal = () => {
    if(modal) modal.style.display = 'none';
    document.body.style.overflow = 'auto';
  };

  // Close modal on escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.style.display === 'flex') {
      window.closeModal();
    }
  });

  // =========================================================
  // 9. BACK TO TOP BUTTON
  // =========================================================
  const backToTopBtn = document.getElementById('backToTop');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
});
