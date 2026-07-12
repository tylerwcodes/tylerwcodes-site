const hamburger = document.querySelector('.hamburger');
const headerCollapse = document.querySelector('.header-collapse');
const menuOverlay = document.querySelector('.menu-overlay');

if (hamburger && headerCollapse) {
  const setMenu = (open) => {
    hamburger.classList.toggle('active', open);
    headerCollapse.classList.toggle('open', open);
    if (menuOverlay) menuOverlay.classList.toggle('active', open);
    hamburger.setAttribute('aria-expanded', String(open));
  };

  hamburger.addEventListener('click', () => {
    setMenu(!headerCollapse.classList.contains('open'));
  });

  // close the menu after tapping a link
  headerCollapse.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => setMenu(false));
  });

  // close when tapping the dimmed backdrop
  if (menuOverlay) {
    menuOverlay.addEventListener('click', () => setMenu(false));
  }
}

// Typing animation for the hero subtitle word
const typedArticle = document.getElementById('typed-article');
const typedWord = document.getElementById('typed-word');

if (typedArticle && typedWord) {
  // the article types along with the word but keeps the grey color
  const words = [
    { article: 'a ', word: 'Full Stack Developer' },
    { article: 'an ', word: 'IT Professional' },
  ];
  const typingSpeed = 100;        // ms per character typed
  const deletingSpeed = 50;       // ms per character deleted
  const pauseAfterTyping = 1500;  // ms to hold a full word
  const pauseAfterDeleting = 0; // ms before typing the next word

  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  function tick() {
    const current = words[wordIndex];
    const full = current.article + current.word;

    charIndex += isDeleting ? -1 : 1;
    const typed = full.slice(0, charIndex);
    typedArticle.textContent = typed.slice(0, current.article.length);
    typedWord.textContent = typed.slice(current.article.length);

    let delay = isDeleting ? deletingSpeed : typingSpeed;

    if (!isDeleting && charIndex === full.length) {
      delay = pauseAfterTyping;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      delay = pauseAfterDeleting;
    }

    setTimeout(tick, delay);
  }

  tick();
}

// Projects coverflow carousel
const carousel = document.querySelector('.carousel');

if (carousel) {
  const cards = Array.from(carousel.querySelectorAll('.project-card'));
  const prevBtn = carousel.querySelector('.carousel-prev');
  const nextBtn = carousel.querySelector('.carousel-next');
  let current = 0;

  function renderCarousel() {
    const n = cards.length;
    cards.forEach((card, i) => {
      card.classList.remove('active', 'prev', 'next', 'is-hidden');
      if (i === current) {
        card.classList.add('active');
      } else if (i === (current - 1 + n) % n) {
        card.classList.add('prev');
      } else if (i === (current + 1) % n) {
        card.classList.add('next');
      } else {
        card.classList.add('is-hidden');
      }
    });
  }

  prevBtn.addEventListener('click', () => {
    current = (current - 1 + cards.length) % cards.length;
    renderCarousel();
  });

  nextBtn.addEventListener('click', () => {
    current = (current + 1) % cards.length;
    renderCarousel();
  });

  renderCarousel();
}

// Skills tab selector — on narrow screens the grid would run past three
// rows, so CSS swaps it for these tabs showing one card at a time
const skillsContainer = document.querySelector('.skills-container');

if (skillsContainer) {
  const skillCards = Array.from(skillsContainer.querySelectorAll('.skill'));

  const tabBar = document.createElement('div');
  tabBar.className = 'skills-tabs';
  tabBar.setAttribute('role', 'tablist');
  tabBar.setAttribute('aria-label', 'Skills');

  const tabs = skillCards.map((card, i) => {
    const title = card.querySelector('.skill-title h4');
    const tab = document.createElement('button');
    tab.type = 'button';
    tab.className = 'skills-tab';
    tab.id = `skills-tab-${i}`;
    tab.textContent = title ? title.textContent : `Skill ${i + 1}`;
    tab.setAttribute('role', 'tab');
    card.id = card.id || `skills-panel-${i}`;
    card.setAttribute('role', 'tabpanel');
    card.setAttribute('aria-labelledby', tab.id);
    tab.setAttribute('aria-controls', card.id);
    tabBar.appendChild(tab);
    return tab;
  });

  const activateSkill = (index) => {
    skillCards.forEach((card, i) => card.classList.toggle('tab-active', i === index));
    tabs.forEach((tab, i) => {
      tab.classList.toggle('active', i === index);
      tab.setAttribute('aria-selected', String(i === index));
      tab.tabIndex = i === index ? 0 : -1;
    });
  };

  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => activateSkill(i));
  });

  // arrow keys move between tabs, per the roving-focus tabs pattern
  tabBar.addEventListener('keydown', (e) => {
    const dir = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
    if (!dir) return;
    const current = tabs.indexOf(document.activeElement);
    if (current === -1) return;
    const next = (current + dir + tabs.length) % tabs.length;
    activateSkill(next);
    tabs[next].focus();
    e.preventDefault();
  });

  skillsContainer.before(tabBar);
  // the CSS only hides cards inside .tabbed, so without JS the grid remains
  skillsContainer.classList.add('tabbed');
  activateSkill(0);
}

// Hide the header on scroll down, reveal it on scroll up
const siteHeader = document.querySelector('header');

if (siteHeader) {
  let lastScrollY = window.scrollY;

  window.addEventListener(
    'scroll',
    () => {
      const currentY = window.scrollY;
      const menuOpen = headerCollapse && headerCollapse.classList.contains('open');

      if (menuOpen || currentY <= 100) {
        siteHeader.classList.remove('header-hidden');
      } else if (currentY > lastScrollY) {
        siteHeader.classList.add('header-hidden');
      } else {
        siteHeader.classList.remove('header-hidden');
      }

      lastScrollY = currentY;
    },
    { passive: true }
  );
}

// Scale "Hi, my name is" so its width matches the name below it
const introLine = document.querySelector('.landing-left-t1 p:first-child');
const nameLine = document.querySelector('.landing-left-t1 .name');

if (introLine && nameLine) {
  const textWidth = (el) => {
    const range = document.createRange();
    range.selectNodeContents(el);
    return range.getBoundingClientRect().width;
  };

  const fitIntro = () => {
    introLine.style.fontSize = ''; // reset to the CSS size before measuring
    const introW = textWidth(introLine);
    const nameW = textWidth(nameLine);
    if (introW > 0) {
      const size = parseFloat(getComputedStyle(introLine).fontSize);
      introLine.style.fontSize = `${size * (nameW / introW)}px`;
    }
  };

  fitIntro();
  window.addEventListener('resize', fitIntro);
  window.addEventListener('load', fitIntro);
}

// On mobile, move the hero social links beneath the image
const heroSocials = document.querySelector('.landing-socials');
const heroLeft = document.querySelector('.landing-left');
const heroRight = document.querySelector('.landing-right');

if (heroSocials && heroLeft && heroRight) {
  const mobileMq = window.matchMedia('(max-width: 768px)');

  const placeSocials = () => {
    if (mobileMq.matches) {
      heroRight.appendChild(heroSocials); // under the image
    } else {
      heroLeft.appendChild(heroSocials); // under the text
    }
  };

  placeSocials();
  mobileMq.addEventListener('change', placeSocials);
}