/* =========================
   INTRO : FAST CINEMATIC LOADING
========================= */
let load = 0;
const percent = document.getElementById("loadingPercent");
const bar = document.querySelector(".loading-bar");

const introInterval = setInterval(() => {
  load += Math.floor(Math.random() * 8) + 5;
  if (load >= 100) {
    load = 100;
    clearInterval(introInterval);

    setTimeout(() => {
      const intro = document.getElementById("intro");
      if (intro) {
        intro.style.opacity = "0";
        setTimeout(() => (intro.style.display = "none"), 900);
      }
    }, 400);
  }

  if (percent) percent.textContent = load + "%";
  if (bar) bar.style.width = load + "%";
}, 90);

/* =========================
   GLOBAL STATE
========================= */
let fcfsList = [];
let gdtList = [];

/* =========================
   CSV LOADER (AUTO-DEDUPE)
========================= */
async function loadCSV(path) {
  try {
    const res = await fetch(path);
    if (!res.ok) return [];
    const text = await res.text();

    return text
      .split("\n")
      .map(w => w.trim().toLowerCase())
      .filter(w => w.startsWith("0x") && w.length === 42);
  } catch {
    return [];
  }
}

async function initWhitelist() {
  fcfsList = await loadCSV("data/fcfs.csv");
  gdtList  = await loadCSV("data/gdt.csv");

  // 🔔 ADMIN WARNING: same wallet in both lists
  const overlap = fcfsList.filter(w => gdtList.includes(w));
  if (overlap.length) {
    console.warn(
      "⚠️ Wallet(s) exist in BOTH GDT & FCFS lists:",
      overlap
    );
  }
}

initWhitelist();

/* =========================
   WALLET CHECKER (FINAL LOGIC)
========================= */
function checkWallet() {
  const input = document.getElementById("walletInput");
  const res   = document.getElementById("walletResult");

  if (!input || !res) return;

  const wallet = input.value.trim().toLowerCase();

  res.className = "wallet-result loading";
  res.textContent = "Checking whitelist…";

  setTimeout(() => {
    res.className = "wallet-result";

    // ❌ invalid address
    if (!wallet.startsWith("0x") || wallet.length !== 42) {
      res.classList.add("fail-glow");
      res.textContent = "❌ Invalid wallet address";
      return;
    }

    // ⭐ PRIORITY 1: GDT
    if (gdtList.includes(wallet)) {
      res.classList.add("success-glow");
      res.textContent = "⭐ Guaranteed (GDT) — Priority access granted";
      return;
    }

    // ✅ PRIORITY 2: FCFS
    if (fcfsList.includes(wallet)) {
      res.classList.add("success-glow");
      res.textContent = "✅ FCFS Whitelisted — First come, first serve";
      return;
    }

    // ❌ Not whitelisted
    res.classList.add("fail-glow");
    res.textContent = "❌ Wallet is not whitelisted";
  }, 900);
}

/* =========================
   TOGGLES (EXPLORE / WALLET)
========================= */
function toggleExplore() {
  const box = document.getElementById("exploreBox");
  if (box) box.classList.toggle("show");
}

function toggleWallet() {
  const box = document.getElementById("walletBox");
  if (box) box.classList.toggle("show");
}

/* =========================
   COMING SOON MODAL
========================= */
function showComingSoon() {
  const modal = document.getElementById("comingSoon");
  if (modal) modal.classList.add("show");
}

function closeComingSoon() {
  const modal = document.getElementById("comingSoon");
  if (modal) modal.classList.remove("show");
}

/* =========================
   NFT CLICK → TRAIT MODAL
========================= */
function showTrait() {
  showComingSoon();
}

/* =========================
   SOCIAL LINKS
========================= */
function openTwitter() {
  window.open("https://x.com/Phanto0ms", "_blank");
}

/* =========================
   SCROLL-BASED GLOW FX
========================= */
window.addEventListener("scroll", () => {
  const glow = document.documentElement;
  const y = window.scrollY;
  glow.style.setProperty("--scrollGlow", Math.min(y / 600, 1));
});
