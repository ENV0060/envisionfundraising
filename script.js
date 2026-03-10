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
    const isNavyPage = document.body.classList.contains('team-page') || document.body.classList.contains('partner-page') || document.body.classList.contains('about-page') || document.body.classList.contains('join-page');
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
    // Position is copied from hero-logo's actual computed state to guarantee alignment.
    setTimeout(() => {
      if (document.querySelector('.inspire-boost')) return;

      // Read hero-logo's actual position after animation fill
      const cs = getComputedStyle(heroLogo);

      const boost = document.createElement('div');
      boost.classList.add('inspire-boost');
      // Copy exact position from hero-logo
      boost.style.position = 'absolute';
      boost.style.top = cs.top;
      boost.style.left = cs.left;
      boost.style.transform = cs.transform;
      boost.style.width = cs.width;

      const logoImg = heroLogo.querySelector('img');
      const img = logoImg.cloneNode();
      img.style.width = '100%';
      img.style.height = 'auto';
      boost.appendChild(img);
      heroLogo.parentElement.appendChild(boost);
      // Trigger fade in
      setTimeout(() => boost.classList.add('visible'), 50);
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
      document.body.classList.add('dropdown-open');
      document.body.style.overflow = 'hidden';
    };

    const closePanel = () => {
      dropdownPanel.classList.remove('open');
      overlay.classList.remove('open');
      document.body.classList.remove('dropdown-open');
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


  /* ---------- JOIN PAGE — CITY EXPLORER ---------- */
  const joinGrid = document.getElementById('join-grid');
  const joinExplorer = document.getElementById('join-explorer');
  const joinDetail = document.getElementById('join-detail');

  if (joinGrid && joinExplorer && joinDetail) {

    const teamPhotos = [
      'Photos/Company Team Photos/Calgary Team Photos/2026-03-10 13.28.08.jpg',
      'Photos/Company Team Photos/Calgary Team Photos/2026-03-10 13.28.59.jpg',
      'Photos/Company Team Photos/Calgary Team Photos/2026-03-10 13.29.33.jpg',
      'Photos/Company Team Photos/Calgary Team Photos/2026-03-10 13.29.46.jpg',
      'Photos/Company Team Photos/Calgary Team Photos/2026-03-10 13.30.14.jpg',
      'Photos/Company Team Photos/Calgary Team Photos/2026-03-10 13.31.32.jpg',
      'Photos/Company Team Photos/Calgary Team Photos/2026-03-10 13.33.31.jpg',
      'Photos/Company Team Photos/Calgary Team Photos/2026-03-10 13.34.13.jpg',
      'Photos/Company Team Photos/Calgary Team Photos/2026-03-10 13.34.24.jpg',
      'Photos/Company Team Photos/Calgary Team Photos/2026-03-10 13.41.58.jpg',
      'Photos/Company Team Photos/Calgary Team Photos/2026-03-10 13.42.03.jpg',
      'Photos/Company Team Photos/Calgary Team Photos/2026-03-10 13.42.09.jpg',
      'Photos/Company Team Photos/Calgary Team Photos/2026-03-10 13.43.42.jpg',
      'Photos/Company Team Photos/Calgary Team Photos/PmMdlSO_09fwIHY8Y_S17X6pe7pzdqHiIIcfNku8ZrseJxFPc.jpg',
      'Photos/Company Team Photos/Calgary Team Photos/ghdZDFEyncgLVw8vGIaHJdX1acgN0aQUaciSWy5oZnQeJxFPc.jpg',
      'Photos/Company Team Photos/FLARE Teams/2607200253510320142.jpeg',
      'Photos/Company Team Photos/FLARE Teams/4528505928960839980.jpeg',
      'Photos/Company Team Photos/FLARE Teams/8697860766244300564.jpeg',
      'Photos/Company Team Photos/Gala Photos/ghdZDFEyncgLVw8vGIaHJdX1acgN0aQUaciSWy5oZnQeJxFPc.jpg',
      'Photos/Company Team Photos/Vancouver Team Photos/2026-03-10 13.30.32.jpg',
      'Photos/Company Team Photos/Vancouver Team Photos/2026-03-10 13.31.11.jpg',
      'Photos/Company Team Photos/Vancouver Team Photos/2026-03-10 13.31.46.jpg',
      'Photos/Company Team Photos/Vancouver Team Photos/2026-03-10 13.33.59.jpg'
    ];
    const COLLAGE_SIZE = 6;
    let collageInterval = null;

    const cityData = {
      ottawa: {
        name: 'Ottawa',
        photo: 'Location Photos/Ottawa, ON.jpg',
        tagline: 'Where it all started.',
        heading: 'The Ottawa Crew',
        description: 'The founding city. Ottawa is where Envision began back in 2016 — a small team with a big idea about how fundraising should actually work. Today, the Ottawa office is still the heartbeat of the operation. If you want to learn from the people who built this thing from scratch, this is your squad.',
        established: '2016'
      },
      toronto: {
        name: 'Toronto / GTA',
        photo: 'Location Photos/Toronto, ON.jpg',
        tagline: 'The biggest stage in the country.',
        heading: 'The Toronto Squad',
        description: 'The biggest market, the biggest energy. Toronto is where campaigns scale and careers accelerate. The GTA team covers a massive territory and they do it with style. Fast-paced, high-energy, and never boring — if you thrive in the action, Toronto is calling.',
        established: '2017'
      },
      vancouver: {
        name: 'Vancouver',
        photo: 'Location Photos/Vancouver, BC.jpg',
        tagline: 'West coast, best coast.',
        heading: 'The Vancouver Team',
        description: 'Mountains, ocean, and a team that matches the energy. Vancouver was one of the first expansion cities and it shows — the crew out here runs tight campaigns with a laid-back West Coast edge. Great vibes, great results, and you might catch a sunset on your lunch break.',
        established: '2018'
      },
      calgary: {
        name: 'Calgary',
        photo: 'Location Photos/Calgary, AB.jpg',
        tagline: 'Alberta grit meets fundraising hustle.',
        heading: 'The Calgary Crew',
        description: 'Calgary doesn\'t mess around. The Alberta crew brings a work ethic that\'s hard to match and a culture that\'s even harder to leave. This team has grown fast because they keep it real — honest conversations, genuine connections, and results that speak for themselves.',
        established: '2020'
      },
      edmonton: {
        name: 'Edmonton',
        photo: 'Location Photos/Edmonton, AB.webp',
        tagline: 'Cold winters, warm hearts.',
        heading: 'The Edmonton Team',
        description: 'Don\'t let the winters fool you — the Edmonton team brings the heat. A tight-knit group that punches way above its weight, this office has become a proving ground for some of Envision\'s most talented fundraisers. Small-city roots with big-city ambitions.',
        established: '2021'
      },
      halifax: {
        name: 'Halifax',
        photo: 'Location Photos/Halifax, NS.jpg',
        tagline: 'East coast charm, brand new energy.',
        heading: 'The Halifax Crew',
        description: 'The newest Canadian office, and already making waves. Halifax brings East Coast warmth to everything it does — the kind of place where donors actually want to stop and chat. If you\'re looking to get in on the ground floor of something special, this is it.',
        established: '2025'
      },
      columbus: {
        name: 'Columbus',
        photo: 'Location Photos/Columbus, OH.jpg',
        tagline: 'Our first American city.',
        heading: 'The Columbus Team',
        description: 'Envision goes stateside. Columbus is the launchpad for Envision\'s U.S. expansion — a city with serious energy and a fundraising team that\'s building something brand new. Get in now and help write the first chapter of Envision in America.',
        established: '2025'
      },
      windsor: {
        name: 'Windsor',
        photo: 'Location Photos/Windsor, ON.jpg',
        tagline: 'Small city energy, big results.',
        heading: 'The Windsor Team',
        description: 'Right on the border and full of surprises. Windsor is proof that you don\'t need a massive market to build a massive impact. This team is scrappy, hungry, and consistently outperforms expectations. Perfect for someone who wants to make a name for themselves.',
        established: '2025'
      }
    };

    const cityOrder = ['ottawa', 'toronto', 'vancouver', 'calgary', 'edmonton', 'halifax', 'columbus', 'windsor'];
    let selectedCity = null;

    const sidebar = document.getElementById('join-sidebar');
    const detailMain = document.getElementById('join-detail-main');
    const backBtn = document.getElementById('join-back-btn');
    const pageHero = document.getElementById('page-hero');
    const heroCityImg = document.getElementById('hero-city-img');
    const heroCityName = document.getElementById('hero-city-name');
    const heroCityTagline = document.getElementById('hero-city-tagline');

    // Render sidebar with all cities except the selected one
    function renderSidebar(excludeKey) {
      sidebar.innerHTML = '';
      cityOrder.filter(k => k !== excludeKey).forEach((key, i) => {
        const city = cityData[key];
        const card = document.createElement('div');
        card.className = 'join-sidebar-card';
        card.dataset.city = key;
        card.innerHTML = `
          <img src="${city.photo}" alt="${city.name}" loading="lazy">
          <span class="join-sidebar-name">${city.name}</span>
        `;
        sidebar.appendChild(card);
        // Stagger animation
        setTimeout(() => card.classList.add('visible'), 80 + i * 60);
      });
    }

    // Shuffle helper
    function shuffle(arr) {
      const a = [...arr];
      for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
      }
      return a;
    }

    // Track which photos are currently displayed vs available
    let displayedPhotos = [];
    let photoPool = [];
    let cooldownPhotos = []; // Photos on cooldown (recently removed from display)

    function stopCollageCycle() {
      if (collageInterval) {
        clearInterval(collageInterval);
        collageInterval = null;
      }
    }

    function startCollageCycle() {
      stopCollageCycle();
      collageInterval = setInterval(() => {
        const collage = document.getElementById('detail-team-collage');
        const items = collage.querySelectorAll('.join-collage-item');
        if (items.length === 0 || photoPool.length === 0) return;

        // Pick a random slot to swap
        const slotIdx = Math.floor(Math.random() * items.length);
        // Pick a new photo from the pool
        const newPhoto = photoPool.shift();
        // Put the old photo on 30s cooldown instead of back in pool
        const oldPhoto = displayedPhotos[slotIdx];
        displayedPhotos[slotIdx] = newPhoto;
        cooldownPhotos.push(oldPhoto);
        setTimeout(() => {
          // After 30s, move from cooldown back to pool
          const idx = cooldownPhotos.indexOf(oldPhoto);
          if (idx !== -1) {
            cooldownPhotos.splice(idx, 1);
            photoPool.push(oldPhoto);
          }
        }, 30000);

        const item = items[slotIdx];
        // Quick crossfade — fade out, swap, fade in
        item.classList.add('cycling-out');
        setTimeout(() => {
          item.querySelector('img').src = newPhoto;
          item.classList.remove('cycling-out');
          item.classList.add('cycling-in');
          setTimeout(() => item.classList.remove('cycling-in'), 500);
        }, 400);
      }, 2800);
    }

    // Render the detail main panel content
    function renderDetail(key) {
      const city = cityData[key];

      // Update page hero with city info
      heroCityImg.src = city.photo;
      heroCityImg.alt = city.name;
      heroCityName.textContent = city.name;
      heroCityTagline.textContent = city.tagline;
      pageHero.classList.add('city-active');

      // Restart Ken Burns on hero image
      heroCityImg.style.animation = 'none';
      heroCityImg.offsetHeight;
      heroCityImg.style.animation = '';

      document.getElementById('detail-team-heading').textContent = city.heading;
      document.getElementById('detail-team-desc').textContent = city.description;

      // Stats
      document.getElementById('detail-team-stats').innerHTML = `
        <span class="join-team-stat">Since <span>${city.established}</span></span>
      `;

      // Photo collage — pick random 6, keep rest in pool for cycling
      const shuffled = shuffle(teamPhotos);
      displayedPhotos = shuffled.slice(0, COLLAGE_SIZE);
      photoPool = shuffled.slice(COLLAGE_SIZE);
      cooldownPhotos = [];

      const collage = document.getElementById('detail-team-collage');
      collage.innerHTML = '';
      displayedPhotos.forEach((photo, i) => {
        const item = document.createElement('div');
        item.className = 'join-collage-item';
        item.innerHTML = `<img src="${photo}" alt="Team photo" loading="lazy">`;
        collage.appendChild(item);
        setTimeout(() => item.classList.add('visible'), 200 + i * 80);
      });

      // Start cycling photos after initial entrance
      setTimeout(() => startCollageCycle(), 2000);
    }

    // Transition: grid -> detail
    function selectCity(key) {
      selectedCity = key;
      history.pushState({ city: key }, '', '#city-' + key);

      // Fade out grid
      joinGrid.classList.add('leaving');

      setTimeout(() => {
        joinExplorer.style.display = 'none';
        joinGrid.classList.remove('leaving');

        // Show detail
        renderDetail(key);
        renderSidebar(key);
        joinDetail.classList.add('active');
        document.body.classList.add('join-city-active');

        // Trigger entering animation next frame
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            joinDetail.classList.add('entering');
          });
        });

        // Scroll to top of page
        window.scrollTo(0, 0);
      }, 400);
    }

    // Transition: swap city in detail view
    function swapCity(newKey) {
      selectedCity = newKey;
      history.pushState({ city: newKey }, '', '#city-' + newKey);

      detailMain.classList.add('swapping-out');

      setTimeout(() => {
        renderDetail(newKey);
        renderSidebar(newKey);
        detailMain.classList.remove('swapping-out');
        detailMain.style.opacity = '0';
        detailMain.style.transform = 'translateX(-30px)';

        requestAnimationFrame(() => {
          detailMain.classList.add('swapping-in');
          detailMain.style.opacity = '';
          detailMain.style.transform = '';

          setTimeout(() => {
            detailMain.classList.remove('swapping-in');
          }, 400);
        });
      }, 300);
    }

    // Transition: detail -> grid
    function showGrid() {
      stopCollageCycle();
      selectedCity = null;
      pageHero.classList.remove('city-active');
      document.body.classList.remove('join-city-active');

      joinDetail.classList.remove('entering');
      joinDetail.style.opacity = '0';
      joinDetail.style.transform = 'translateY(20px)';

      setTimeout(() => {
        joinDetail.classList.remove('active');
        joinDetail.style.opacity = '';
        joinDetail.style.transform = '';
        joinExplorer.style.display = '';
        window.scrollTo(0, 0);
      }, 400);
    }

    // Event: grid card click
    joinGrid.addEventListener('click', (e) => {
      const card = e.target.closest('.join-city-card');
      if (!card) return;
      selectCity(card.dataset.city);
    });

    // Event: sidebar card click
    sidebar.addEventListener('click', (e) => {
      const card = e.target.closest('.join-sidebar-card');
      if (!card) return;
      swapCity(card.dataset.city);
    });

    // Event: back button
    backBtn.addEventListener('click', () => {
      history.pushState(null, '', window.location.pathname);
      showGrid();
    });

    // Handle browser back/forward
    window.addEventListener('popstate', () => {
      const hash = window.location.hash;
      if (hash && hash.startsWith('#city-')) {
        const cityKey = hash.replace('#city-', '');
        if (cityData[cityKey] && selectedCity !== cityKey) {
          if (selectedCity) {
            // Swap between cities
            renderDetail(cityKey);
            renderSidebar(cityKey);
            selectedCity = cityKey;
          } else {
            // From grid to detail
            joinExplorer.style.display = 'none';
            renderDetail(cityKey);
            renderSidebar(cityKey);
            joinDetail.classList.add('active');
            joinDetail.classList.add('entering');
            document.body.classList.add('join-city-active');
            selectedCity = cityKey;
            window.scrollTo(0, 0);
          }
        }
      } else if (selectedCity) {
        showGrid();
      }
    });

    // Deep link support: check hash on load
    const hash = window.location.hash;
    if (hash && hash.startsWith('#city-')) {
      const cityKey = hash.replace('#city-', '');
      if (cityData[cityKey]) {
        // Skip animation for direct link — show detail immediately
        joinExplorer.style.display = 'none';
        renderDetail(cityKey);
        renderSidebar(cityKey);
        joinDetail.classList.add('active');
        joinDetail.classList.add('entering');
        document.body.classList.add('join-city-active');
        selectedCity = cityKey;
      }
    }
  }

});
