// Apurva's Dental — Apple-Grade Shared Site Engine

document.addEventListener('DOMContentLoaded', () => {

  /* 1. Subtle Sticky Navbar on Scroll */
  const nav = document.querySelector('.nav');
  if (nav) {
    const onScroll = () => {
      if (window.scrollY > 20) nav.classList.add('is-solid');
      else nav.classList.remove('is-solid');
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* 2. Hero Background Slideshow (Automated Smooth Crossfade, No Buttons) */
  const heroSlides = document.querySelectorAll('.hero-slide');
  if (heroSlides.length > 1) {
    let currentHeroSlide = 0;
    setInterval(() => {
      heroSlides[currentHeroSlide].classList.remove('is-active');
      currentHeroSlide = (currentHeroSlide + 1) % heroSlides.length;
      heroSlides[currentHeroSlide].classList.add('is-active');
    }, 5500);
  }

    /* 3. Our Story / Milestones: Horizontal Scroll Pinning (GSAP ScrollTrigger / Adaptive Sticky Pin) */
  const storyContainer = document.getElementById('story-scroll-container');
  const storySticky = storyContainer ? storyContainer.querySelector('.story-sticky-container') : null;
  const storyTrack = document.getElementById('story-carousel-track');
  const storyFill = document.getElementById('story-progress-fill');

  if (storyContainer && storyTrack) {
    // Exact distance needed to move the track horizontally so all cards glide past
    const getTravelDistance = () => {
      const trackWidth = storyTrack.scrollWidth;
      const viewportWidth = window.innerWidth;
      const paddingRight = window.innerWidth <= 600 ? 32 : (window.innerWidth <= 900 ? 48 : 70);
      return Math.max(0, trackWidth - viewportWidth + paddingRight);
    };

    if (window.gsap && window.ScrollTrigger) {
      gsap.registerPlugin(ScrollTrigger);

      // Animation: moves storyTrack horizontally to the left
      const scrollTween = gsap.to(storyTrack, {
        x: () => -getTravelDistance(),
        ease: 'none',
        paused: true
      });

      // Pin the section when it hits the top (below 68px navbar)
      ScrollTrigger.create({
        trigger: storyContainer,
        start: 'top top+=68',
        end: () => `+=${Math.round(getTravelDistance() * 1.15)}`,
        pin: storySticky || storyContainer,
        pinSpacing: true,
        animation: scrollTween,
        scrub: 0.6,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          if (storyFill) {
            storyFill.style.width = `${Math.min(100, Math.max(0, self.progress * 100))}%`;
          }
        }
      });

      window.addEventListener('load', () => {
        ScrollTrigger.refresh();
      });
    } else {
      // High-performance CSS Sticky Pin fallback if GSAP is unavailable
      let targetProgress = 0;
      let currentProgress = 0;
      let isRafRunning = false;

      const onStickyScroll = () => {
        const travel = getTravelDistance();
        const pinScrollDistance = Math.round(travel * 1.15);
        const navOffset = 68;
        const vh = window.innerHeight;
        const totalHeight = vh - navOffset + pinScrollDistance;
        storyContainer.style.height = `${totalHeight}px`;
        if (storySticky) {
          storySticky.style.position = 'sticky';
          storySticky.style.top = `${navOffset}px`;
        }

        const rect = storyContainer.getBoundingClientRect();
        const scrolled = navOffset - rect.top;
        if (pinScrollDistance > 0) {
          targetProgress = Math.max(0, Math.min(1, scrolled / pinScrollDistance));
        } else {
          targetProgress = 0;
        }

        if (!isRafRunning) {
          isRafRunning = true;
          requestAnimationFrame(updateStickyRender);
        }
      };

      const updateStickyRender = () => {
        currentProgress += (targetProgress - currentProgress) * 0.25;
        if (Math.abs(targetProgress - currentProgress) < 0.001) {
          currentProgress = targetProgress;
        }
        const travel = getTravelDistance();
        storyTrack.style.transform = `translateX(${-currentProgress * travel}px)`;
        if (storyFill) {
          storyFill.style.width = `${currentProgress * 100}%`;
        }
        if (currentProgress !== targetProgress) {
          requestAnimationFrame(updateStickyRender);
        } else {
          isRafRunning = false;
        }
      };

      window.addEventListener('scroll', onStickyScroll, { passive: true });
      window.addEventListener('resize', onStickyScroll, { passive: true });
      onStickyScroll();
    }
  }

  /* 4. Dual-Stream Testimonials: Continuous Autonomous Gliding in Opposite Directions */
  // Top row (track-right) glides continuously to the right
  // Bottom row (track-left) glides continuously to the left
  // Runs 100% autonomously via CSS keyframes with zero required user interaction

  /* 5. Mobile Navigation Drawer */
  const mobileToggle = document.getElementById('mobile-toggle');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const mobileOverlay = document.getElementById('mobile-overlay');
  const mobileClose = document.getElementById('mobile-close');

  const openDrawer = () => {
    mobileDrawer?.classList.add('is-open');
    mobileOverlay?.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  };
  const closeDrawer = () => {
    mobileDrawer?.classList.remove('is-open');
    mobileOverlay?.classList.remove('is-open');
    document.body.style.overflow = '';
  };

  mobileToggle?.addEventListener('click', openDrawer);
  mobileClose?.addEventListener('click', closeDrawer);
  mobileOverlay?.addEventListener('click', closeDrawer);

  /* 6. Quick Callback Form Submission */
  document.querySelectorAll('.booking-card form:not(#contact-appointment-form)').forEach((form) => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const nameInput = form.querySelector('input[type="text"]');
      const phoneInput = form.querySelector('input[type="tel"]');
      const name = nameInput ? nameInput.value.trim() : '';
      const phone = phoneInput ? phoneInput.value.trim() : '';

      if (!name || !phone) {
        alert('Please enter your name and phone number.');
        return;
      }

      form.innerHTML = `
        <div style="text-align:center;padding:16px 8px;">
          <div style="width:48px;height:48px;border-radius:50%;background:#e0f7f3;color:#0d9488;display:inline-flex;align-items:center;justify-content:center;margin-bottom:12px">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
          </div>
          <h4 style="font-size:18px;color:#0e1e3e;margin-bottom:6px">Callback Requested!</h4>
          <p style="font-size:13.5px;color:#475569">Thank you, <strong>${name}</strong>. Our clinical team will contact <strong>${phone}</strong> within 10 minutes.</p>
        </div>
      `;
    });
  });

  /* 7. Multi-Service & Multi-Doctor Tab Engine (Hash-aware) */
  const detailTabBtns = document.querySelectorAll('.detail-tab-btn');
  const detailPanes = document.querySelectorAll('.detail-pane');

  if (detailTabBtns.length && detailPanes.length) {
    const activateTab = (targetId, updateHistory = true) => {
      if (!targetId) return false;
      const cleanId = targetId.startsWith('#') ? targetId : `#${targetId}`;
      const targetPane = document.querySelector(cleanId);
      const targetBtn = document.querySelector(`.detail-tab-btn[data-target="${cleanId}"]`);

      if (targetPane && targetBtn) {
        detailTabBtns.forEach((btn) => {
          btn.classList.remove('is-active');
          btn.setAttribute('aria-selected', 'false');
        });
        detailPanes.forEach((pane) => pane.classList.remove('is-active'));

        targetBtn.classList.add('is-active');
        targetBtn.setAttribute('aria-selected', 'true');
        targetPane.classList.add('is-active');

        if (updateHistory && window.location.hash !== cleanId) {
          history.replaceState(null, '', cleanId);
        }
        return true;
      }
      return false;
    };

    detailTabBtns.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = btn.getAttribute('data-target');
        activateTab(targetId);
      });
    });

    if (window.location.hash) {
      activateTab(window.location.hash, false);
    }

    window.addEventListener('hashchange', () => {
      if (window.location.hash) {
        activateTab(window.location.hash, false);
      }
    });
  }

  /* 8. Interactive Services Treatment Estimator Widget */
  const estimatorBtns = document.querySelectorAll('.estimator-opt-btn');
  const estimatorData = {
    'cleaning': {
      title: 'Preventive Cleaning & Digital Intraoral Scan',
      cost: '$180',
      duration: '45 Minutes',
      anesthesia: 'None Needed (Zero Pain)',
      longevity: 'Every 6 Months',
      coverage: '100% PPO Covered',
      financing: 'Free with Most Insurances'
    },
    'veneers': {
      title: 'Artisan Custom Porcelain Veneers',
      cost: '$950 / tooth',
      duration: '2 Precision Visits',
      anesthesia: 'Gentle Local Numbing',
      longevity: '15 – 20+ Years',
      coverage: 'Partial / HSA Eligible',
      financing: 'From $79/month at 0% APR'
    },
    'implants': {
      title: 'Monolithic Zirconia Dental Implant & Crown',
      cost: '$1,850 complete',
      duration: '1 – 2 Clinical Visits',
      anesthesia: 'Computerized Pain-Free Local',
      longevity: 'Lifetime Durability',
      coverage: 'Up to 80% PPO Coverage',
      financing: 'From $149/month at 0% APR'
    },
    'invisalign': {
      title: 'Invisalign® Clear Aligner System',
      cost: '$3,400 full treatment',
      duration: '6 – 12 Months',
      anesthesia: 'Completely Non-Invasive',
      longevity: 'Permanent with Retainer',
      coverage: '$1,500 – $2,500 Ortho Benefit',
      financing: 'From $129/month at 0% APR'
    }
  };

  estimatorBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      estimatorBtns.forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      const key = btn.getAttribute('data-treatment');
      const d = estimatorData[key];
      if (d) {
        const titleEl = document.getElementById('est-title');
        const costEl = document.getElementById('est-cost');
        const durEl = document.getElementById('est-dur');
        const anesEl = document.getElementById('est-anes');
        const longEl = document.getElementById('est-long');
        const covEl = document.getElementById('est-cov');
        const finEl = document.getElementById('est-fin');
        const estBookBtn = document.getElementById('est-book-btn');

        if (titleEl) titleEl.textContent = d.title;
        if (costEl) costEl.textContent = d.cost;
        if (durEl) durEl.textContent = d.duration;
        if (anesEl) anesEl.textContent = d.anesthesia;
        if (longEl) longEl.textContent = d.longevity;
        if (covEl) covEl.textContent = d.coverage;
        if (finEl) finEl.textContent = d.financing;
        if (estBookBtn) estBookBtn.href = `contact.html?service=${key}`;
      }
    });
  });

  /* 9. Interactive Before & After Drag Slider (Dynamic Resizing & Preset Buttons) */
  const baContainer = document.getElementById('ba-container');
  const baBefore = document.getElementById('ba-before');
  const baHandle = document.getElementById('ba-handle');

  if (baContainer && baBefore && baHandle) {
    let isDragging = false;

    const syncBaDimensions = () => {
      const w = baContainer.offsetWidth;
      const h = baContainer.offsetHeight;
      const beforeImg = baBefore.querySelector('img');
      if (beforeImg) {
        beforeImg.style.width = `${w}px`;
        beforeImg.style.height = `${h}px`;
      }
    };
    syncBaDimensions();
    window.addEventListener('resize', syncBaDimensions);

    const updateSlider = (clientX) => {
      const rect = baContainer.getBoundingClientRect();
      let x = clientX - rect.left;
      x = Math.max(0, Math.min(x, rect.width));
      const percent = (x / rect.width) * 100;
      baBefore.style.width = `${percent}%`;
      baHandle.style.left = `${percent}%`;
    };

    baContainer.addEventListener('mousedown', (e) => {
      isDragging = true;
      updateSlider(e.clientX);
    });
    window.addEventListener('mouseup', () => { isDragging = false; });
    window.addEventListener('mousemove', (e) => {
      if (isDragging) updateSlider(e.clientX);
    });

    baContainer.addEventListener('touchstart', (e) => {
      isDragging = true;
      if (e.touches[0]) updateSlider(e.touches[0].clientX);
    }, { passive: true });
    window.addEventListener('touchend', () => { isDragging = false; });
    window.addEventListener('touchmove', (e) => {
      if (isDragging && e.touches[0]) updateSlider(e.touches[0].clientX);
    }, { passive: true });

    // Slider Quick Preset Buttons (Pre-Op / 50-50 / Post-Op)
    const presetBtns = document.querySelectorAll('.ba-preset-btn');
    const setPercent = (percent) => {
      percent = Math.max(0, Math.min(100, percent));
      baBefore.style.transition = 'width 0.4s cubic-bezier(0.22, 1, 0.36, 1)';
      baHandle.style.transition = 'left 0.4s cubic-bezier(0.22, 1, 0.36, 1)';
      baBefore.style.width = `${percent}%`;
      baHandle.style.left = `${percent}%`;
      setTimeout(() => {
        baBefore.style.transition = 'none';
        baHandle.style.transition = 'none';
      }, 420);
    };

    presetBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const val = parseFloat(btn.getAttribute('data-preset') || '50');
        setPercent(val);
      });
    });
  }

  /* 10. URL Parameter Autofill for Booking Form (contact.html) */
  const urlParams = new URLSearchParams(window.location.search);
  const doctorParam = urlParams.get('doctor');
  const serviceParam = urlParams.get('service');

  if (doctorParam) {
    const docSelect = document.getElementById('book-doctor');
    if (docSelect) {
      for (let i = 0; i < docSelect.options.length; i++) {
        const opt = docSelect.options[i];
        if (opt.value === doctorParam || opt.value.toLowerCase().includes(doctorParam.toLowerCase())) {
          docSelect.selectedIndex = i;
          break;
        }
      }
    }
  }

  if (serviceParam) {
    const svcSelect = document.getElementById('book-service');
    if (svcSelect) {
      for (let i = 0; i < svcSelect.options.length; i++) {
        const opt = svcSelect.options[i];
        if (opt.value === serviceParam || opt.value.toLowerCase().includes(serviceParam.toLowerCase())) {
          svcSelect.selectedIndex = i;
          break;
        }
      }
    }
  }

  /* 11. Appointment Booking Form Submission with Receipt (contact.html) */
  const bookingForm = document.getElementById('contact-appointment-form');
  const bookingSuccessMsg = document.getElementById('booking-success-message');
  if (bookingForm && bookingSuccessMsg) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('book-name')?.value.trim() || 'Patient';
      const phone = document.getElementById('book-phone')?.value.trim() || '';
      const email = document.getElementById('book-email')?.value.trim() || 'Not specified';
      const serviceEl = document.getElementById('book-service');
      const serviceText = serviceEl ? serviceEl.options[serviceEl.selectedIndex].text : 'General Dental Care';
      const doctorEl = document.getElementById('book-doctor');
      const doctorText = doctorEl ? doctorEl.options[doctorEl.selectedIndex].text : 'First Available Specialist';
      const datetimeVal = document.getElementById('book-datetime')?.value || '';
      
      let dateStr = 'First Available Priority Slot';
      if (datetimeVal) {
        try {
          const d = new Date(datetimeVal);
          dateStr = d.toLocaleString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true });
        } catch(err) {
          dateStr = datetimeVal;
        }
      }

      const submitBtn = document.getElementById('book-submit-btn');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = 'Securing Operatory Reservation...';
      }

      setTimeout(() => {
        bookingForm.style.display = 'none';
        bookingSuccessMsg.style.display = 'block';
        bookingSuccessMsg.innerHTML = `
          <div style="width:64px;height:64px;border-radius:50%;background:#ccfbf1;color:#0d9488;display:inline-flex;align-items:center;justify-content:center;margin-bottom:18px;box-shadow:0 8px 20px rgba(13,148,136,0.25)">
            <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
          </div>
          <div style="margin-bottom:8px">
            <span style="background:#e0f7f3;color:#0d9488;font-weight:700;padding:4px 14px;border-radius:999px;font-size:12px;display:inline-block">RESERVATION RECEIVED</span>
          </div>
          <h3 style="font-size:26px;color:#0e1e3e;margin:0 0 8px">Priority Visit Reserved, ${name}!</h3>
          <p style="font-size:15px;color:#475569;max-width:540px;margin:0 auto 24px;line-height:1.6">
            Our clinical concierge coordinator has registered your request. We will contact <strong>${phone}</strong> within 15 minutes to confirm operatory prep.
          </p>

          <div style="background:#ffffff;border:1px solid #e2e8f0;border-radius:16px;padding:20px;max-width:520px;margin:0 auto 24px;text-align:left;font-size:14px;display:flex;flex-direction:column;gap:10px;box-shadow:0 4px 16px rgba(0,0,0,0.04)">
            <div style="display:flex;justify-content:space-between"><span>Supervising Doctor:</span><strong style="color:#0e1e3e">${doctorText}</strong></div>
            <div style="display:flex;justify-content:space-between"><span>Clinical Service:</span><strong style="color:#0d9488">${serviceText}</strong></div>
            <div style="display:flex;justify-content:space-between"><span>Requested Time:</span><strong style="color:#0e1e3e">${dateStr}</strong></div>
            <div style="display:flex;justify-content:space-between"><span>Booking Reference:</span><strong style="color:#0e1e3e">#APV-${Math.floor(100000 + Math.random() * 900000)}</strong></div>
          </div>

          <div style="display:flex;justify-content:center;gap:14px;flex-wrap:wrap">
            <a href="index.html" class="btn btn--navy btn--sm">Return to Home</a>
            <button type="button" id="book-another-btn" class="btn btn--white btn--sm" style="border:1px solid #cbd5e1">Book Another Visit</button>
          </div>
        `;

        document.getElementById('book-another-btn')?.addEventListener('click', () => {
          bookingForm.reset();
          bookingForm.style.display = 'flex';
          bookingSuccessMsg.style.display = 'none';
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = `Confirm Appointment Request <span class="icon-badge"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17L17 7M9 7h8v8"/></svg></span>`;
          }
        });
      }, 600);
    });
  }

  /* 12. Live Clinic Operating Hours Status Pill */
  const statusPill = document.getElementById('clinic-live-status-pill');
  if (statusPill) {
    const now = new Date();
    const day = now.getDay(); // 0 = Sun, 1 = Mon ... 6 = Sat
    const hour = now.getHours();
    const minute = now.getMinutes();
    const currentMins = hour * 60 + minute;

    const isWeekday = day >= 1 && day <= 5;
    const openMins = isWeekday ? 8 * 60 : 9 * 60 + 30; // 8:00 AM or 9:30 AM
    const closeMins = isWeekday ? 18 * 60 : 17 * 60 + 30; // 6:00 PM or 5:30 PM

    if (currentMins >= openMins && currentMins < closeMins) {
      const closeTimeStr = isWeekday ? '6:00 PM' : '5:30 PM';
      statusPill.innerHTML = `🟢 Open Now &bull; Closes ${closeTimeStr}`;
      statusPill.style.background = '#dcfce7';
      statusPill.style.color = '#15803d';
    } else {
      const nextOpenStr = (day >= 1 && day <= 4) ? 'Tomorrow 8:00 AM' : (day === 5 ? 'Saturday 9:30 AM' : (day === 6 ? 'Sunday 9:30 AM' : 'Monday 8:00 AM'));
      statusPill.innerHTML = `🟡 Closed Now &bull; Opens ${nextOpenStr}`;
      statusPill.style.background = '#fef3c7';
      statusPill.style.color = '#b45309';
    }
  }

  /* 13. Reading Progress Bar for Clinical Guides (blog-details.html) */
  const progressBar = document.getElementById('reading-progress-bar');
  if (progressBar) {
    window.addEventListener('scroll', () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        const scrolled = (window.scrollY / totalScroll) * 100;
        progressBar.style.width = `${Math.min(100, Math.max(0, scrolled))}%`;
      }
    }, { passive: true });
  }

});
