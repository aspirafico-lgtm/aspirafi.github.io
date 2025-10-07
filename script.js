const webAppUrl = "https://script.google.com/macros/s/AKfycbzVN3eqeH5foEpSjVT3efQ05k_ysOLjkYQhOZkmZ-WsFYtt8JuTKvvY9ldnd5PXWcpE/exec";

// Open/Close Modals
document.getElementById("openLoanBtn").onclick = () => document.getElementById("loanFormModal").style.display = "flex";
document.getElementById("closeLoanBtn").onclick = () => document.getElementById("loanFormModal").style.display = "none";

document.getElementById("openReferralBtn").onclick = () => document.getElementById("referralFormModal").style.display = "flex";
document.getElementById("closeReferralBtn").onclick = () => document.getElementById("referralFormModal").style.display = "none";

// Submit Loan Form
document.getElementById("loanForm").addEventListener("submit", function(e){
  e.preventDefault();
  const data = new FormData(this);
  data.append("formType","loan");
  fetch(webAppUrl,{method:"POST",body:data})
    .then(res=>res.json())
    .then(()=>{alert("Loan form submitted!"); this.reset(); document.getElementById("loanFormModal").style.display="none";});
});

// Submit Referral Form
document.getElementById("referralForm").addEventListener("submit", function(e){
  e.preventDefault();
  const data = new FormData(this);
  data.append("formType","referral");
  fetch(webAppUrl,{method:"POST",body:data})
    .then(res=>res.json())
    .then(()=>{alert("Referral form submitted!"); this.reset(); document.getElementById("referralFormModal").style.display="none";});
});
