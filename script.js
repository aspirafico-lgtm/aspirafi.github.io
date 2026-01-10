document.addEventListener("DOMContentLoaded", function () {

  /* ==========================================================
     CONFIG — Google Apps Script Web App URL
     ========================================================== */
  const WEB_APP_URL =
    "https://script.google.com/macros/s/AKfycbx2qR7xkOyDQNp_sRtmZDDjRL2_rnaMEP_xbRF-ibu5TYrwJMtUDmr_-IjE-wV196wO/exec";

  /* ==========================================================
     NAVBAR SCROLL EFFECT
     ========================================================== */
  (function navbarScroll() {
    const navbar = document.querySelector(".navbar");
    if (!navbar) return;

    function onScroll() {
      if (window.scrollY > 50) navbar.classList.add("scrolled");
      else navbar.classList.remove("scrolled");
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  })();

  /* ==========================================================
     MODAL HANDLING
     ========================================================== */
  (function modals() {

    function openModal(id) {
      const modal = document.getElementById(id);
      if (!modal) return;
      modal.style.display = "flex";
      requestAnimationFrame(() => modal.classList.add("show"));
      document.documentElement.style.overflow = "hidden";
    }

    function closeModal(id) {
      const modal = document.getElementById(id);
      if (!modal) return;
      modal.classList.remove("show");
      setTimeout(() => {
        modal.style.display = "none";
        document.documentElement.style.overflow = "";
      }, 300);
    }

    window.openModal = openModal;
    window.closeModal = closeModal;

    const modalMap = [
      ["openLoanBtn", "educationLoanFormModal"],
      ["openEducationLoanBtn", "balanceTransferFormModal"],
      ["openBalanceTransferBtn", "referralFormModal"],
      ["openReferralBtn", "communityModal"]
    ];

    modalMap.forEach(([btnId, modalId]) => {
      const btn = document.getElementById(btnId);
      if (btn) btn.addEventListener("click", () => openModal(modalId));
    });

    document.querySelectorAll(".modal .close-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const modal = btn.closest(".modal");
        if (modal) closeModal(modal.id);
      });
    });

    window.addEventListener("click", e => {
      document.querySelectorAll(".modal.show").forEach(modal => {
        if (e.target === modal) closeModal(modal.id);
      });
    });

    window.addEventListener("keydown", e => {
      if (e.key === "Escape") {
        document.querySelectorAll(".modal.show").forEach(modal =>
          closeModal(modal.id)
        );
      }
    });

  })();

  /* ==========================================================
     FORM SUBMIT → GOOGLE SHEETS
     ========================================================== */
  (function formSubmit() {

    function showMessage(form, msg, type) {
      const box = form.querySelector(".form-feedback");
      if (!box) return;
      box.textContent = msg;
      box.className = "form-feedback " + type;
      box.style.display = "block";
    }

    document.querySelectorAll("form").forEach(form => {
      form.addEventListener("submit", async e => {
        e.preventDefault();
        if (!form.checkValidity()) return;

        const btn = form.querySelector("button[type='submit']");
        const originalText = btn.innerHTML;
        btn.disabled = true;
        btn.innerHTML = "Submitting...";

        try {
          const formData = new FormData(form);

          await fetch(WEB_APP_URL, {
            method: "POST",
            body: new URLSearchParams(formData)
          });

          showMessage(form, "✅ Submitted successfully!", "success");
          form.reset();

          const modal = form.closest(".modal");
          if (modal) setTimeout(() => closeModal(modal.id), 900);

        } catch (err) {
          showMessage(form, "❌ Submission failed. Try again.", "error");
        } finally {
          btn.disabled = false;
          btn.innerHTML = originalText;
        }
      });
    });

  })();

  /* ==========================================================
     LOAN CALCULATOR
     ========================================================== */
  (function calculator() {

    window.switchTab = function (evt, tabName) {
      document.querySelectorAll(".calc-tab").forEach(tab =>
        tab.classList.remove("active")
      );
      document.querySelectorAll(".calc-content").forEach(c =>
        c.classList.remove("active")
      );

      if (evt && evt.currentTarget) evt.currentTarget.classList.add("active");
      const el = document.getElementById(tabName);
      if (el) el.classList.add("active");
    };

    window.calcLoan = function () {
      const isEducation =
        document.getElementById("education")?.classList.contains("active");

      const principal = Number(
        document.getElementById(
          isEducation ? "calcLoanAmount" : "calcBtAmount"
        ).value || 0
      );

      const tenure = Number(
        document.getElementById(
          isEducation ? "calcTenure" : "calcBtTenure"
        ).value || 0
      );

      const rate = Number(
        document.getElementById(
          isEducation ? "calcRate" : "calcBtRate"
        ).value || 0
      );

      if (!principal || !tenure || !rate) return;

      const monthlyRate = rate / 12 / 100;
      const months = tenure * 12;
      const pow = Math.pow(1 + monthlyRate, months);
      const emi = (principal * monthlyRate * pow) / (pow - 1);

      const totalPayment = emi * months;
      const totalInterest = totalPayment - principal;

      document.getElementById("calcResult").innerHTML = `
        <div class="calculator-result show">
          <div class="result-item">
            <span class="result-label">Monthly EMI</span>
            <span class="result-value">₹${emi.toFixed(0)}</span>
          </div>
          <div class="result-item">
            <span class="result-label">Total Interest</span>
            <span class="result-value">₹${totalInterest.toFixed(0)}</span>
          </div>
          <div class="result-item">
            <span class="result-label">Total Payment</span>
            <span class="result-value">₹${totalPayment.toFixed(0)}</span>
          </div>
        </div>
      `;
    };

    window.resetCalculator = function () {
      document.getElementById("calcResult").innerHTML = "";
    };

  })();

  /* ==========================================================
     AUTO SCROLL TO LOAN CALCULATOR
     ========================================================== */
  (function autoScrollCalculator() {
    if (window.location.hash === "#loan-calculator") {
      setTimeout(() => {
        const el = document.getElementById("loan-calculator");
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 300);
    }
  })();

});
