/* =========================
   INTRO LOADER
========================= */
let load = 0;
const percent = document.getElementById("loadingPercent");
const bar = document.querySelector(".loading-bar");

const introInterval = setInterval(() => {
  load += Math.floor(Math.random() * 8) + 6;
  if (load >= 100) {
    load = 100;
    clearInterval(introInterval);
    setTimeout(() => {
      const intro = document.getElementById("intro");
      intro.style.opacity = "0";
      setTimeout(() => intro.style.display = "none", 900);
    }, 400);
  }
  percent.textContent = load + "%";
  bar.style.width = load + "%";
}, 110);

/* =========================
   HERO LIVE SHIMMER
========================= */
const hero = document.querySelector(".hero-title");
let hue = 0;
setInterval(() => {
  hue = (hue + 1) % 360;
  hero.style.backgroundImage =
    `linear-gradient(90deg,
      hsl(${hue},90%,70%),
      hsl(${(hue+60)%360},90%,70%),
      hsl(${(hue+120)%360},90%,70%)
    )`;
}, 60);

/* =========================
   EXPLORE COLLECTION
========================= */
const nftList = Array.from({length:23},(_,i)=>`assets/nft${i+1}.png`);
const rows = document.querySelectorAll(".explore-row");

function shuffle(arr){
  return arr.sort(()=>Math.random()-0.5);
}

function fillExplore(){
  rows.forEach(r=>{
    r.innerHTML="";
    shuffle([...nftList]).slice(0,7).forEach(src=>{
      const b=document.createElement("button");
      b.className="nft-btn";
      b.innerHTML=`<img src="${src}" loading="lazy">`;
      b.onclick=()=>document.getElementById("traitModal").classList.remove("hidden");
      r.appendChild(b);
    });
  });
}

rows.forEach((row,i)=>{
  let x = i%2===0 ? 0 : -row.scrollWidth/2;
  const speed = i%2===0 ? 0.25 : -0.25;
  function move(){
    x += speed;
    if(Math.abs(x) > row.scrollWidth/2) x=0;
    row.style.transform=`translateX(${x}px)`;
    requestAnimationFrame(move);
  }
  move();
});

/* =========================
   TOGGLES
========================= */
function toggleExplore(){
  const box=document.getElementById("exploreBox");
  box.classList.remove("hidden");
  box.classList.toggle("show");
  fillExplore();
}

function toggleWallet(){
  const box=document.getElementById("walletBox");
  box.classList.remove("hidden");
  box.classList.toggle("show");
}

/* =========================
   WALLET CHECKER + SUCCESS GLOW
========================= */
async function checkWallet(){
  const input=document.getElementById("walletInput");
  const res=document.getElementById("walletResult");
  const loader=document.getElementById("walletLoader");

  loader.classList.remove("hidden");
  res.textContent="";
  res.className="";

  setTimeout(()=>{
    loader.classList.add("hidden");
    res.textContent="✅ Wallet whitelisted — Access granted!";
    res.classList.add("success-glow");
  },1200);
}

/* =========================
   MODALS
========================= */
function comingSoon(name){
  document.getElementById("comingSoonTitle").textContent=name+" — Coming Soon";
  document.getElementById("comingSoonModal").classList.remove("hidden");
}
function closeComingSoon(){
  document.getElementById("comingSoonModal").classList.add("hidden");
}
function closeTrait(){
  document.getElementById("traitModal").classList.add("hidden");
}

/* =========================
   SOCIAL
========================= */
function openTwitter(){
  window.open("https://x.com/Phanto0ms","_blank");
}
