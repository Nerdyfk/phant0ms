/* ======================================================
   INTRO : FAST CINEMATIC FAKE LOADING
====================================================== */
(function introLoader(){
  let p = 0;
  const percent = document.getElementById("loadingPercent");
  const bar = document.querySelector(".loading-bar");
  const intro = document.getElementById("intro");

  if (!intro) return;

  const t = setInterval(() => {
    // faster, cinematic
    p += Math.random() * 14 + 6;
    if (p >= 100) {
      p = 100;
      clearInterval(t);
      setTimeout(() => {
        intro.style.opacity = "0";
        setTimeout(() => {
          intro.style.display = "none";
        }, 450);
      }, 200);
    }
    if (percent) percent.textContent = Math.floor(p) + "%";
    if (bar) bar.style.width = p + "%";
  }, 70);
})();

/* ======================================================
   ABOUT : LETTER-BY-LETTER (READABLE)
====================================================== */
(function aboutLetters(){
  const about = document.getElementById("aboutText");
  if (!about) return;

  const text = about.innerText;
  const chars = text.split("");
  about.innerHTML = chars.map((c, i) => {
    if (c === " ") return "&nbsp;";
    return `<span style="animation-delay:${i * 0.015}s">${c}</span>`;
  }).join("");
})();

/* ======================================================
   EXPLORE : NFT BUTTONS → TRAIT MODAL
====================================================== */
(function exploreNFTs(){
  const buttons = document.querySelectorAll(".nft-btn");
  const modal = document.getElementById("traitModal");
  const title = document.getElementById("traitTitle");
  const content = document.getElementById("traitContent");

  if (!buttons.length || !modal) return;

  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      if (title) title.textContent = "NFT Traits";
      if (content) content.textContent = "Traits: Coming Soon";
      modal.style.display = "flex";
    });
  });
})();

function closeTrait(){
  const modal = document.getElementById("traitModal");
  if (modal) modal.style.display = "none";
}

/* ======================================================
   WHITELIST CHECKER : FCFS / GDT CSV
====================================================== */
let FCFS_LIST = [];
let GDT_LIST = [];

function loadCSV(path, target){
  return fetch(path)
    .then(res => res.text())
    .then(txt => {
      target.length = 0;
      txt.split(/\r?\n/).forEach(line => {
        const v = line.trim().toLowerCase();
        if (v) target.push(v);
      });
    })
    .catch(() => {});
}

// preload lists
loadCSV("data/fcfs.csv", FCFS_LIST);
loadCSV("data/gdt.csv", GDT_LIST);

function checkWhitelist(){
  const input = document.getElementById("walletInput");
  const result = document.getElementById("walletResult");
  if (!input || !result) return;

  const addr = input.value.trim().toLowerCase();
  if (!addr){
    result.textContent = "Please paste a wallet address.";
    return;
  }

  if (FCFS_LIST.includes(addr)){
    result.textContent = "✅ This address is whitelisted for FCFS mint access.";
  } else if (GDT_LIST.includes(addr)){
    result.textContent = "🎟️ This address is whitelisted for Guaranteed (GDT) mint access.";
  } else {
    result.textContent = "❌ This address is not whitelisted.";
  }
}

/* ======================================================
   UTILS : ICONS / LINKS (SAFE)
====================================================== */
function openTwitter(){
  window.open("https://x.com/Phanto0ms", "_blank");
}
