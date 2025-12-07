document.addEventListener("DOMContentLoaded", function () {
/* ==========================================================
   script.js — Animations, Modals, Calculator, & Logo Stagger
   ========================================================== */

/* ========== CONFIG: set your Apps Script Web App URL ========== */
const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbwUcE9TtLAbqtsRQqoaRw4j1USPM6HvjVBoED7q-L_pfuK1FbFes7UDsQJ-iXrTGLH9/exec";

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
    document.querySelectorAll('[data-animate], .fade-up, .slide-left, .slide-right').forEach(el => el.classList.add('show'));
    return;
  }

  const io = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      el.classList.add('show');

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
    requestAnimationFrame(() => modal.classList.add('show'));
    document.documentElement.style.overflow = 'hidden';
  }

  function closeModal(id) {
    const modal = document.getElementById(id);
    if (!modal) return;
    modal.classList.remove('show');
    setTimeout(() => {
      modal.style.display = 'none';
      if (!document.querySelector('.modal.show')) {
        document.documentElement.style.overflow = '';
      }
    }, 300);
  }

  window.openModal = openModal;
  window.closeModal = closeModal;

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

    document.querySelectorAll('.modal .close-btn').forEach(btn=>{
      btn.addEventListener('click', ()=> {
        const modal = btn.closest('.modal');
        if (modal && modal.id) closeModal(modal.id);
      });
    });

    window.addEventListener('click', (e)=>{
      document.querySelectorAll('.modal.show').forEach(modal=>{
        if (e.target === modal) closeModal(modal.id);
      });
    });

    window.addEventListener('keydown', (e)=>{
      if (e.key === 'Escape') {
        document.querySelectorAll('.modal.show').forEach(m => closeModal(m.id));
      }
    });
  } catch (err) {
    console.warn('Modal wiring issue', err);
  }
})();

/* ---------- CALCULATOR: EMI + UTIL ---------- */
(function calculator() {
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
    const result = document.getElementById('calcResult');
    if (!result) return;
    result.innerHTML = `<div class="calculator-result show"><div style="padding:10px;color:#7f8c8d">${msg}</div></div>`;
  }

  window.switchTab = switchTab;
  window.calcLoan = calcLoan;
  window.resetCalculator = resetCalculator;
})();

/* ---------- PARTNER LOGO STAGGER ---------- */
(function logoWave() {
  const logos = document.querySelectorAll('.logo-slider img');
  logos.forEach((logo, i) => {
    const delay = (i % 6) * 0.08;
    logo.style.animation = `waveFloat 2.6s ease-in-out ${delay}s infinite`;
    logo.style.willChange = 'transform';
  });
})(); 
/* ============================
   FORM SUBMIT → GOOGLE SHEETS
   ============================ */
(function formSubmit() {

  function showMessage(form, msg, type = 'success') {
    const fb = form.querySelector('.form-feedback');
    if (!fb) return;
    fb.textContent = msg;
    fb.className = `form-feedback ${type}`;
  }

  function setupButton(form) {
    const btn = form.querySelector('button[type="submit"]');
    if (!btn) return;

    const requiredFields = form.querySelectorAll('[required]');

    function checkValidity() {
      if (form.checkValidity()) {
        btn.disabled = false;
        btn.classList.remove('btn-disabled');
        btn.classList.add('btn-ready');
      } else {
        btn.disabled = true;
        btn.classList.add('btn-disabled');
        btn.classList.remove('btn-ready');
      }
    }

    requiredFields.forEach(f => f.addEventListener('input', checkValidity));
    checkValidity();
  }

  document.querySelectorAll('form').forEach(form => {
    setupButton(form);

    form.addEventListener('submit', async e => {
      e.preventDefault();

      if (!form.checkValidity()) return;

      const btn = form.querySelector('button[type="submit"]');
      const original = btn.innerHTML;
      btn.disabled = true;
      btn.innerHTML = 'Submitting...';

      try {
        const data = new FormData(form);

        await fetch(WEB_APP_URL, {
          method: 'POST',
          mode: 'no-cors',
          body: new URLSearchParams(data)
        });

        showMessage(form, '✅ Your form has been successfully submitted.', 'success');
        form.reset();
        setupButton(form);

        const modal = form.closest('.modal');
        if (modal && window.closeModal) {
          setTimeout(() => closeModal(modal.id), 800);
        }

      } catch (err) {
        showMessage(form, '❌ Submission failed. Please try again.', 'error');
      } finally {
        btn.innerHTML = original;
      }
    });
  });

})();
});
