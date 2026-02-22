/* ===============================
   ASPIRAFI LOAN CALCULATOR - FINAL VERSION
   ✅ 100% WORKING - COPY PASTE READY
================================ */
document.addEventListener('DOMContentLoaded', function() {
    
    // ALL ELEMENTS
    const amountSlider = document.getElementById('amountSlider');
    const displayAmount = document.getElementById('displayAmount');
    const displayEMI = document.getElementById('displayEMI');
    const tenure = document.getElementById('tenure');
    const roiInput = document.getElementById('roiInput');
    const oldRoi = document.getElementById('oldRoi');
    const newRoi = document.getElementById('newRoi');
    const elBtn = document.getElementById('elBtn');
    const btBtn = document.getElementById('btBtn');
    const elRoiBlock = document.getElementById('elRoiBlock');
    const btRoiBlock = document.getElementById('btRoiBlock');
    const savingsBox = document.getElementById('savingsBox');
    const savingsAmount = document.getElementById('savingsAmount');
    
    const eligibilityModal = document.getElementById('eligibilityModal');
    const eligibilityForm = document.getElementById('eligibilityForm');
    const btFields = document.getElementById('btFields');
    const formError = document.getElementById('formError');
    const modalSubmitBtn = document.getElementById('modalSubmitBtn');
    
    const referralModal = document.getElementById('referralModal');
    const referralForm = document.getElementById('referralForm');
    const referralSubmitBtn = document.getElementById('referralSubmitBtn');
    
    const communityModal = document.getElementById('communityModal');
    const successPopup = document.getElementById('successPopup');
    
    const WEBHOOK_URL = 'https://script.google.com/macros/s/AKfycbxqd_68cNbjb0mnjwANGQmiXFuiZNkvKRlIZIf9nJGnoOm0gsPrrb0P5rvD-XcfPRkV/exec';
    
    let mode = 'EL';
    
    // 1. INDIAN RUPEE FORMATTER
    const formatINR = (amount) => '₹' + parseFloat(amount).toLocaleString('en-IN');
    
    // 2. EMI FORMULA
    function emiCalc(P, rate, years) {
        const r = rate / 12 / 100;
        const n = years * 12;
        return (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    }
    
    // 3. MAIN CALCULATOR FUNCTION
    function calculate() {
        const P = Number(amountSlider.value);
        const years = Number(tenure.value);
        
        displayAmount.textContent = formatINR(P);
        
        if (mode === 'EL') {
            const emi = emiCalc(P, Number(roiInput.value), years);
            displayEMI.textContent = formatINR(Math.round(emi));
        } else {
            const oldEmi = emiCalc(P, Number(oldRoi.value), years);
            const newEmi = emiCalc(P, Number(newRoi.value), years);
            displayEMI.textContent = formatINR(Math.round(newEmi));
            savingsAmount.textContent = formatINR(Math.round(oldEmi - newEmi));
        }
    }
    
    // 4. EDUCATION LOAN MODE
    function switchToEL() {
        mode = 'EL';
        elRoiBlock.classList.remove('hidden');
        btRoiBlock.classList.add('hidden');
        savingsBox.classList.add('hidden');
        elBtn.classList.add('bg-black', 'text-white');
        btBtn.classList.remove('bg-black', 'text-white');
        calculate();
    }
    
    // 5. BALANCE TRANSFER MODE
    function switchToBT() {
        mode = 'BT';
        elRoiBlock.classList.add('hidden');
        btRoiBlock.classList.remove('hidden');
        savingsBox.classList.remove('hidden');
        btBtn.classList.add('bg-black', 'text-white');
        elBtn.classList.remove('bg-black', 'text-white');
        calculate();
    }
    
    // 6. ELIGIBILITY MODAL
    function showEligibilityModal() {
        formError.style.display = 'none';
        if (mode === 'BT') {
            btFields.classList.remove('hidden');
            document.getElementById('modalLoanAmount').value = amountSlider.value;
            document.getElementById('modalCurrentROI').value = oldRoi.value;
        } else {
            btFields.classList.add('hidden');
        }
        eligibilityModal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }
    
    function hideEligibilityModal(e) {
        if (e) e.stopPropagation();
        eligibilityModal.classList.remove('show');
        document.body.style.overflow = 'auto';
    }
    
    // 7. BALANCE TRANSFER FORM
    function openBalanceTransferForm() {
        switchToBT();
        setTimeout(() => showEligibilityModal(), 150);
    }
    
    // 8. REFERRAL MODAL
    function showReferralModal() {
        referralModal.style.display = 'flex';
        referralModal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }
    
    function hideReferralModal(e) {
        if (e) e.stopPropagation();
        referralModal.classList.remove('show');
        referralModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
    
    // 9. COMMUNITY MODAL
    function openCommunityModal() {
        communityModal.style.display = 'flex';
        communityModal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }
    
    function closeCommunityModal(e) {
        if (e) e.stopPropagation();
        communityModal.classList.remove('show');
        communityModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
    
    // 10. SUCCESS POPUP
    function showSuccessPopup() {
        successPopup.style.display = 'flex';
        successPopup.classList.add('show');
    }
    
    function hideSuccessPopup() {
        successPopup.classList.remove('show');
        successPopup.style.display = 'none';
    }
    
    // 11. FORM VALIDATION
    function validateForm() {
        const fields = ['modalUserName','modalUserEmail','modalUserPhone','modalUserCountry','modalUserIntake'];
        for (let id of fields) {
            if (!document.getElementById(id).value.trim()) {
                formError.textContent = 'All fields are required';
                formError.style.display = 'block';
                return false;
            }
        }
        if (mode === 'BT') {
            const btFieldsReq = ['modalCurrentBank','modalLoanAmount','modalCurrentROI'];
            for (let id of btFieldsReq) {
                if (!document.getElementById(id).value.trim()) {
                    formError.textContent = 'All Balance Transfer fields required';
                    formError.style.display = 'block';
                    return false;
                }
            }
        }
        return true;
    }
    
    // 12. DARK MODE TOGGLE
    function toggleTheme() {
        document.documentElement.classList.toggle('dark');
        localStorage.theme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
    }
    
    // 13. ELIGIBILITY FORM SUBMIT
    eligibilityForm.onsubmit = async function(e) {
        e.preventDefault();
        if (!validateForm()) return;
        
        // Copy values to hidden Google Sheets fields
        document.getElementById('sheetLoanAmount').value = amountSlider.value;
        document.getElementById('sheetROI').value = mode === 'EL' ? roiInput.value + '%' : newRoi.value + '%';
        document.getElementById('sheetMode').value = mode;
        
        const formData = new FormData(eligibilityForm);
        formData.append('mode', mode);
        formData.append('emi', displayEMI.textContent);
        
        modalSubmitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Submitting...';
        modalSubmitBtn.disabled = true;
        
        try {
            await fetch(WEBHOOK_URL, { method: 'POST', body: formData });
            eligibilityForm.reset();
            hideEligibilityModal();
            showSuccessPopup();
        } catch {
            alert('Submission failed. Try again.');
        }
        modalSubmitBtn.innerHTML = 'Get My Options';
        modalSubmitBtn.disabled = false;
    };
    
    // 14. REFERRAL FORM SUBMIT
    referralForm.onsubmit = async function(e) {
        e.preventDefault();
        referralSubmitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Submitting...';
        referralSubmitBtn.disabled = true;
        
        try {
            const data = new FormData(referralForm);
            await fetch(WEBHOOK_URL, { method: 'POST', body: data });
            referralForm.reset();
            hideReferralModal();
            showSuccessPopup();
        } catch {
            alert('Submission failed. Try again.');
        }
        referralSubmitBtn.innerHTML = 'Submit Referral';
        referralSubmitBtn.disabled = false;
    };
    
    // 15. ALL BUTTON EVENT LISTENERS
    elBtn.onclick = switchToEL;
    btBtn.onclick = switchToBT;
    document.getElementById('checkEligibilityBtn').onclick = showEligibilityModal;
    
    // Fix ALL onclick attributes from HTML
    document.querySelectorAll('[onclick]').forEach(btn => {
        const onclickAttr = btn.getAttribute('onclick');
        if (onclickAttr === 'showEligibilityModal()') btn.onclick = showEligibilityModal;
        if (onclickAttr === 'openBalanceTransferForm()') btn.onclick = openBalanceTransferForm;
        if (onclickAttr === 'showReferralModal()') btn.onclick = showReferralModal;
        if (onclickAttr === 'openCommunityModal()') btn.onclick = openCommunityModal;
        if (onclickAttr === 'toggleTheme()') btn.onclick = toggleTheme;
        if (onclickAttr === 'hideSuccessPopup()') btn.onclick = hideSuccessPopup;
        if (onclickAttr === 'closeCommunityModal()') btn.onclick = closeCommunityModal;
        if (onclickAttr === 'hideEligibilityModal()') btn.onclick = hideEligibilityModal;
        if (onclickAttr === 'hideReferralModal()') btn.onclick = hideReferralModal;
    });
    
    // 16. INPUT EVENT LISTENERS
    amountSlider.oninput = calculate;
    tenure.onchange = calculate;
    roiInput.oninput = calculate;
    oldRoi.oninput = calculate;
    newRoi.oninput = calculate;
    
    // 17. INITIALIZE
    switchToEL();
});


