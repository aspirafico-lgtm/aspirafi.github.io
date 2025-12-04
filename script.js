/* ==========================================================
   script.js — Animations, Modals, Calculator, & Logo Stagger
   ========================================================== */

/* ========== CONFIG: set your Apps Script Web App URL ==========
   Replace the placeholder below with your deployed Web App exec URL.
   Example: const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbx.../exec";
================================================================= */
const WEB_APP_URL = "hhttps://script.google.com/macros/s/AKfycbzku2_FWwFEBmcmBPjnicEu0HVFyWenPUFBMoIenkn0p7R3lMVqZ6AATvQwFLzZg6NN/exec";

/* ---------- NAVBAR SCROLL EFFECT ---------- */
(function navbarScroll() {
  const navbar = document.querySelector(".navbar");
  if (!navbar) return;
  const onScroll = () => {
    if (window.scrollY > 50) navbar.classList.add("scrolled");
    else navbar.classList.remove("scrolled");
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
})();

/* ---------- INTERSECTION OBSERVER: REVEALS ---------- */
(function setupObserver() {
  const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) {
    // reveal everything immediately
    document.querySelectorAll('[data-animate], .fade-up, .slide-left, .slide-right').forEach(el => el.classList.add('show'));
    return;
  }

  const io = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      // add show class
      el.classList.add('show');

      // if element has children and data-stagger attribute, add incremental delays via CSS var
      if (el.hasAttribute('data-stagger')) {
        Array.from(el.children).forEach((child, i) => {
          child.style.setProperty('--i', i);
          child.classList.add('show');
        });
      }

      obs.unobserve(el);
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('[data-animate], .fade-up, .slide-left, .slide-right, [data-stagger]').forEach(el => io.observe(el));
})();

/* ---------- MODAL HANDLING (openModal/closeModal) ---------- */
(function modals() {
  function openModal(id) {
    const modal = document.getElementById(id);
    if (!modal) return;
    modal.style.display = 'flex';
    // small timeout so CSS transition can run
    requestAnimationFrame(() => modal.classList.add('show'));
    // lock scroll
    document.documentElement.style.overflow = 'hidden';
  }

  function closeModal(id) {
    const modal = document.getElementById(id);
    if (!modal) return;
    modal.classList.remove('show');
    // allow CSS to finish
    setTimeout(() => {
      modal.style.display = 'none';
      // restore scroll only if no other modal open
      if (!document.querySelector('.modal.show')) {
        document.documentElement.style.overflow = '';
      }
    }, 300);
  }

  // attach to global for HTML inline use if needed
  window.openModal = openModal;
  window.closeModal = closeModal;

  // wire your buttons (IDs from your HTML)
  try {
    const map = [
      ['openLoanBtn', 'educationLoanFormModal'],
      ['openEducationLoanBtn', 'balanceTransferFormModal'],
      ['openBalanceTransferBtn', 'referralFormModal'],
      ['openReferralBtn', 'communityModal']
    ];
    map.forEach(([btnId, modalId])=>{
      const btn = document.getElementById(btnId);
      if (!btn) return;
      btn.addEventListener('click', ()=> openModal(modalId));
    });

    // close buttons
    document.querySelectorAll('.modal .close-btn').forEach(btn=>{
      btn.addEventListener('click', ()=> {
        const modal = btn.closest('.modal');
        if (modal && modal.id) closeModal(modal.id);
      });
    });

    // outside click closes
    window.addEventListener('click', (e)=>{
      document.querySelectorAll('.modal.show').forEach(modal=>{
        if (e.target === modal) closeModal(modal.id);
      });
    });

    // ESC to close
    window.addEventListener('keydown', (e)=>{
      if (e.key === 'Escape') {
        document.querySelectorAll('.modal.show').forEach(m => closeModal(m.id));
      }
    });
  } catch (err) {
    console.warn('Modal wiring issue', err);
  }
})();

