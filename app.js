/**
 * AMITA DUBEY PORTFOLIO — INTERACTIVE JAVASCRIPT
 * Replicating Okta Studio Framer Interactions, Micro-animations & Dynamic Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  initLiveClock();
  initCustomCursor();
  initProjectPreviewSwitcher();
  initCaseStudyModal();
  initArchiveModal();
  initFaqAccordion();
  initTestimonialCarousel();
  initContactForm();
  initMobileNav();
  initThemeToggle();
});

/* ==========================================================================
   1. LIVE IST CLOCK (Noida, India)
   ========================================================================== */
function initLiveClock() {
  const liveClockEl = document.getElementById('liveClock');
  const footerIstEl = document.getElementById('footerIstTime');

  function updateClock() {
    try {
      const now = new Date();
      // Format to IST (Asia/Kolkata)
      const options = {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      };
      const formatter = new Intl.DateTimeFormat('en-US', options);
      const timeStr = formatter.format(now);

      if (liveClockEl) {
        liveClockEl.textContent = timeStr;
      }
      if (footerIstEl) {
        footerIstEl.textContent = `NOIDA — ${timeStr} (IST)`;
      }
    } catch (e) {
      // Fallback
      const now = new Date();
      if (liveClockEl) liveClockEl.textContent = now.toLocaleTimeString();
    }
  }

  updateClock();
  setInterval(updateClock, 1000);
}

/* ==========================================================================
   2. CUSTOM TRAILING CURSOR
   ========================================================================== */
function initCustomCursor() {
  const dot = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');
  if (!dot || !ring) return;

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let ringX = mouseX;
  let ringY = mouseY;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
  });

  function renderRing() {
    // Smooth trailing lerp
    ringX += (mouseX - ringX) * 0.18;
    ringY += (mouseY - ringY) * 0.18;
    ring.style.transform = `translate(${ringX}px, ${ringY}px)`;
    requestAnimationFrame(renderRing);
  }
  requestAnimationFrame(renderRing);

  // Hover expansion on interactive elements
  const interactives = document.querySelectorAll('a, button, input, textarea, .project-item, .chat-pill-question, .form-pill');
  interactives.forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('active'));
    el.addEventListener('mouseleave', () => ring.classList.remove('active'));
  });
}

/* ==========================================================================
   3. PROJECT PREVIEW SWITCHER (Sticky Preview Card)
   ========================================================================== */
const projectData = {
  zenesys: {
    title: "Zenesys Brand Evolution",
    client: "Zenesys Technosys",
    year: "July 2021 — 2026",
    category: "Brand Identity & 500+ Social Assets",
    img: "assets/images/proj-brand.jpg",
    desc: "Over 5 years as lead visual creative, producing 500+ high-engagement social media posts, advertising reels, marketing collaterals, and unified brand design systems across tech verticals.",
    deliverables: [
      "Full corporate rebrand & multi-channel design guidelines",
      "500+ social creatives, carousels, and promotional reels",
      "Motion graphics for high-impact product releases",
      "100% on-time delivery track record across agency sprints"
    ]
  },
  momento: {
    title: "Momento Social Pulse",
    client: "Join Momento",
    year: "2023 — 2026",
    category: "Reels & Motion Graphics",
    img: "assets/images/proj-ui.jpg",
    desc: "Crafted kinetic typography reels, viral Instagram video snippets, and community engagement graphics that resulted in a 3x boost in audience interaction and brand recall.",
    deliverables: [
      "Kinetic typography reels & soundtrack synchronization",
      "Interactive social media templates in Canva & Illustrator",
      "Lifestyle campaign ad creatives with high conversion CTR",
      "Multi-ratio video exports for Stories, Reels, and Feed"
    ]
  },
  magic: {
    title: "Magic Software Comic & E-Books",
    client: "Magic Software / Tekshapers",
    year: "Nov 2019 — June 2020",
    category: "Editorial & Comic Layouts",
    img: "assets/images/proj-comic.jpg",
    desc: "Engineered detailed comic layouts, narrative panel pacing, dialogue balloon styling, and digital story adaptations for global educational and comic publishers.",
    deliverables: [
      "Custom page layouts and digital panel compositions",
      "Speech bubble placement, dynamic lettering and sound effects",
      "Responsive e-book screen layout calibration",
      "Graphic novel illustration color enhancements"
    ]
  },
  tekshapers: {
    title: "Tekshapers Digital UI Framework",
    client: "Tekshapers Solutions",
    year: "2020",
    category: "Web UI & Prototyping",
    img: "assets/images/proj-ui.jpg",
    desc: "Designed scalable Figma UI components, dark-mode user dashboards, and modern wireframe prototypes optimized for rapid frontend developer handoff.",
    deliverables: [
      "Figma design token architecture & reusable components",
      "Clean dark-mode dashboard interfaces and mobile states",
      "Interactive prototype click-through flows",
      "Design-to-code alignment and asset delivery"
    ]
  },
  kinetic: {
    title: "Kinetic Motion Series 2026",
    client: "Independent Motion Lab",
    year: "2026",
    category: "After Effects Kinetic Type",
    img: "assets/images/proj-brand.jpg",
    desc: "Experimental series combining expressive typography, audio-reactive motion pacing, and 3D lighting transitions built entirely in After Effects.",
    deliverables: [
      "Kinetic typography title sequences and logo stings",
      "Audio-reactive motion transitions and visual effects",
      "Social format modular templates for rapid branding",
      "High framerate rendering and visual sound design"
    ]
  },
  behance: {
    title: "Behance Curated Portfolio",
    client: "Curated Global Showcase",
    year: "2019 — 2026",
    category: "Visual Identity & Graphic Art",
    img: "assets/images/proj-comic.jpg",
    desc: "A comprehensive public archive of branding identity systems, vector illustrations, commercial retouching, and graphic artworks featured on Behance.",
    deliverables: [
      "Featured case studies across branding and vector graphics",
      "Packaging concepts, posters, and logo identities",
      "High-resolution vector compositions in Adobe Illustrator",
      "Community recognition and client collaborations"
    ]
  }
};

