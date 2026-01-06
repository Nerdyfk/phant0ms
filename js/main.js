/* =========================
   INTRO : GLITCH + LOADING
========================= */
let load = 0;
const percent = document.getElementById("loadingPercent");
const bar = document.querySelector(".loading-bar");

const introInterval = setInterval(() => {
  load += Math.floor(Math.random() * 6) + 3;
  if (load >= 100) {
    load = 100;
    clearInterval(introInterval);

    setTimeout(() => {
      const intro = document.getElementById("intro");
      intro.style.opacity = "0";
      intro.style.pointerEvents = "none";
      setTimeout(() => {
        intro.style.display = "none";
      }, 1200);
    }, 600);
  }

  if (percent) percent.textContent = load + "%";
  if (bar) bar.style.width = load + "%";
}, 120);

/* =========================
   GRADIENT CONTROL
========================= */
const gradCtl = document.getElementById("gradCtl");
if (gradCtl) {
  gradCtl.addEventListener("input", (e) => {
    document.documentElement.style.setProperty("--g", e.target.value);
  });
}

/* =========================
   ABOUT : LETTER ANIMATION
========================= */
const about = document.getElementById("aboutText");
if (about) {
  const chars = about.innerText.split("");
  about.innerHTML = chars
    .map(
      (c, i) =>
        `<span style="animation-delay:${i * 0.02}s">${
          c === " " ? "&nbsp;" : c
        }</span>`
    )
    .join("");
}

/* =========================
   SVG SNAKE PATH (REAL)
========================= */
let traitsData = {};
fetch("data/traits.json")
  .then((r) => r.json())
  .then((j) => (traitsData = j))
  .catch(() => (traitsData = {}));

const path = document.getElementById("snakePath");
const container = document.getElementById("snakeContainer");

let paused = false;

if (path && container) {
  const pathLength = path.getTotalLength();

  const nftFiles = Array.from({ length: 23 }, (_, i) => `assets/nft${i + 1}.png`);

  nftFiles.forEach((src, index) => {
    const img = document.createElement("img");
    img.src = src;
    img.className = "snakeNFT";
    container.appendChild(img);

    let offset = index * 70;

    img.addEventListener("click", () => {
      paused = true;
      showTrait(src);
    });

    function animate() {
      if (!paused) {
        offset = (offset + 0.35) % pathLength; // slow speed
        const point = path.getPointAtLength(offset);
        img.style.left = point.x - 36 + "px";
        img.style.top = point.y - 36 + "px";
      }
      requestAnimationFrame(animate);
    }
    animate();
  });
}

/* =========================
   TRAIT MODAL
========================= */
function showTrait(src) {
  const title = document.getElementById("traitTitle");
  const content = document.getElementById("traitContent");
  const modal = document.getElementById("traitModal");

  if (title) title.textContent = src.split("/").pop();
  if (content) {
    content.textContent = traitsData[src]
      ? JSON.stringify(traitsData[src], null, 2)
      : "Traits: Coming Soon";
  }
  if (modal) modal.style.display = "flex";
}

function closeTrait() {
  paused = false;
  const modal = document.getElementById("traitModal");
  if (modal) modal.style.display = "none";
}

/* =========================
   EXPLORE / WALLET / PANELS
========================= */
function toggleExplore() {
  const box = document.getElementById("exploreBox");
  if (!box) return;
  box.classList.toggle("show");
  if (box.classList.contains("show")) initGyro();
}

function toggleWallet() {
  const w = document.getElementById("walletBox");
  if (w) w.classList.toggle("show");
}

function checkWallet() {
  const res = document.getElementById("walletResult");
  if (res) res.textContent = "Status: Coming Soon";
}

function togglePanel(id) {
  const p = document.getElementById(id);
  if (p) p.classList.toggle("show");
}

function openTwitter() {
  window.open("https://x.com/Phanto0ms", "_blank");
}

/* =========================
   MOBILE GYRO (EXPLORE ONLY)
========================= */
function initGyro() {
  if (
    typeof DeviceOrientationEvent !== "undefined" &&
    typeof DeviceOrientationEvent.requestPermission === "function"
  ) {
    DeviceOrientationEvent.requestPermission().then((res) => {
      if (res === "granted") startGyro();
    });
  } else {
    startGyro();
  }
}

function startGyro() {
  window.addEventListener(
    "deviceorientation",
    (e) => {
      const x = e.gamma || 0;
      const y = e.beta || 0;
      document.querySelectorAll(".snakeNFT").forEach((el) => {
        el.style.transform = `translate(${x * 0.2}px, ${y * 0.15}px)`;
      });
    },
    { passive: true }
  );
}
