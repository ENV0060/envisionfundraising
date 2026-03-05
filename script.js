/* ============================================
   ENVISION FUNDRAISING INC. — SHARED JAVASCRIPT
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- STICKY NAV SCROLL EFFECT ---------- */
  const nav = document.querySelector('.site-nav');
  if (nav) {
    const lerpColor = (a, b, t) => [
      Math.round(a[0] + (b[0] - a[0]) * t),
      Math.round(a[1] + (b[1] - a[1]) * t),
      Math.round(a[2] + (b[2] - a[2]) * t)
    ];

    const sampleGradient = (ratio, stops) => {
      const t = Math.max(0, Math.min(1, ratio));
      for (let i = 0; i < stops.length - 1; i++) {
        if (t >= stops[i][1] && t <= stops[i + 1][1]) {
          const localT = (t - stops[i][1]) / (stops[i + 1][1] - stops[i][1]);
          return lerpColor(stops[i][0], stops[i + 1][0], localT);
        }
      }
      return stops[stops.length - 1][0];
    };

    // Pick gradient stops based on page
    const isNavyPage = document.body.classList.contains('team-page') || document.body.classList.contains('partner-page');
    const gradientStops = isNavyPage
      ? [ /* Navy-based — team page body gradient */
          [[11, 31, 58], 0],    [[15, 28, 53], 0.15],
          [[13, 25, 48], 0.30], [[11, 22, 40], 0.50],
          [[10, 20, 36], 0.70], [[9, 19, 32], 0.85],
          [[8, 18, 32], 1.0]
        ]
      : [ /* Charcoal-based — homepage/default body gradient (darkened to match vignette) */
          [[22, 22, 36], 0],    [[20, 20, 34], 0.15],
          [[17, 17, 30], 0.30], [[14, 14, 26], 0.50],
          [[11, 11, 22], 0.70], [[9, 9, 18], 0.85],
          [[7, 7, 15], 1.0]
        ];

    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      nav.classList.toggle('scrolled', scrollY > 60);
      if (scrollY > 60) {
        const ratio = scrollY / (document.documentElement.scrollHeight - window.innerHeight);
        const color = sampleGradient(ratio, gradientStops);
        const rgb = `${color[0]}, ${color[1]}, ${color[2]}`;
        nav.style.background = `linear-gradient(to bottom, rgb(${rgb}) 0%, rgb(${rgb}) 50%, rgba(${rgb}, 0) 100%)`;
      } else {
        nav.style.background = '';
      }
    });
  }


  /* ---------- "INSPIRE CHANGE." WATERMARK BOOST ---------- */
  const heroLogo = document.querySelector('.hero-logo');
  if (heroLogo) {
    // After the 6s intro animation completes, add a separate element that shows
    // just "Inspire Change." at higher opacity (not capped by parent's 0.06).
    // Uses setTimeout instead of animationend to avoid duplicate firing issues.
    setTimeout(() => {
      if (document.querySelector('.inspire-boost')) return;
      const boost = document.createElement('div');
      boost.classList.add('inspire-boost');
      // Match position and size of the watermark logo at its final state
      const logoImg = heroLogo.querySelector('img');
      const style = getComputedStyle(heroLogo);
      boost.style.top = style.top;
      boost.style.left = style.left;
      boost.style.transform = style.transform;
      boost.style.width = logoImg.offsetWidth + 'px';
      boost.style.height = logoImg.offsetHeight + 'px';
      // Clone the image
      const img = logoImg.cloneNode();
      img.style.width = '100%';
      img.style.height = '100%';
      boost.appendChild(img);
      heroLogo.parentElement.appendChild(boost);
      // Trigger fade in
      requestAnimationFrame(() => boost.classList.add('visible'));
    }, 6100);
  }

  /* ---------- DROPDOWN MENU PANEL ---------- */
  const menuToggle = document.querySelector('.menu-toggle');
  const dropdownPanel = document.querySelector('.dropdown-panel');

  if (menuToggle && dropdownPanel) {
    // Create overlay element for closing on click outside
    const overlay = document.createElement('div');
    overlay.classList.add('dropdown-overlay');
    document.body.appendChild(overlay);

    const openPanel = () => {
      dropdownPanel.classList.add('open');
      overlay.classList.add('open');
      document.body.style.overflow = 'hidden';
    };

    const closePanel = () => {
      dropdownPanel.classList.remove('open');
      overlay.classList.remove('open');
      document.body.style.overflow = '';
    };

    menuToggle.addEventListener('click', () => {
      if (dropdownPanel.classList.contains('open')) {
        closePanel();
      } else {
        openPanel();
      }
    });

    // Close when clicking overlay
    overlay.addEventListener('click', closePanel);

    // Close when a link inside the panel is clicked
    dropdownPanel.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closePanel);
    });
  }

  /* ---------- SCROLL-TRIGGERED REVEAL ANIMATIONS ---------- */
  const revealElements = document.querySelectorAll('.reveal, .reveal-children');

  if (revealElements.length > 0) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.05,
      rootMargin: '0px 0px -20px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  }

  /* ---------- STATS COUNTER ANIMATION ---------- */
  const statNumbers = document.querySelectorAll('.stat-number');

  if (statNumbers.length > 0) {
    const animateCounter = (el) => {
      const target = el.getAttribute('data-target');
      const prefix = el.getAttribute('data-prefix') || '';
      const suffix = el.getAttribute('data-suffix') || '';
      const targetNum = parseInt(target, 10);
      const duration = 2000; // ms
      const startTime = performance.now();

      const updateCounter = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Ease-out cubic for smooth deceleration
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(eased * targetNum);

        el.textContent = prefix + current.toLocaleString() + suffix;

        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        } else {
          el.textContent = prefix + targetNum.toLocaleString() + suffix;
        }
      };

      requestAnimationFrame(updateCounter);
    };

    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          statsObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.5
    });

    statNumbers.forEach(el => statsObserver.observe(el));
  }

  /* ---------- MOBILE LOCATIONS 3D HORIZONTAL CAROUSEL ---------- */
  const locationsGrid = document.querySelector('.locations-grid');

  if (locationsGrid && window.matchMedia('(max-width: 768px)').matches) {

    // Duplicate items for seamless infinite loop
    const originalItems = locationsGrid.innerHTML;
    locationsGrid.innerHTML = originalItems + originalItems;

    const updateCarousel = () => {
      const container = locationsGrid;
      const containerRect = container.getBoundingClientRect();
      const centerX = containerRect.left + containerRect.width / 2;
      const items = container.querySelectorAll('.location-card');

      items.forEach(item => {
        const itemRect = item.getBoundingClientRect();
        const itemCenterX = itemRect.left + itemRect.width / 2;
        const offset = centerX - itemCenterX;
        const maxDistance = containerRect.width / 2;

        const ratio = Math.max(Math.min(offset / maxDistance, 1), -1);
        const absRatio = Math.abs(ratio);

        // Scale: 1.1 at center, 0.7 at edges
        const scale = 1.1 - (absRatio * 0.4);
        // Opacity: 1.0 at center, 0.3 at edges
        const opacity = 1 - (absRatio * 0.7);
        // 3D rotation
        const rotateY = ratio * -30;
        const translateZ = -absRatio * 50;

        item.style.setProperty('transform', `rotateY(${rotateY}deg) translateZ(${translateZ}px) scale(${scale})`, 'important');
        item.style.setProperty('opacity', opacity, 'important');
      });
    };

    locationsGrid.addEventListener('scroll', updateCarousel);
    requestAnimationFrame(updateCarousel);

    /* --- Auto-scroll: slow continuous drift, manual override --- */
    const autoScrollSpeed = 0.52; // px per frame
    let scrollPos = locationsGrid.scrollLeft;
    let userScrolling = false;
    let resumeTimer;

    // Calculate exact width of the original set of items
    const allItems = locationsGrid.querySelectorAll('.location-card');
    const originalCount = allItems.length / 2;
    let originalSetWidth = 0;
    for (let i = 0; i < originalCount; i++) {
      const cs = window.getComputedStyle(allItems[i]);
      originalSetWidth += allItems[i].offsetWidth + parseFloat(cs.marginLeft) + parseFloat(cs.marginRight);
    }
    const wrapPoint = originalSetWidth + 80;

    const autoScroll = () => {
      if (!userScrolling) {
        scrollPos += autoScrollSpeed;

        if (scrollPos >= wrapPoint) {
          scrollPos -= originalSetWidth;
        }

        locationsGrid.scrollLeft = Math.round(scrollPos);
      }
      updateCarousel();
      requestAnimationFrame(autoScroll);
    };

    let touchStartX = 0;
    let touchStartY = 0;

    locationsGrid.addEventListener('touchstart', (e) => {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    }, { passive: true });

    locationsGrid.addEventListener('touchmove', (e) => {
      const dx = Math.abs(e.touches[0].clientX - touchStartX);
      const dy = Math.abs(e.touches[0].clientY - touchStartY);
      if (dx > dy && dx > 10) {
        userScrolling = true;
        clearTimeout(resumeTimer);
      }
    }, { passive: true });

    locationsGrid.addEventListener('touchend', () => {
      if (userScrolling) {
        clearTimeout(resumeTimer);
        resumeTimer = setTimeout(() => {
          scrollPos = locationsGrid.scrollLeft;
          if (scrollPos >= wrapPoint) {
            scrollPos -= originalSetWidth;
            locationsGrid.scrollLeft = Math.round(scrollPos);
          }
          userScrolling = false;
        }, 800);
      }
    }, { passive: true });

    locationsGrid.addEventListener('touchcancel', () => {
      if (userScrolling) {
        clearTimeout(resumeTimer);
        resumeTimer = setTimeout(() => {
          scrollPos = locationsGrid.scrollLeft;
          if (scrollPos >= wrapPoint) {
            scrollPos -= originalSetWidth;
            locationsGrid.scrollLeft = Math.round(scrollPos);
          }
          userScrolling = false;
        }, 800);
      }
    }, { passive: true });

    requestAnimationFrame(autoScroll);
  }

  /* ---------- CITY TICKER — DUPLICATE FOR SEAMLESS LOOP ---------- */
  const tickerTrack = document.querySelector('.ticker-track');

  if (tickerTrack) {
    // Clone the items to create a seamless loop
    const items = tickerTrack.innerHTML;
    tickerTrack.innerHTML = items + items;
  }

});