let currentProjectKey = 'zenesys';

function initProjectPreviewSwitcher() {
  const projectItems = document.querySelectorAll('.project-item');
  const previewImg = document.getElementById('previewImg');
  const previewCategory = document.getElementById('previewCategory');
  const previewTitle = document.getElementById('previewTitle');
  const previewClient = document.getElementById('previewClient');
  const inspectBtn = document.getElementById('inspectProjectBtn');

  function updatePreview(key) {
    const data = projectData[key];
    if (!data) return;
    currentProjectKey = key;

    // Visual transition
    if (previewImg) {
      previewImg.style.opacity = '0.3';
      previewImg.style.transform = 'scale(0.97)';
      setTimeout(() => {
        previewImg.src = data.img;
        previewImg.style.opacity = '1';
        previewImg.style.transform = 'scale(1)';
      }, 150);
    }

    if (previewCategory) previewCategory.textContent = data.category;
    if (previewTitle) previewTitle.textContent = data.title;
    if (previewClient) previewClient.textContent = `${data.client} • ${data.year}`;
  }

  projectItems.forEach(item => {
    const key = item.getAttribute('data-project');

    item.addEventListener('mouseenter', () => {
      projectItems.forEach(i => i.classList.remove('active'));
      item.classList.add('active');
      updatePreview(key);
    });

    item.addEventListener('click', () => {
      openCaseStudy(key);
    });
  });

  if (inspectBtn) {
    inspectBtn.addEventListener('click', () => {
      openCaseStudy(currentProjectKey);
    });
  }
}

/* ==========================================================================
   4. CASE STUDY MODAL
   ========================================================================== */
function initCaseStudyModal() {
  const modal = document.getElementById('caseStudyModal');
  const closeBtn = document.getElementById('closeCaseStudyBtn');
  const inquireBtn = document.getElementById('modalInquireBtn');

  if (!modal) return;

  if (closeBtn) {
    closeBtn.addEventListener('click', () => closeModal(modal));
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal(modal);
  });

  if (inquireBtn) {
    inquireBtn.addEventListener('click', () => {
      closeModal(modal);
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) {
      closeModal(modal);
    }
  });
}

function openCaseStudy(key) {
  const modal = document.getElementById('caseStudyModal');
  const data = projectData[key] || projectData['zenesys'];
  if (!modal || !data) return;

  document.getElementById('modalCategory').textContent = data.category;
  document.getElementById('modalTitle').textContent = data.title;
  document.getElementById('modalClient').textContent = data.client;
  document.getElementById('modalTimeline').textContent = data.year;
  document.getElementById('modalImg').src = data.img;
  document.getElementById('modalDescription').textContent = data.desc;

  const listEl = document.getElementById('modalDeliverablesList');
  if (listEl && data.deliverables) {
    listEl.innerHTML = data.deliverables.map(d => `<li>${d}</li>`).join('');
  }

  openModal(modal);
}

