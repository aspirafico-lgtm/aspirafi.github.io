// Reveal elements on scroll
const animatedElements = document.querySelectorAll('[data-animate]');

const revealOnScroll = () => {
  const triggerBottom = window.innerHeight * 0.85;

  animatedElements.forEach(el => {
    const boxTop = el.getBoundingClientRect().top;
    if (boxTop < triggerBottom) {
      el.classList.add('active');
    }
  });
};

window.addEventListener('scroll', revealOnScroll);
window.addEventListener('load', revealOnScroll);

// Parallax effect for hero section
window.addEventListener('scroll', () => {
  const hero = document.querySelector('.hero-content');
  const scrollY = window.scrollY;
  hero.style.transform = `translateY(${scrollY * 0.3}px)`;
});
