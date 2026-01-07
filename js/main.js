// ===== Loading Animation =====
window.addEventListener("load", () => {
  let percent = 0;
  const bar = document.querySelector(".loading-bar");
  const text = document.getElementById("loadingPercent");

  const interval = setInterval(() => {
    percent += 2;
    bar.style.width = percent + "%";
    text.textContent = percent + "%";
    if (percent >= 100) {
      clearInterval(interval);
      document.getElementById("intro").classList.add("hide");
    }
  }, 30);
});

// ===== Explore Collection =====
function openExplore() {
  const box = document.getElementById("exploreBox");
  box.classList.add("show");
  const gallery = document.getElementById("exploreGallery");

  if (!gallery.innerHTML.trim()) {
    for (let i = 1; i <= 24; i++) {
      const row = document.createElement("div");
      row.className = "row";
      for (let j = 1; j <= 12; j++) {
        const img = document.createElement("img");
        img.src = `assets/nft${((i + j) % 12) + 1}.png`;
        row.appendChild(img);
      }
      gallery.appendChild(row);
    }
  }
}

// ===== Scroll to Wallet Checker =====
function scrollToChecker() {
  document.getElementById("walletChecker").scrollIntoView({ behavior: "smooth" });
}

// ===== Wallet Checker =====
async function checkWallet() {
  const input = document.getElementById("walletInput");
  const status = document.getElementById("walletStatus");
  const btn = document.getElementById("checkBtn");
  const wallet = input.value.trim();

  if (!wallet) {
    status.textContent = "⚠️ Please enter a wallet address.";
    status.className = "error";
    return;
  }

  btn.textContent = "Checking...";
  status.textContent = "";
  status.className = "";
  await new Promise(r => setTimeout(r, 1500));

  // Random mock result
  const granted = Math.random() > 0.5;
  if (granted) {
    status.textContent = "✅ Wallet whitelisted — Access granted!";
    status.className = "success-glow";
  } else {
    status.textContent = "❌ Wallet not found.";
    status.className = "error";
  }

  btn.textContent = "Check Status";
}

// ===== Coming Soon Modal =====
function comingSoon() {
  document.getElementById("modal").classList.add("show");
}
function closeModal() {
  document.getElementById("modal").classList.remove("show");
}

// ===== Background Animation =====
const c = document.getElementById("bg");
const ctx = c.getContext("2d");
let w, h, lines = [];
function resize() {
  w = c.width = window.innerWidth;
  h = c.height = window.innerHeight;
}
window.addEventListener("resize", resize);
resize();

function drawLine(x, y, len, spd) {
  return { x, y, len, spd };
}
for (let i = 0; i < 40; i++) {
  lines.push(drawLine(Math.random() * w, Math.random() * h, 80 + Math.random() * 120, 0.5 + Math.random()));
}

function animateBG() {
  ctx.clearRect(0, 0, w, h);
  ctx.strokeStyle = "rgba(255,255,255,0.05)";
  ctx.lineWidth = 1;
  lines.forEach(l => {
    ctx.beginPath();
    ctx.moveTo(l.x, l.y);
    ctx.lineTo(l.x + l.len, l.y);
    ctx.stroke();
    l.x += l.spd;
    if (l.x > w) l.x = -l.len;
  });
  requestAnimationFrame(animateBG);
}
animateBG();
