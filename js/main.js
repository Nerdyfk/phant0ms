/* ======================================================
   INTRO : GLITCH + FAST CINEMATIC LOADING (FINAL)
====================================================== */
let load = 0;
const percent = document.getElementById("loadingPercent");
const bar = document.querySelector(".loading-bar");

const introInterval = setInterval(() => {
  load += Math.floor(Math.random() * 8) + 6; // fast cinematic
  if (load >= 100) {
    load = 100;
    clearInterval(introInterval);

    setTimeout(() => {
      const intro = document.getElementById("intro");
      if (intro) {
        intro.style.opacity = "0";
        intro.style.pointerEvents = "none";

        setTimeout(() => {
          intro.style.display = "none"; // 🔥 critical fix
        }, 900);
      }
    }, 400);
  }

  if (percent) percent.textContent = load + "%";
  if (bar) bar.style.width = load + "%";
}, 110);


/* ======================================================
   HERO : ALWAYS-LIVE GRADIENT SHIMMER
====================================================== */
const hero = document.querySelector(".hero-title");
if (hero) {
  let hue = 0;
  setInterval(() => {
    hue = (hue + 1) % 360;
    hero.style.backgroundImage =
      `linear-gradient(90deg,
        hsl(${hue},90%,70%),
        hsl(${(hue + 60) % 360},90%,70%),
        hsl(${(hue + 120) % 360},90%,70%)
      )`;
  }, 60);
}


/* ======================================================
   SCROLL-BASED GLOW (SECTIONS)
====================================================== */
const glowSections = document.querySelectorAll(".about, .explore, .wallet");

const glowObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("glow-active");
      }
    });
  },
  { threshold: 0.25 }
);

glowSections.forEach(sec => glowObserver.observe(sec));


/* ======================================================
   EXPLORE COLLECTION : 3-ROW HORIZONTAL LOOP
====================================================== */
const rows = document.querySelectorAll(".explore-row");

rows.forEach((row, index) => {
  let pos = index % 2 === 0 ? 0 : -row.scrollWidth / 2;
  const speed = index % 2 === 0 ? 0.25 : -0.25;

  function move() {
    pos += speed;
    if (Math.abs(pos) > row.scrollWidth / 2) pos = 0;
    row.style.transform = `translateX(${pos}px)`;
    requestAnimationFrame(move);
  }
  move();
});

// NFT click → trait modal (placeholder)
document.querySelectorAll(".nft-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    showTrait();
  });
});

function showTrait() {
  const modal = document.getElementById("traitModal");
  const content = document.getElementById("traitContent");
  if (content) content.textContent = "Traits: Coming Soon";
  if (modal) modal.style.display = "flex";
}

function closeTrait() {
  const modal = document.getElementById("traitModal");
  if (modal) modal.style.display = "none";
}


/* ======================================================
   TOGGLES : EXPLORE & WALLET (HIDDEN BY DEFAULT)
====================================================== */
function toggleExplore() {
  const box = document.getElementById("exploreBox");
  if (box) box.classList.toggle("show");
}

function toggleWallet() {
  const box = document.getElementById("walletBox");
  if (box) box.classList.toggle("show");
}


/* ======================================================
   WALLET CHECKER (CSV READY, PREMIUM TEXT)
====================================================== */
async function checkWallet() {
  const input = document.getElementById("walletInput");
  const result = document.getElementById("walletResult");
  if (!input || !result) return;

  const addr = input.value.trim().toLowerCase();
  if (!addr) {
    result.textContent = "Please enter a wallet address.";
    return;
  }

  try {
    const [fcfs, gtd] = await Promise.all([
      fetch("data/fcfs.csv").then(r => r.text()),
      fetch("data/gtd.csv").then(r => r.text())
    ]);

    if (fcfs.toLowerCase().includes(addr)) {
      result.textContent = "✅ This wallet is whitelisted for FCFS slots.";
    } else if (gtd.toLowerCase().includes(addr)) {
      result.textContent = "✨ This wallet is whitelisted for GDT slots.";
    } else {
      result.textContent = "❌ This wallet is not whitelisted.";
    }
  } catch {
    result.textContent = "Whitelist data unavailable. Please try later.";
  }
}


/* ======================================================
   SOCIAL LINKS
====================================================== */
function openTwitter() {
  window.open("https://x.com/Phanto0ms", "_blank");
}


/* ======================================================
   MOBILE PERFORMANCE SAFETY
====================================================== */
if (window.innerWidth < 640) {
  document.documentElement.style.setProperty("--line-speed", "48s");
  document.documentElement.style.setProperty("--glow", "0.22");
}
