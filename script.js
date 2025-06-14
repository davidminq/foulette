// Constants
const STORAGE_VERSION = 3;
const DEFAULT_MENUS = ["🥩", "🥪", "🥦", "🍕", "🥗", "🍗", "🍜", "🥕"];
const COLORS = [
  '#6e7b8b', '#6a1b9a', '#e53935', '#fb8c00',
  '#ffa000', '#fdd835', '#aed581', '#4db6ac'
];

// DOM Elements
const canvas = document.getElementById("wheel");
const ctx = canvas.getContext("2d");
const center = canvas.width / 2;
const input = document.getElementById("menu-input");
// const addBtn = document.getElementById("add-button");
const spinBtn = document.getElementById("spin");
const resetBtn = document.getElementById("reset");
const popup = document.getElementById("popup");
const popupText = document.getElementById("popup-text");

// State
let menus;
let rotation = 0;
let isSpinning = false;

// Initialize
function initializeMenus() {
  const savedVersion = Number(localStorage.getItem("menusVersion"));
  if (savedVersion !== STORAGE_VERSION) {
    menus = DEFAULT_MENUS.slice();
    saveMenus();
  } else {
    menus = JSON.parse(localStorage.getItem("menus")) || DEFAULT_MENUS.slice();
  }
}

function saveMenus() {
  localStorage.setItem("menus", JSON.stringify(menus));
  localStorage.setItem("menusVersion", String(STORAGE_VERSION));
}

function drawWheel() {
  const total = menus.length;
  const slice = 2 * Math.PI / total;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  menus.forEach((menu, i) => {
    const start = i * slice;
    const end = start + slice;
    const color = COLORS[i] || `hsl(${i * (360 / total)}, 80%, 60%)`;

    // Draw slice
    ctx.beginPath();
    ctx.moveTo(center, center);
    ctx.arc(center, center, center, start, end);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.closePath();

    // Draw text
    const textAngle = start + slice / 2;
    const textRadius = center * 0.65;
    const x = center + Math.cos(textAngle) * textRadius;
    const y = center + Math.sin(textAngle) * textRadius;

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(textAngle + Math.PI / 2);
    ctx.fillStyle = "#fff";
    ctx.font = "16px 'Poppins', sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(menu, 0, 0);
    ctx.restore();
  });
}

function showConfetti() {
  if (navigator.vibrate) {
    navigator.vibrate([100, 50, 100]);
  }
  for (let i = 0; i < 3; i++) {
    confetti({
      particleCount: 120,
      startVelocity: 40,
      spread: 360,
      ticks: 80,
      origin: { x: Math.random(), y: Math.random() * 0.3 + 0.3 }
    });
  }

  setTimeout(() => {
    confetti({
      particleCount: 200,
      startVelocity: 20,
      spread: 120,
      decay: 0.9,
      scalar: 1.2,
      origin: { x: 0.5, y: 0.6 }
    });
  }, 200);
}

function showPopup(text) {
  popupText.textContent = text;
  gsap.fromTo(popup,
    { autoAlpha: 0, scale: 0.5 },
    { autoAlpha: 1, scale: 1, duration: 0.6, ease: "back.out(1.7)" }
  );

  setTimeout(() => {
    gsap.to(popup, { autoAlpha: 0, scale: 0.5, duration: 0.4 });
  }, 3000);
}

function spinWheel() {
  if (isSpinning || menus.length === 0) return;

  isSpinning = true;
  const randomIndex = Math.floor(Math.random() * menus.length);
  const extraRotations = 5;
  const sliceDeg = 360 / menus.length;
  // Change 270 for 12 o'clock alignment -> 360 for 12 o'clock pointer alignment
  const stopAngle = 360 - (randomIndex * sliceDeg) - sliceDeg / 2;
  const rotateAmount = extraRotations * 360 + stopAngle;

  gsap.to(canvas, {
    rotation: `+=${rotateAmount}`,
    duration: 5,
    ease: "power4.out",
    onUpdate: () => {
      rotation = gsap.getProperty(canvas, "rotation");
      canvas.style.transform = `rotate(${rotation}deg)`;
    },
    onComplete: () => {
      const finalRotation = gsap.getProperty(canvas, "rotation") % 360;
      // Add 270deg offset for 12 o'clock pointer alignment (triangle pointer at top)
      const normalizedRotation = (360 - finalRotation + 270) % 360;
      const index = Math.floor(normalizedRotation / (360 / menus.length));

      showConfetti();
      showPopup(menus[index]);
      isSpinning = false;
    }
  });
}

function handleWheelClick(e) {
  if (isSpinning) return;

  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  const dx = x - center;
  const dy = y - center;
  let clickAngle = Math.atan2(dy, dx) * 180 / Math.PI;
  clickAngle = (clickAngle + 360) % 360;

  const normalizedRotation = rotation % 360;
  const adjusted = (clickAngle - normalizedRotation + 360) % 360;
  const sliceDeg = 360 / menus.length;
  const idx = Math.floor(adjusted / sliceDeg);

  if (idx >= 0 && idx < menus.length) {
    menus.splice(idx, 1);
    drawWheel();
    saveMenus();
  }
}

// Event Listeners
// Removed addBtn event listener

input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    const value = input.value.trim();
    if (!value) return;
    menus.push(value);
    input.value = "";
    drawWheel();
    saveMenus();
  }
});

spinBtn.addEventListener("click", (e) => {
  e.preventDefault();
  spinWheel();
});

resetBtn.addEventListener("click", (e) => {
  e.preventDefault();
  menus = DEFAULT_MENUS.slice();
  saveMenus();
  drawWheel();
});

document.getElementById("clear-all").addEventListener("click", (e) => {
  e.preventDefault();
  menus = [];
  saveMenus();
  drawWheel();
});

canvas.addEventListener("click", handleWheelClick);
// Enable touch to remove slice on mobile
canvas.addEventListener("touchend", function(e) {
  e.preventDefault();
  const touch = e.changedTouches[0];
  // Create a synthetic event object for handleWheelClick
  handleWheelClick({ clientX: touch.clientX, clientY: touch.clientY });
}, { passive: false });

// Service Worker registration
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js')
      .then(reg => console.log('ServiceWorker registered:', reg))
      .catch(err => console.log('ServiceWorker registration failed:', err));
  });
}

// Initialize
initializeMenus();
drawWheel();