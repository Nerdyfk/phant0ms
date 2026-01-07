/* =====================================================
   INTRO : FAST CINEMATIC FAKE LOADING
===================================================== */
(function () {
  const intro = document.getElementById("intro");
  const percent = document.getElementById("loadingPercent");
  const bar = document.querySelector(".loading-bar");

  if (!intro || !percent || !bar) return;

  let p = 0;
  const timer = setInterval(() => {
    p += Math.random() * 18 + 8; // fast
    if (p >= 100) {
      p = 100;
      clearInterval(timer);

      setTimeout(() => {
        intro.style.opacity = "0";
        setTimeout(() => {
          intro.style.display = "none";
        }, 450);
      }, 200);
    }
    percent.textContent = Math.floor(p) + "%";
    bar.style.width = p + "%";
  }, 60);
})();

/* =====================================================
   ABOUT : LETTER BY LETTER (READABLE)
===================================================== */
(function () {
  const about = document.getElementById("aboutText");
  if (!about) return;

  const text = about.innerText;
  const chars = text.split("");
  about.innerHTML = chars
    .map((c, i) =>
      c === " "
        ? "&nbsp;"
        : `<span style="animation-delay:${i * 0.015}s">${c}</span>`
    )
    .join("");
})();

/* =====================================================
   EXPLORE : NFT BUTTON → TRAIT MODAL
===================================================== */
(function () {
  const buttons = document.querySelectorAll(".nft-btn");
  const modal = document.getElementById("traitModal");
  const title = document.getElementById("traitTitle");
  const content = document.getElementById("traitContent");

  if (!buttons.length || !modal) return;

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      if (title) title.textContent = "NFT Traits";
      if (content) content.textContent = "Traits: Coming Soon";
      modal.style.display = "flex";
    });
  });
})();

function closeTrait() {
  const modal = document.getElementById("traitModal");
  if (modal) modal.style.display = "none";
}

/* =====================================================
   WHITELIST CHECKER : FCFS / GDT
===================================================== */
let FCFS = [];
let GDT = [];

function loadCSV(path, target) {
  fetch(path)
    .then((r) => r.text())
    .then((txt) => {
      target.length = 0;
      txt.split(/\r?\n/).forEach((line) => {
        const v = line.trim().toLowerCase();
        if (v) target.push(v);
      });
    })
    .catch(() => {});
}

// load lists
loadCSV("data/fcfs.csv", FCFS);
loadCSV("data/gdt.csv", GDT);

function checkWhitelist() {
  const input = document.getElementById("walletInput");
  const result = document.getElementById("walletResult");

  if (!input || !result) return;

  const addr = input.value.trim().toLowerCase();
  if (!addr) {
    result.textContent = "Please paste a wallet address.";
    return;
  }

  if (FCFS.includes(addr)) {
    result.textContent =
      "✅ This address is whitelisted for FCFS mint access.";
  } else if (GDT.includes(addr)) {
    result.textContent =
      "🎟️ This address is whitelisted for Guaranteed (GDT) mint access.";
  } else {
    result.textContent = "❌ This address is not whitelisted.";
  }
}

/* =====================================================
   LINKS
===================================================== */
function openTwitter() {
  window.open("https://x.com/Phanto0ms", "_blank");
}
