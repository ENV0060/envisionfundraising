/* ============================================
   ENVISION FUNDRAISING INC. — SHARED JAVASCRIPT
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- LOCATION PHOTO FALLBACK ---------- */
  // Offices without a photo yet show a styled placeholder — adding the file to Location Photos/ fixes it automatically
  const locationPhotoSelector = '.location-card img, .join-city-card img, .join-sidebar-card img, .page-hero-city-bg img';
  const markMissingPhoto = img => img.parentElement.classList.add('no-photo');
  document.querySelectorAll(locationPhotoSelector).forEach(img => {
    if (img.complete && img.naturalWidth === 0 && img.getAttribute('src')) markMissingPhoto(img);
  });
  document.addEventListener('error', e => {
    if (e.target.matches && e.target.matches(locationPhotoSelector)) markMissingPhoto(e.target);
  }, true);

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
      'Photos/Company Team Photos/Calgary Team Photos/2026-03-10 16.27.10.jpg',
      'Photos/Company Team Photos/Calgary Team Photos/2026-03-10 16.27.17.jpg',
      'Photos/Company Team Photos/Calgary Team Photos/F749ED74-04F4-4DDF-9646-25ACA31F009F.jpg.jpeg',
      'Photos/Company Team Photos/Calgary Team Photos/IMG_7359.jpeg',
      'Photos/Company Team Photos/FLARE Teams/2607200253510320142.jpeg',
      'Photos/Company Team Photos/FLARE Teams/4528505928960839980.jpeg',
      'Photos/Company Team Photos/FLARE Teams/8697860766244300564.jpeg',
      // FLARE Teams additions — web-sized copies renamed from the phone-export filenames
      'Photos/Company Team Photos/FLARE Teams/flare-08885905.jpg',
      'Photos/Company Team Photos/FLARE Teams/flare-122eda7f.jpg',
      'Photos/Company Team Photos/FLARE Teams/flare-1887ca2a.jpg',
      'Photos/Company Team Photos/FLARE Teams/flare-35d62ded.jpg',
      'Photos/Company Team Photos/FLARE Teams/flare-579bbbe4.jpg',
      'Photos/Company Team Photos/FLARE Teams/flare-be57733d.jpg',
      'Photos/Company Team Photos/FLARE Teams/flare-d6033224.jpg',
      'Photos/Company Team Photos/FLARE Teams/flare-fd0a7743.jpg',
      // Removed duplicate: ghdZDFEyncgLVw8vGIaHJdX1acgN0aQUaciSWy5oZnQeJxFPc.jpg (same as Calgary copy)
      'Photos/Company Team Photos/Vancouver Team Photos/2026-03-10 13.30.32.jpg',
      'Photos/Company Team Photos/Vancouver Team Photos/2026-03-10 13.31.11.jpg',
      'Photos/Company Team Photos/Vancouver Team Photos/2026-03-10 13.31.46.jpg',
      'Photos/Company Team Photos/Vancouver Team Photos/2026-03-10 13.33.59.jpg',
      // 2026 Gala — web-sized copies (originals are 5–17 MB camera files kept outside the site)
      'Photos/Company Team Photos/2026 Gala/SLA3342.jpg',
      'Photos/Company Team Photos/2026 Gala/SLA3347.jpg',
      'Photos/Company Team Photos/2026 Gala/SLA3349.jpg',
      'Photos/Company Team Photos/2026 Gala/SLA3437.jpg',
      'Photos/Company Team Photos/2026 Gala/SLA3491.jpg',
      'Photos/Company Team Photos/2026 Gala/SLA3497.jpg',
      'Photos/Company Team Photos/2026 Gala/SLA3504.jpg',
      'Photos/Company Team Photos/2026 Gala/SLA3547.jpg',
      'Photos/Company Team Photos/2026 Gala/SLA3550.jpg',
      'Photos/Company Team Photos/2026 Gala/SLA3552.jpg',
      'Photos/Company Team Photos/2026 Gala/SLA3606.jpg',
      'Photos/Company Team Photos/2026 Gala/SLA3625.jpg',
      'Photos/Company Team Photos/2026 Gala/SLA3646.jpg'
    ];

    // Per-photo crop for collage tiles (default is CSS `center 22%`).
    // A string moves the crop point (tall selfies with faces low in the frame need it moved down).
    // { fit: true } zooms out to show the whole photo over a blurred copy of itself;
    // add zoom (e.g. 1.4) to zoom partway back in, anchored at `pos` (default: top centre).
    const photoFocus = {
      'Photos/Company Team Photos/Calgary Team Photos/2026-03-10 13.28.59.jpg': 'center 40%',
      'Photos/Company Team Photos/2026 Gala/SLA3547.jpg': { fit: true, zoom: 1.6 },
      'Photos/Company Team Photos/2026 Gala/SLA3550.jpg': 'center 0%',
      'Photos/Company Team Photos/2026 Gala/SLA3552.jpg': 'center 0%',
      'Photos/Company Team Photos/2026 Gala/SLA3606.jpg': { fit: true, zoom: 1.4 },
      'Photos/Company Team Photos/Calgary Team Photos/2026-03-10 13.30.14.jpg': 'center 65%',
      'Photos/Company Team Photos/Calgary Team Photos/2026-03-10 13.33.31.jpg': 'center 65%',
      'Photos/Company Team Photos/FLARE Teams/2607200253510320142.jpeg': 'center 50%',
      'Photos/Company Team Photos/FLARE Teams/flare-122eda7f.jpg': 'center 75%',
      'Photos/Company Team Photos/Vancouver Team Photos/2026-03-10 13.30.32.jpg': 'center 50%'
    };
    const setCollagePhoto = (img, src) => {
      const focus = photoFocus[src];
      const fit = typeof focus === 'object' && focus !== null;
      const pos = fit ? (focus.pos || 'center top') : (focus || '');
      img.src = src;
      img.style.objectPosition = pos;
      img.style.objectFit = fit ? 'contain' : '';
      img.style.transform = fit && focus.zoom ? `scale(${focus.zoom})` : '';
      img.style.transformOrigin = fit ? pos : '';
      const item = img.closest('.join-collage-item');
      if (item) {
        item.classList.toggle('is-fit', fit);
        item.style.setProperty('--fit-bg', fit ? `url("${encodeURI(src)}")` : 'none');
      }
    };
    const COLLAGE_SIZE = 6;
    let collageInterval = null;

    const cityData = {
      ottawa: {
        name: 'Ottawa',
        photo: 'Location Photos/Ottawa, ON.jpg',
        tagline: 'Where it all started.',
        heading: 'The Ottawa Crew',
        description: 'The founding city. Ottawa is where Envision began back in 2014 — a small team with a big idea about how fundraising should actually work.',
        established: '2014',
        founding: true
      },
      toronto: {
        name: 'Toronto / GTA',
        photo: 'Location Photos/Toronto, ON.jpg',
        tagline: 'The biggest stage in the country.',
        heading: 'The Toronto Squad',
        description: 'The biggest market, the biggest energy. Toronto is where campaigns scale and careers accelerate — and with our Mississauga office running since 2018, the team covers the whole GTA. Fast-paced, high-energy, and never boring — if you thrive in the action, Toronto is calling.',
        established: '2016'
      },
      vancouver: {
        name: 'Vancouver',
        photo: 'Location Photos/Vancouver, BC.jpg',
        tagline: 'West coast, best coast.',
        heading: 'The Vancouver Team',
        description: 'Mountains, ocean, and a team that matches the energy. Vancouver was one of our first expansion cities and is now home to four separate teams. Great views, even better people, and ready for a fifth.',
        established: '2017'
      },
      calgary: {
        name: 'Calgary',
        photo: 'Location Photos/Calgary, AB.jpg',
        tagline: 'Alberta grit meets fundraising hustle.',
        heading: 'The Calgary Crew',
        description: 'Calgary doesn\'t mess around. The Alberta crew brings a work ethic that\'s hard to match and a culture that\'s even harder to leave. Run by friends who feel like family, they\'re always looking for their next member.',
        established: '2018'
      },
      edmonton: {
        name: 'Edmonton',
        photo: 'Location Photos/Edmonton, AB.webp',
        tagline: 'Cold winters, warm hearts.',
        heading: 'The Edmonton Team',
        description: 'Don\'t let the winters fool you — the Edmonton team brings the heat. A tight-knit group that punches way above its weight, this office has become a proving ground for some of Envision\'s most talented fundraisers. Small-city roots with big-city ambitions.',
        established: '2020'
      },
      halifax: {
        name: 'Halifax',
        photo: 'Location Photos/Halifax, NS.jpg',
        tagline: 'East coast charm, big-time energy.',
        heading: 'The Halifax Crew',
        description: 'Halifax brings East Coast warmth to everything it does — the kind of place where donors actually want to stop and chat. A tight crew with a big reputation, and plenty of room to make your mark.',
        established: '2023'
      },
      windsor: {
        name: 'Windsor',
        photo: 'Location Photos/Windsor, ON.jpg',
        bannerPos: 'center 35%', // city-page banner crop: a little more skyline, a little less water
        tagline: 'Small city energy, big results.',
        heading: 'The Windsor Team',
        description: 'Right on the border and full of surprises. Windsor is proof that you don\'t need a massive market to build a massive impact. The crew here is close-knit and driven — the kind of team that celebrates every win together. Perfect for someone who wants to make a name for themselves.',
        established: '2024'
      },
      denver: {
        name: 'Denver',
        photo: 'Location Photos/Denver, CO.jpg',
        tagline: 'Mile-high ambitions.',
        heading: 'The Denver Team',
        description: 'Envision goes stateside. Denver is one of our first U.S. offices — a brand-new team in a city that loves the outdoors almost as much as it loves a good cause. Get in early and help write the first chapter of Envision in America.',
        established: '2026'
      },
      houston: {
        name: 'Houston',
        photo: 'Location Photos/Houston, TX.jpg',
        tagline: 'Everything\'s bigger — including the opportunity.',
        heading: 'The Houston Crew',
        description: 'Our Texas launch. Houston is huge, diverse, and full of people who care — perfect territory for face-to-face fundraising. The team is brand new, so the leadership spots are wide open. Bring the energy and grow with it.',
        established: '2026'
      },
      montreal: {
        name: 'Montreal',
        photo: 'Location Photos/Montreal, QC.jpg',
        tagline: 'Bonjour, Montréal.',
        heading: 'The Montreal Team',
        description: 'Our newest Canadian office. Montreal brings culture, character, and a whole lot of heart — and now it\'s got an Envision team to match. Bilingual? Even better. Get in on the ground floor of something brand new.',
        established: '2026'
      }
    };

    // Open Director positions — each city listed here shows the Directorship spotlight on its page
    const directorOpenings = {
      ottawa: {
        lead: 'Ottawa is where Envision started, and we\'re ready to bring it back. We\'re looking for a Director to rebuild our founding city from the ground up. If you can train, hire, and lead — this is your shot at running an office.'
      }
    };

    const cityOrder = ['ottawa', 'toronto', 'vancouver', 'calgary', 'edmonton', 'halifax', 'windsor', 'denver', 'houston', 'montreal'];

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

    // Slots take turns: each round visits all 6 in shuffled order. The slots changed most recently
    // go to the back of the next round, so a freshly swapped photo stays up for at least ~4 swaps.
    let slotQueue = [];
    let recentSlots = [];
    const busySlots = new Set();
    let collageGen = 0; // bumped on each initCollage so stale timers from a previous visit are ignored

    function nextSlot(count) {
      for (let tries = 0; tries < count * 2; tries++) {
        if (!slotQueue.length) {
          const fresh = shuffle([...Array(count).keys()].filter(s => !recentSlots.includes(s)));
          slotQueue = [...fresh, ...recentSlots.filter(s => s < count)];
        }
        const slot = slotQueue.shift();
        if (!busySlots.has(slot)) {
          recentSlots = [...recentSlots.filter(s => s !== slot), slot].slice(-Math.floor(count / 2));
          return slot;
        }
      }
      return -1;
    }

    const FADE_MS = 450;

    function swapSlot(item, slotIdx, newPhoto, gen) {
      busySlots.add(slotIdx);
      const img = item.querySelector('img');
      const finish = () => { if (gen === collageGen) busySlots.delete(slotIdx); };
      // Load and decode off-screen first, so the fade-in never shows a half-drawn photo
      const preload = new Image();
      preload.src = newPhoto;
      const ready = (preload.decode ? preload.decode() : Promise.resolve()).catch(() => {});
      ready.then(() => {
        if (gen !== collageGen) return;
        item.classList.add('swapping'); // fades photo + blurred backdrop out together
        setTimeout(() => {
          if (gen !== collageGen) return;
          setCollagePhoto(img, newPhoto);
          const shown = img.decode ? img.decode().catch(() => {}) : Promise.resolve();
          shown.then(() => requestAnimationFrame(() => {
            if (gen !== collageGen) return;
            item.classList.remove('swapping'); // ...and back in together
            setTimeout(finish, FADE_MS);
          }));
        }, FADE_MS);
      });
    }

    function startCollageCycle() {
      stopCollageCycle();
      const gen = collageGen;
      collageInterval = setInterval(() => {
        const collage = document.getElementById('detail-team-collage');
        const items = collage.querySelectorAll('.join-collage-item');
        if (items.length === 0 || photoPool.length === 0) return;

        const slotIdx = nextSlot(items.length);
        if (slotIdx === -1) return;

        const newPhoto = photoPool.shift();
        // Put the old photo on a 30s cooldown before it can come back
        const oldPhoto = displayedPhotos[slotIdx];
        displayedPhotos[slotIdx] = newPhoto;
        cooldownPhotos.push(oldPhoto);
        setTimeout(() => {
          if (gen !== collageGen) return;
          const idx = cooldownPhotos.indexOf(oldPhoto);
          if (idx !== -1) {
            cooldownPhotos.splice(idx, 1);
            photoPool.push(oldPhoto);
          }
        }, 30000);

        swapSlot(items[slotIdx], slotIdx, newPhoto, gen);
      }, 2800);
    }

    // Render the detail main panel content
    // Update only city-specific content: hero photo + text box
    function renderCityContent(key) {
      const city = cityData[key];

      // Update page hero with city info
      heroCityImg.parentElement.classList.remove('no-photo');
      heroCityImg.src = city.photo;
      heroCityImg.style.objectPosition = city.bannerPos || '';
      heroCityImg.alt = city.name;
      heroCityName.textContent = city.name;
      heroCityTagline.textContent = city.tagline;
      pageHero.classList.add('city-active');

      // Restart Ken Burns on hero image
      heroCityImg.style.animation = 'none';
      heroCityImg.offsetHeight;
      heroCityImg.style.animation = '';

      // Update text box
      const teamInfo = document.getElementById('detail-team-info');
      document.getElementById('detail-team-heading').textContent = city.heading;
      document.getElementById('detail-team-desc').textContent = city.description;
      document.getElementById('detail-team-stats').innerHTML = `
        <span class="join-team-stat">Since <span>${city.established}</span></span>
        ${city.founding ? '<span class="join-team-stat">★ Founding Office</span>' : ''}
      `;

      // Show the Director opening spotlight only for cities that are hiring
      const spotlight = document.getElementById('detail-city-spotlight');
      if (spotlight) {
        const opening = directorOpenings[key];
        if (opening) {
          document.getElementById('spotlight-city-name').textContent = city.name;
          document.getElementById('spotlight-lead').textContent = opening.lead;
          document.getElementById('spotlight-meta').textContent = `${city.name}-based · Full-time`;
        }
        spotlight.classList.toggle('active', Boolean(opening));
      }
    }

    // Initialize the photo collage (only called once on first city select)
    function initCollage() {
      // Deduplicate by filename (different paths, same file)
      const seen = new Set();
      const uniquePhotos = teamPhotos.filter(p => {
        const name = p.split('/').pop();
        if (seen.has(name)) return false;
        seen.add(name);
        return true;
      });
      const shuffled = shuffle(uniquePhotos);
      displayedPhotos = shuffled.slice(0, COLLAGE_SIZE);
      photoPool = shuffled.slice(COLLAGE_SIZE);
      cooldownPhotos = [];
      collageGen++;
      slotQueue = [];
      recentSlots = [];
      busySlots.clear();

      const collage = document.getElementById('detail-team-collage');
      collage.innerHTML = '';
      displayedPhotos.forEach((photo, i) => {
        const item = document.createElement('div');
        item.className = 'join-collage-item';
        item.innerHTML = `<img alt="Team photo" loading="lazy">`;
        setCollagePhoto(item.querySelector('img'), photo);
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

        // Show detail — init collage fresh, render city content + sidebar
        renderCityContent(key);
        initCollage();
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

    // Transition: swap city — only hero + text box change, collage persists
    function swapCity(newKey) {
      selectedCity = newKey;
      history.pushState({ city: newKey }, '', '#city-' + newKey);

      // Only animate the text box, not the whole detail panel
      const teamInfo = document.getElementById('detail-team-info');
      teamInfo.classList.add('swapping-out');

      setTimeout(() => {
        renderCityContent(newKey);
        renderSidebar(newKey);
        teamInfo.classList.remove('swapping-out');
        teamInfo.classList.add('swapping-in');

        setTimeout(() => {
          teamInfo.classList.remove('swapping-in');
        }, 400);

        // Scroll to top so hero change is visible
        window.scrollTo({ top: 0, behavior: 'smooth' });
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
            // Swap between cities — only update hero + text, collage persists
            renderCityContent(cityKey);
            renderSidebar(cityKey);
            selectedCity = cityKey;
          } else {
            // From grid to detail — init collage fresh
            joinExplorer.style.display = 'none';
            renderCityContent(cityKey);
            initCollage();
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
        renderCityContent(cityKey);
        initCollage();
        renderSidebar(cityKey);
        joinDetail.classList.add('active');
        joinDetail.classList.add('entering');
        document.body.classList.add('join-city-active');
        selectedCity = cityKey;
      }
    }
  }

  /* ========== APPLY FORM ========== */

  const applyForm = document.getElementById('apply-form');
  if (applyForm) {
    // Preselect contact reason from links like contact.html?reason=charity
    const reasonValues = {
      team: 'Join a Team',
      charity: 'Charity looking to launch a campaign',
      partner: 'Established Office(s) considering partnership'
    };
    const reasonParam = new URLSearchParams(window.location.search).get('reason');
    if (reasonValues[reasonParam]) {
      const reasonInput = applyForm.querySelector(`input[name="contact_reason"][value="${reasonValues[reasonParam]}"]`);
      if (reasonInput) reasonInput.checked = true;
    }

    const fileInput = document.getElementById('resume');
    const fileList = document.getElementById('file-list');
    const uploadArea = document.getElementById('file-upload-area');

    // Track selected files (DataTransfer lets us modify the FileList)
    let selectedFiles = new DataTransfer();

    function renderFileList() {
      fileList.innerHTML = '';
      for (let i = 0; i < selectedFiles.files.length; i++) {
        const file = selectedFiles.files[i];
        const item = document.createElement('div');
        item.className = 'file-item';
        item.innerHTML = `
          <span class="file-item-name">${file.name}</span>
          <button type="button" class="file-item-remove" data-index="${i}">&times;</button>
        `;
        fileList.appendChild(item);
      }
      fileInput.files = selectedFiles.files;
    }

    fileInput.addEventListener('change', () => {
      for (const file of fileInput.files) {
        selectedFiles.items.add(file);
      }
      renderFileList();
    });

    fileList.addEventListener('click', (e) => {
      const btn = e.target.closest('.file-item-remove');
      if (!btn) return;
      const idx = parseInt(btn.dataset.index);
      const dt = new DataTransfer();
      for (let i = 0; i < selectedFiles.files.length; i++) {
        if (i !== idx) dt.items.add(selectedFiles.files[i]);
      }
      selectedFiles = dt;
      renderFileList();
    });

    // Drag and drop
    uploadArea.addEventListener('dragover', (e) => {
      e.preventDefault();
      uploadArea.classList.add('dragover');
    });
    uploadArea.addEventListener('dragleave', () => {
      uploadArea.classList.remove('dragover');
    });
    uploadArea.addEventListener('drop', (e) => {
      e.preventDefault();
      uploadArea.classList.remove('dragover');
      for (const file of e.dataTransfer.files) {
        selectedFiles.items.add(file);
      }
      renderFileList();
    });

    // Validation + submit
    applyForm.addEventListener('submit', (e) => {
      let valid = true;
      // Clear previous errors
      applyForm.querySelectorAll('.form-group.error').forEach(g => g.classList.remove('error'));
      applyForm.querySelectorAll('.form-error-msg').forEach(m => m.remove());

      const required = applyForm.querySelectorAll('[required]');
      required.forEach(field => {
        const group = field.closest('.form-group');
        if (!field.value.trim()) {
          valid = false;
          group.classList.add('error');
          const msg = document.createElement('span');
          msg.className = 'form-error-msg';
          msg.textContent = 'This field is required.';
          group.appendChild(msg);
        }
      });

      // Email format check
      const emailField = document.getElementById('email');
      if (emailField.value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailField.value.trim())) {
        valid = false;
        const group = emailField.closest('.form-group');
        group.classList.add('error');
        if (!group.querySelector('.form-error-msg')) {
          const msg = document.createElement('span');
          msg.className = 'form-error-msg';
          msg.textContent = 'Please enter a valid email address.';
          group.appendChild(msg);
        }
      }

      if (!valid) {
        e.preventDefault();
        // Scroll to first error
        const firstError = applyForm.querySelector('.form-group.error');
        if (firstError) firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
  }

});
