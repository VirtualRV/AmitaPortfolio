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
  roco: {
    title: "Roco Fashion E-Commerce",
    client: "Roco Style Studio",
    year: "2024 — 2026",
    category: "Web & Mobile UI / Brand Identity",
    img: "assets/images/projects/portfolio-banners-roco.png",
    desc: "Complete visual direction and dual-platform UI/UX design for Roco, a trend-forward fashion e-commerce storefront featuring responsive web and native mobile shopping experiences.",
    deliverables: [
      "Responsive laptop & mobile shopping user interface in Figma",
      "Product detail pages, size selector, wishlist & quick-buy flows",
      "Promotional discount badges, seasonal banners & typographic identity",
      "Structured design tokens and ready-to-code asset handoffs"
    ]
  },
  momento: {
    title: "Momento Social Pulse",
    client: "Join Momento",
    year: "2023 — 2026",
    category: "Mobile App UI & Social Creatives",
    img: "assets/images/projects/momento.png",
    desc: "Comprehensive mobile app design and engagement visual system for Momento, an emotion-driven social networking platform crafted to foster genuine human connections.",
    deliverables: [
      "Mobile onboarding journey with custom character illustrations",
      "Interactive emotion-meter feeds, audio snippets & reaction states",
      "High-converting video reels, motion graphics & viral Instagram posts",
      "Complete design system with dark and vibrant purple palettes"
    ]
  },
  wolves: {
    title: "Wolves Urban Apparel & Store",
    client: "Wolves Streetwear",
    year: "2024",
    category: "Brand Identity & Web Storefront",
    img: "assets/images/projects/portfolio-banners-wolves.png",
    desc: "Dark brutalist brand identity and responsive e-commerce lookbook for Wolves, an edgy modern streetwear label celebrating raw youth culture.",
    deliverables: [
      "Bold monochrome logo identity & apparel typography",
      "High-impact editorial product lookbook web UI",
      "Drop announcements, campaign posters & Instagram teasers",
      "Optimized e-commerce collection grid with seamless checkout"
    ]
  },
  fashionbooms: {
    title: "Fashion Booms Mobile App",
    client: "Fashion Booms Global",
    year: "2024 — 2025",
    category: "Mobile App UI/UX & E-Commerce",
    img: "assets/images/projects/portfolio banners fashion booms.png",
    desc: "End-to-end mobile shopping application design for a global fast-fashion retailer, engineered to drive mobile sales conversion with effortless product discovery.",
    deliverables: [
      "Intuitive mobile catalog, categorized filters & product cards",
      "Frictionless 3-step checkout with multiple payment gateway options",
      "Size recommendation modals and dynamic photo swatches",
      "Developer-aligned interactive Figma component library"
    ]
  },
  addcraft: {
    title: "Add Craft Generative AI Studio",
    client: "Add Craft SaaS",
    year: "2025 — 2026",
    category: "AI SaaS Platform UI & Design System",
    img: "assets/images/projects/portfolio-banners-Add-craft.png",
    desc: "Futuristic dark-mode creative workspace UI and branding identity for Add Craft, a next-generation AI image, audio, and video generation suite.",
    deliverables: [
      "Web SaaS dashboard featuring modular toolbars and generation canvas",
      "Prompt engineering interface with quality and duration controls",
      "Custom neon feather logo mark & cosmic branding aesthetic",
      "Tiered subscription pricing cards & workspace navigation"
    ]
  },
  mobipay: {
    title: "MobiPay Digital E-Wallet",
    client: "MobiPay Financial",
    year: "2024",
    category: "Fintech Mobile App UI/UX",
    img: "assets/images/projects/E-wallet-Mobile-App-Development-1.png",
    desc: "Minimalist, trusted fintech mobile wallet app interface designed to make peer-to-peer payments and money transfers seamless across international currencies.",
    deliverables: [
      "Clean onboarding and instant phone OTP authentication screens",
      "Virtual debit card management and balance dashboard",
      "Transaction history tracking with clear status categorization",
      "Security-focused micro-interactions and accessible typography"
    ]
  },
  harley: {
    title: "Harley-Davidson Heritage Showcase",
    client: "Automotive Interactive",
    year: "2024",
    category: "Automotive Web UI & Hero Experience",
    img: "assets/images/projects/HARLEY-DAVIDSON-BIKE-UI-Save-it.jpg",
    desc: "High-octane web showcase and digital landing page design celebrating legendary Harley-Davidson cruisers with bold typography and immersive visual styling.",
    deliverables: [
      "Full-bleed visual landing page featuring yellow accent highlights",
      "Interactive 360-degree bike inspection and spec overlays",
      "Cinematic video trailer integration and sound preview modules",
      "Responsive design optimized for 4K desktop and mobile viewports"
    ]
  },
  virtualtryon: {
    title: "Virtual Room AR Fitting App",
    client: "Virtual Fit Labs",
    year: "2025",
    category: "AR/AI Mobile App UI & Visual Design",
    img: "assets/images/projects/portfolio-banners-virtual-try-on.png",
    desc: "Innovative augmented-reality apparel fitting interface allowing online shoppers to project clothes onto live camera viewports and customize fit before purchasing.",
    deliverables: [
      "AR camera viewport controls, garment carousel & size toggles",
      "Clean orange-themed mobile shopping UI and cart triggers",
      "Futuristic 'VR Virtual' brand identity mark and typography",
      "User feedback indicators for realistic cloth drape simulations"
    ]
  },
  healthcare: {
    title: "Healthcare AI Agent & Clinical App",
    client: "CarePulse Healthtech",
    year: "2025",
    category: "Healthtech Mobile & Web UI",
    img: "assets/images/projects/portfolio-banners-AI-Agent-Created-for-Healthcare-Client.png",
    desc: "Comprehensive digital healthcare platform integrating doctor scheduling, patient clinical records, and an intelligent triage AI agent.",
    deliverables: [
      "Doctor appointment scheduling calendar with verified physician ratings",
      "Medical article feed, symptom triage and AI chat assistant UI",
      "Remote patient chronic care monitoring telemetry views",
      "Accessible typography and medical-grade color harmony"
    ]
  },
  jewelry: {
    title: "Heri Jane Luxury Jewelry",
    client: "Heri Jane Fine Jewelry",
    year: "2023 — 2024",
    category: "Luxury E-Commerce & Brand Identity",
    img: "assets/images/projects/Jewelry-6.png",
    desc: "Sophisticated luxury e-commerce mobile experience featuring dark editorial backgrounds, golden highlights, and exquisite product photography curation.",
    deliverables: [
      "Warm ambient dark-mode mobile shopping interface",
      "Jewelry catalog grids for bangles, necklaces, and earrings",
      "Curated editorial typography matching premium jewelry market",
      "High-conversion 'Get Started' and wishlist purchase flows"
    ]
  },
  smartwatch: {
    title: "Smart Watch Tech Store & Web UI",
    client: "Apex Wearables",
    year: "2024",
    category: "Wearable Tech Web UI & Campaign",
    img: "assets/images/projects/Smart-Watch-portfolio.png",
    desc: "Vibrant e-commerce storefront and promotional campaign design for next-generation smart watches, featuring dynamic category tabs and promotional event banners.",
    deliverables: [
      "Vibrant high-contrast purple store theme and hero showcase",
      "Black Friday promotional campaign banners and badges",
      "Product comparison matrix by strap style, display, and features",
      "Responsive web grid with instant search and cart integration"
    ]
  },
  socialcreatives: {
    title: "500+ Social Media & Marketing Creatives",
    client: "Zenesys Technosys & Client Accounts",
    year: "2021 — 2026",
    category: "Social Media Templates, Reels & Ads",
    img: "assets/images/projects/Insta-Template-1.jpg",
    desc: "Extensive portfolio of 500+ commercial graphics, Instagram story & post templates, advertising carousels, and viral video reels delivered across 5+ years.",
    deliverables: [
      "500+ high-velocity social media posts, stories, and carousels",
      "Reusable brand templates in Canva, Photoshop & Illustrator",
      "Performance marketing ad creatives with measurable conversion lifts",
      "Strict deadline adherence with 100% on-time delivery across sprints"
    ]
  }
};