/* ==========================================================================
   5. FULL ARCHIVE MODAL
   ========================================================================== */
function initArchiveModal() {
  const modal = document.getElementById('archiveModal');
  const openBtn = document.getElementById('openArchiveBtn');
  const openNavBtn = document.getElementById('openArchiveNavBtn');
  const footerArchiveLink = document.getElementById('footerArchiveLink');
  const closeBtn = document.getElementById('closeArchiveBtn');
  const filterBtns = document.querySelectorAll('.filter-btn');
  const archiveRows = document.querySelectorAll('.archive-row');

  if (!modal) return;

  function handleOpen(e) {
    if (e) e.preventDefault();
    openModal(modal);
  }

  if (openBtn) openBtn.addEventListener('click', handleOpen);
  if (openNavBtn) openNavBtn.addEventListener('click', handleOpen);
  if (footerArchiveLink) footerArchiveLink.addEventListener('click', handleOpen);

  if (closeBtn) {
    closeBtn.addEventListener('click', () => closeModal(modal));
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal(modal);
  });

  // Filter Buttons
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');
      archiveRows.forEach(row => {
        const cat = row.getAttribute('data-category');
        if (filter === 'all' || cat === filter) {
          row.style.display = 'grid';
        } else {
          row.style.display = 'none';
        }
      });
    });
  });

  // Action Buttons inside table
  const rowActions = document.querySelectorAll('.row-action');
  rowActions.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const key = btn.getAttribute('data-open');
      closeModal(modal);
      setTimeout(() => openCaseStudy(key), 200);
    });
  });
}

function openModal(modalEl) {
  modalEl.classList.add('open');
  modalEl.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeModal(modalEl) {
  modalEl.classList.remove('open');
  modalEl.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

/* ==========================================================================
   6. FAQ CHAT-PILL ACCORDIONS (Okta Style)
   ========================================================================== */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.chat-faq-item');

  faqItems.forEach(item => {
    const questionPill = item.querySelector('.chat-pill-question');
    if (!questionPill) return;

    questionPill.addEventListener('click', () => {
      const isOpen = item.classList.contains('active');
      // Close others
      faqItems.forEach(i => i.classList.remove('active'));
      // Toggle clicked
      if (!isOpen) {
        item.classList.add('active');
      }
    });

    questionPill.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        questionPill.click();
      }
    });
  });
}

/* ==========================================================================
   7. TESTIMONIAL CAROUSEL
   ========================================================================== */
function initTestimonialCarousel() {
  const testimonials = [
    {
      quote: '"Amita delivered over 500+ social creatives and campaign reels for us without missing a single delivery deadline. Her ability to translate complex marketing concepts into captivating visual designs and motion graphics was instrumental in boosting our social engagement across all channels."',
      name: "Marketing Lead",
      company: "Zenesys Technosys Client Division"
    },
    {
      quote: '"Working with Amita on our digital comics and educational e-books was exceptional. She has a natural eye for narrative panel pacing, dialogue balloon layout, and story flow that brought our comic adaptations to life on mobile and tablet screens."',
      name: "Senior Project Manager",
      company: "Client Side — Magic Software / Tekshapers"
    },
    {
      quote: '"Amita\'s versatility across Adobe Photoshop, Illustrator, After Effects, and Figma makes her an indispensable creative powerhouse. Whether we needed a rapid 24-hour reel turnaround or a full corporate brand guideline, her work was always pixel-perfect."',
      name: "Creative Director",
      company: "Digital Media Agency Partner"
    }
  ];

  const quoteEl = document.getElementById('activeTestimonial');
  const nameEl = document.querySelector('.author-name');
  const compEl = document.querySelector('.author-company');
  const dots = document.querySelectorAll('.review-nav-dots .dot-btn');

  function showTestimonial(index) {
    if (!quoteEl) return;
    const item = testimonials[index];
    quoteEl.style.opacity = '0';
    quoteEl.style.transform = 'translateY(8px)';

    setTimeout(() => {
      quoteEl.textContent = item.quote;
      if (nameEl) nameEl.textContent = item.name;
      if (compEl) compEl.textContent = item.company;
      quoteEl.style.opacity = '1';
      quoteEl.style.transform = 'translateY(0)';
    }, 200);

    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === index);
    });
  }

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => showTestimonial(i));
  });

  // Auto rotate every 8 seconds
  let currentTestimonial = 0;
  setInterval(() => {
    currentTestimonial = (currentTestimonial + 1) % testimonials.length;
    showTestimonial(currentTestimonial);
  }, 8000);
}