/* ---------- SIMPLE FORM SUBMIT HANDLER (visual feedback) ---------- */
(function formHandler() {
  // for any form inside a modal, intercept submit and show a quick success toast then close modal
  document.querySelectorAll('.modal form').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const modal = form.closest('.modal');
      // basic in-modal feedback
      const btn = form.querySelector('button[type="submit"]');
      const originalText = btn ? btn.innerHTML : null;
      if (btn) {
        btn.disabled = true;
        btn.innerHTML = 'Submitting...';
      }

      // simulate submit (replace with real fetch/XHR)
      setTimeout(()=>{
        if (btn) { btn.innerHTML = originalText; btn.disabled = false; }
        // close modal with a short delay to let user see success
        if (modal && modal.id) {
          // optional: you could show an in-modal success message here
          closeModal(modal.id);
        }
        // optional: tiny visual confirmation (toast) — minimal
        flashToast('Thanks! We received your request.');
      }, 900);
    });
  });

  // small toast helper
  function flashToast(msg = '', duration = 2200) {
    const t = document.createElement('div');
    t.textContent = msg;
    t.style.position = 'fixed';
    t.style.left = '50%';
    t.style.transform = 'translateX(-50%)';
    t.style.bottom = '28px';
    t.style.padding = '10px 16px';
    t.style.background = 'rgba(2,6,23,0.9)';
    t.style.color = '#fff';
    t.style.borderRadius = '999px';
    t.style.zIndex = 12000;
    t.style.fontSize = '0.95rem';
    t.style.boxShadow = '0 10px 30px rgba(2,6,23,0.2)';
    document.body.appendChild(t);
    setTimeout(()=> t.style.opacity = '0', duration - 300);
    setTimeout(()=> t.remove(), duration);
  }
})();

/* ---------- CALCULATOR: EMI + UTIL ---------- */
(function calculator() {
  // expose switchTab for inline buttons in HTML
  function switchTab(evt, tabName) {
    document.querySelectorAll(".calc-tab").forEach(tab => tab.classList.remove("active"));
    document.querySelectorAll(".calc-content").forEach(content => content.classList.remove("active"));
    if (evt && evt.currentTarget) evt.currentTarget.classList.add("active");
    const el = document.getElementById(tabName);
    if (el) el.classList.add("active");
  }

  function calcLoan() {
    const isEducation = document.getElementById("education")?.classList.contains("active");
    let principal = isEducation
      ? Number(document.getElementById("calcLoanAmount").value || 0)
      : Number(document.getElementById("calcBtAmount").value || 0);

    let tenure = isEducation
      ? Number(document.getElementById("calcTenure").value || 0)
      : Number(document.getElementById("calcBtTenure").value || 0);

    let rate = isEducation
      ? Number(document.getElementById("calcRate").value || 0)
      : Number(document.getElementById("calcBtRate").value || 0);

    if (!principal || !tenure || !rate) {
      return flashCalc('Please enter valid inputs.');
    }

    const monthlyRate = rate / 12 / 100;
    const months = tenure * 12;
    const pow = Math.pow(1 + monthlyRate, months);
    const emi = (principal * monthlyRate * pow) / (pow - 1) || 0;
    const totalPayment = emi * months;
    const totalInterest = totalPayment - principal;

    const result = document.getElementById('calcResult');
    if (!result) return;
    result.innerHTML = `
      <div class="calculator-result show" role="status" aria-live="polite">
        <div class="result-item">
          <span class="result-label">Monthly EMI</span>
          <span class="result-value">₹${Number(emi).toFixed(0)}</span>
        </div>
        <div class="result-item">
          <span class="result-label">Total Interest</span>
          <span class="result-value">₹${Number(totalInterest).toFixed(0)}</span>
        </div>
        <div class="result-item">
          <span class="result-label">Total Payment</span>
          <span class="result-value">₹${Number(totalPayment).toFixed(0)}</span>
        </div>
      </div>
    `;
  }

  function resetCalculator() {
    document.getElementById('calcResult').innerHTML = '';
  }

  function flashCalc(msg) {
    // small inline message in calculator area
    const result = document.getElementById('calcResult');
    if (!result) return;
    result.innerHTML = `<div class="calculator-result show"><div style="padding:10px;color:#7f8c8d">${msg}</div></div>`;
  }

  // export for HTML inline usage
  window.switchTab = switchTab;
  window.calcLoan = calcLoan;
  window.resetCalculator = resetCalculator;
})();

