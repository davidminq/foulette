// Initialize variables
let wheel;
let pointer;
let wrapper;
let menuInput;
let clearAllButton;
let spinButton;
let resetButton;
let popup;
let menuItems = [];
let isSpinning = false;
let currentRotation = 0;
let spinTimeout;
let confettiTimeout;

// Initialize the wheel
function initWheel() {
  wheel = document.getElementById('wheel');
  pointer = document.getElementById('pointer');
  wrapper = document.getElementById('wrapper');
  menuInput = document.getElementById('menu-input');
  clearAllButton = document.getElementById('clear-all');
  spinButton = document.getElementById('spin');
  resetButton = document.getElementById('reset');
  popup = document.getElementById('popup');

  // Load saved items from localStorage
  const savedItems = localStorage.getItem('menuItems');
  if (savedItems) {
    menuItems = JSON.parse(savedItems);
    updateWheel();
  }

  // Add event listeners
  menuInput.addEventListener('keypress', handleMenuInput);
  clearAllButton.addEventListener('click', clearAllItems);
  spinButton.addEventListener('click', spinWheel);
  resetButton.addEventListener('click', resetWheel);
}

// Handle menu input
function handleMenuInput(e) {
  if (e.key === 'Enter' && menuInput.value.trim()) {
    menuItems.push(menuInput.value.trim());
    menuInput.value = '';
    updateWheel();
    saveItems();
  }
}

// Update wheel with current items
function updateWheel() {
  if (menuItems.length === 0) {
    wheel.innerHTML = '<text x="50%" y="50%" text-anchor="middle" dominant-baseline="middle" fill="#000">Add items</text>';
    return;
  }

  const segments = menuItems.length;
  const anglePerSegment = 360 / segments;
  let wheelHTML = '';

  menuItems.forEach((item, index) => {
    const startAngle = index * anglePerSegment;
    const endAngle = (index + 1) * anglePerSegment;
    const path = createWheelSegment(startAngle, endAngle);
    const text = createWheelText(item, startAngle, endAngle);
    wheelHTML += path + text;
  });

  wheel.innerHTML = wheelHTML;
}

// Create wheel segment path
function createWheelSegment(startAngle, endAngle) {
  const radius = 50;
  const startRad = (startAngle - 90) * Math.PI / 180;
  const endRad = (endAngle - 90) * Math.PI / 180;
  
  const x1 = 50 + radius * Math.cos(startRad);
  const y1 = 50 + radius * Math.sin(startRad);
  const x2 = 50 + radius * Math.cos(endRad);
  const y2 = 50 + radius * Math.sin(endRad);
  
  return `<path d="M 50 50 L ${x1} ${y1} A ${radius} ${radius} 0 0 1 ${x2} ${y2} Z" fill="hsl(${startAngle}, 70%, 50%)" />`;
}

// Create wheel text
function createWheelText(text, startAngle, endAngle) {
  const radius = 35;
  const angle = (startAngle + endAngle) / 2;
  const rad = (angle - 90) * Math.PI / 180;
  const x = 50 + radius * Math.cos(rad);
  const y = 50 + radius * Math.sin(rad);
  
  return `<text x="${x}" y="${y}" text-anchor="middle" dominant-baseline="middle" fill="#fff" transform="rotate(${angle}, ${x}, ${y})">${text}</text>`;
}

// Spin the wheel
function spinWheel() {
  if (isSpinning || menuItems.length === 0) return;
  
  isSpinning = true;
  const spinAngle = 1800 + Math.random() * 360;
  currentRotation += spinAngle;
  
  gsap.to(wheel, {
    rotation: currentRotation,
    duration: 5,
    ease: "power2.out",
    onComplete: () => {
      isSpinning = false;
      showResult();
    }
  });
}

// Show result
function showResult() {
  const finalAngle = currentRotation % 360;
  const segmentAngle = 360 / menuItems.length;
  const selectedIndex = Math.floor(((360 - finalAngle) % 360) / segmentAngle);
  const selectedItem = menuItems[selectedIndex];
  
  popup.textContent = selectedItem;
  gsap.to(popup, {
    scale: 1,
    opacity: 1,
    duration: 0.3,
    onComplete: () => {
      confetti();
      setTimeout(() => {
        gsap.to(popup, {
          scale: 0.5,
          opacity: 0,
          duration: 0.3
        });
      }, 2000);
    }
  });
}

// Reset wheel
function resetWheel() {
  if (isSpinning) return;
  
  gsap.to(wheel, {
    rotation: 0,
    duration: 0.5,
    ease: "power2.out"
  });
  currentRotation = 0;
}

// Clear all items
function clearAllItems() {
  menuItems = [];
  updateWheel();
  saveItems();
}

// Save items to localStorage
function saveItems() {
  localStorage.setItem('menuItems', JSON.stringify(menuItems));
}

// Initialize confetti
function confetti() {
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 }
  });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initWheel); 