// script.js
document.addEventListener('DOMContentLoaded', () => {
  const container = document.querySelector('.falling‑books');
  const colours = ['#A8BFA2','#c1a78f','#7bb77b'];
  const maxLeaves = 30;

  function random(min, max) {
    return Math.random() * (max - min) + min;
  }

  function createLeaf() {
    const leaf = document.createElement('div');
    leaf.classList.add('book‑leaf');
    // taille aléatoire
    const size = random(20, 50);
    leaf.style.width = `${size}px`;
    leaf.style.height = `${size}px`;

    // position initiale
    leaf.style.left = `${random(0, window.innerWidth)}px`;
    leaf.style.top = `-50px`;

    // couleur aléatoire (optionnel)
    // leaf.style.filter = `hue‑rotate(${random(0,360)}deg)`;

    container.appendChild(leaf);

    const duration = random(8, 15); // durée de chute
    const horizontalMovement = random(-100, 100);
    const endLeft = parseFloat(leaf.style.left) + horizontalMovement;

    leaf.animate([
      { transform: `translate(0, 0) rotate(0deg)`, opacity: 1 },
      { transform: `translate(${horizontalMovement}px, ${window.innerHeight + 50}px) rotate(${random(360,720)}deg)`, opacity: 0.3 }
    ], {
      duration: duration * 1000,
      easing: 'linear',
      iterations: 1
    }).onfinish = () => {
      leaf.remove();
    };
  }

  setInterval(() => {
    if (container.children.length < maxLeaves) {
      createLeaf();
    }
  }, 500);
});