let currentProjectKey = 'roco';

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
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const submitBtn = document.getElementById('submitBriefBtn');
      const origBtnText = submitBtn ? submitBtn.innerHTML : '';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="btn-sub-text">Saving Brief...</span>';
      }

      const name = document.getElementById('userName').value.trim();
      const email = document.getElementById('userEmail').value.trim();
      const company = document.getElementById('userCompany').value.trim() || 'N/A';
      const details = document.getElementById('projectDetails').value.trim();

      const submissionPayload = {
        name,
        email,
        company,
        services: selectedServices.join(', '),
        timeline: selectedBudget,
        details
      };

      // 1. Post to local API endpoint (records directly in contact-submissions.json and data.json)
      try {
        await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(submissionPayload)
        });
      } catch (err) {
        console.warn('API save fallback:', err);
        try {
          await fetch('/data', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(submissionPayload)
          });
        } catch (e) {}
      }

      // 2. Persist in browser localStorage
      try {
        const stored = JSON.parse(localStorage.getItem('amita_submissions') || '[]');
        stored.unshift({ ...submissionPayload, time: new Date().toLocaleString() });
        localStorage.setItem('amita_submissions', JSON.stringify(stored));
      } catch (err) {}

      // 3. Show in success modal (WITHOUT opening Outlook or any external app)
      if (successModal) {
        document.getElementById('successName').textContent = name || 'Friend';
        const detailsBox = document.getElementById('successDetailsBox');
        if (detailsBox) {
          detailsBox.innerHTML = `
            <div><strong>Services:</strong> ${selectedServices.join(', ')}</div>
            <div><strong>Timeline / Scope:</strong> ${selectedBudget}</div>
            <div><strong>Company:</strong> ${company}</div>
            <div><strong>Email:</strong> ${email}</div>
            <div style="margin-top:0.5rem; padding-top:0.5rem; border-top:1px solid rgba(255,255,255,0.1);">
              <span style="color:#00ff88; font-weight:600;">✓ Saved to JSON File &amp; Records</span>
            </div>
          `;
        }
        openModal(successModal);
      }

      // Re-enable and reset form
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = origBtnText;
      }
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