/* ---------- PARTNER LOGO STAGGER (apply wave animation with JS delays) ---------- */
(function logoWave() {
  const logos = document.querySelectorAll('.logo-slider img');
  logos.forEach((logo, i) => {
    const delay = (i % 6) * 0.08; // small stagger pattern
    logo.style.animation = `waveFloat 2.6s ease-in-out ${delay}s infinite`;
    logo.style.willChange = 'transform';
  });
})();

/* ============================
   FORM RESPONSE APPEND (append only)
   - inline feedback + toast + POST to Apps Script
   - set WEB_APP_URL at top of file
   ============================ */
(function formResponseAppend() {
  function showFormFeedbackEl(form, message, type = 'success', autoHide = true, hideAfter = 3500) {
    if (!form) return;
    const fb = form.querySelector('.form-feedback');
    if (!fb) return;
    fb.textContent = message;
    fb.classList.remove('success', 'error');
    fb.classList.add(type === 'error' ? 'error' : 'success');
    if (autoHide) setTimeout(() => fb.classList.remove('success', 'error'), hideAfter);
  }

  function showToast(msg, duration = 2200) {
    const container = document.getElementById('toastContainer');
    if (!container) return;
    const t = document.createElement('div');
    t.className = 'toast';
    t.textContent = msg;
    container.appendChild(t);
    setTimeout(() => t.classList.add('hide'), duration - 300);
    setTimeout(() => t.remove(), duration);
  }

  // forms we added feedback for
  const forms = [
    document.getElementById('educationLoanForm'),
    document.getElementById('balanceTransferForm'),
    document.getElementById('referralForm')
  ];

  forms.forEach(form => {
    if (!form) return;
    // add an additional submit listener (safe append)
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn ? submitBtn.innerHTML : null;
      if (submitBtn) { submitBtn.disabled = true; submitBtn.innerHTML = 'Submitting...'; }

      // collect data
      const fd = new FormData(form);
      const payload = Object.fromEntries(fd.entries());

      if (!payload.formType) {
        showFormFeedbackEl(form, 'Internal: formType missing.', 'error', true, 5000);
        if (submitBtn) { submitBtn.disabled = false; submitBtn.innerHTML = originalText; }
        return;
      }

      if (!WEB_APP_URL || WEB_APP_URL.includes('YOUR_DEPLOYED_WEBAPP_ID')) {
        showFormFeedbackEl(form, 'Developer: set WEB_APP_URL in appended script.', 'error', true, 6000);
        if (submitBtn) { submitBtn.disabled = false; submitBtn.innerHTML = originalText; }
        return;
      }

      try {
        // Apps Script commonly uses urlencoded form and often needs mode:no-cors
        await fetch(WEB_APP_URL, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams(payload)
        });

        // assume success if fetch didn't throw (opaque response)
        showFormFeedbackEl(form, 'Thanks — we received your request. We will contact you shortly.', 'success');
        showToast('Submitted ✔');

        // close modal if your existing closeModal is defined
        const modal = form.closest('.modal');
        if (modal && modal.id && window.closeModal) setTimeout(() => window.closeModal(modal.id), 900);

      } catch (err) {
        console.error('Form submit error', err);
        showFormFeedbackEl(form, 'Submission failed — please try again.', 'error');
        showToast('Submission failed');
      } finally {
        if (submitBtn) { submitBtn.disabled = false; submitBtn.innerHTML = originalText; }
      }
    });
  });
})();