/* ==========================================================================
   8. INTERACTIVE CONTACT & BRIEF FORM
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('briefForm');
  const servicePills = document.querySelectorAll('#servicePills .form-pill');
  const budgetPills = document.querySelectorAll('#budgetPills .form-pill');
  const successModal = document.getElementById('successModal');
  const closeSuccessBtn = document.getElementById('closeSuccessBtn');
  const confirmSuccessBtn = document.getElementById('confirmSuccessBtn');

  let selectedServices = ['Graphic & Branding'];
  let selectedBudget = 'Standard (2-4 Weeks)';

  // Multi-select for Services
  servicePills.forEach(pill => {
    pill.addEventListener('click', () => {
      const val = pill.getAttribute('data-value');
      if (pill.classList.contains('active')) {
        if (selectedServices.length > 1) {
          pill.classList.remove('active');
          selectedServices = selectedServices.filter(s => s !== val);
        }
      } else {
        pill.classList.add('active');
        selectedServices.push(val);
      }
    });
  });

  // Single-select for Budget / Timeline
  budgetPills.forEach(pill => {
    pill.addEventListener('click', () => {
      budgetPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      selectedBudget = pill.getAttribute('data-value');
    });
  });

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('userName').value.trim();
      const email = document.getElementById('userEmail').value.trim();
      const company = document.getElementById('userCompany').value.trim() || 'N/A';
      const details = document.getElementById('projectDetails').value.trim();

      // Show in success modal
      if (successModal) {
        document.getElementById('successName').textContent = name || 'Friend';
        const detailsBox = document.getElementById('successDetailsBox');
        if (detailsBox) {
          detailsBox.innerHTML = `
            <div><strong>Services:</strong> ${selectedServices.join(', ')}</div>
            <div><strong>Timeline / Scope:</strong> ${selectedBudget}</div>
            <div><strong>Company:</strong> ${company}</div>
            <div><strong>Email:</strong> ${email}</div>
          `;
        }
        openModal(successModal);
      }

      // Pre-fill mailto link in background for convenience
      const subject = encodeURIComponent(`Project Brief from ${name} (${company})`);
      const body = encodeURIComponent(
        `Hi Amita,\n\nI would like to inquire about a project:\n\n` +
        `Name: ${name}\n` +
        `Email: ${email}\n` +
        `Company: ${company}\n` +
        `Selected Services: ${selectedServices.join(', ')}\n` +
        `Timeline / Scope: ${selectedBudget}\n\n` +
        `Project Details:\n${details}\n\n` +
        `Looking forward to hearing from you!`
      );
      
      const mailtoUrl = `mailto:amitadubey46@gmail.com?subject=${subject}&body=${body}`;
      
      // Optionally trigger after small delay
      setTimeout(() => {
        window.location.href = mailtoUrl;
      }, 1000);

      form.reset();
    });
  }

  if (closeSuccessBtn) {
    closeSuccessBtn.addEventListener('click', () => closeModal(successModal));
  }
  if (confirmSuccessBtn) {
    confirmSuccessBtn.addEventListener('click', () => closeModal(successModal));
  }
}

/* ==========================================================================
   9. MOBILE DRAWER NAVIGATION
   ========================================================================== */
function initMobileNav() {
  const toggleBtn = document.getElementById('mobileMenuToggle');
  const drawer = document.getElementById('mobileDrawer');
  const mobLinks = document.querySelectorAll('.mobile-drawer .mob-link');

  if (!toggleBtn || !drawer) return;

  toggleBtn.addEventListener('click', () => {
    drawer.classList.toggle('open');
  });

  mobLinks.forEach(link => {
    link.addEventListener('click', () => {
      drawer.classList.remove('open');
    });
  });
}

/* ==========================================================================
   10. AMBIANCE / THEME TOGGLE (Expand button)
   ========================================================================== */
function initThemeToggle() {
  const btn = document.getElementById('themeToggleBtn');
  if (!btn) return;

  btn.addEventListener('click', () => {
    document.body.classList.toggle('light-theme');
    const isLight = document.body.classList.contains('light-theme');
    btn.title = isLight ? "Switch to Dark Studio mode" : "Toggle ambiance";
  });
}
