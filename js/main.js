/* =========================
   INTRO LOADER FIX
========================= */
let load = 0;
const percent = document.getElementById("loadingPercent");
const bar = document.querySelector(".loading-bar");

const introInterval = setInterval(() => {
  load += Math.floor(Math.random() * 6) + 4;
  if (load >= 100) {
    load = 100;
    clearInterval(introInterval);

    setTimeout(() => {
      const intro = document.getElementById("intro");
      intro.style.opacity = "0";
      intro.style.pointerEvents = "none";

      setTimeout(() => {
        intro.style.display = "none";   // 🔥 THIS LINE FIXES EVERYTHING
      }, 1000);

    }, 500);
  }

  if (percent) percent.textContent = load + "%";
  if (bar) bar.style.width = load + "%";
}, 120);

/* ABOUT LETTER ANIM */
const about=document.getElementById("aboutText");
if(about){
  const chars=about.innerHTML.split("");
  about.innerHTML=chars.map((c,i)=>
    c===" "?"&nbsp;":`<span style="animation-delay:${i*0.015}s">${c}</span>`
  ).join("");
}

/* TOGGLES */
function toggleExplore(){
  const b=document.getElementById("exploreBox");
  b.classList.toggle("hidden");
  setTimeout(()=>b.classList.toggle("show"),10);
}
function toggleWallet(){
  const b=document.getElementById("walletBox");
  b.classList.toggle("hidden");
  setTimeout(()=>b.classList.toggle("show"),10);
}

/* EXPLORE SHUFFLE */
const rows=document.querySelectorAll(".explore-row");
const nftList=[...Array(23)].map((_,i)=>`assets/nft${i+1}.png`);

function shuffle(a){
  for(let i=a.length-1;i>0;i--){
    const j=Math.floor(Math.random()*(i+1));
    [a[i],a[j]]=[a[j],a[i]];
  }
  return a;
}

function fillExplore(){
  rows.forEach(r=>{
    r.innerHTML="";
    shuffle([...nftList]).slice(0,7).forEach(src=>{
      const b=document.createElement("button");
      b.className="nft-btn";
      b.innerHTML=`<img src="${src}">`;
      r.appendChild(b);
    });
  });
}
fillExplore();
setInterval(fillExplore,7000);

/* WHITELIST */
let FCFS=[],GDT=[];
fetch("data/fcfs.csv").then(r=>r.text()).then(t=>FCFS=t.split(/\r?\n/).map(v=>v.trim().toLowerCase()));
fetch("data/gdt.csv").then(r=>r.text()).then(t=>GDT=t.split(/\r?\n/).map(v=>v.trim().toLowerCase()));

function checkWhitelist(){
  const w=document.getElementById("walletInput").value.trim().toLowerCase();
  const r=document.getElementById("walletResult");
  if(!w){r.textContent="Paste wallet address";return}
  if(FCFS.includes(w)) r.textContent="✅ FCFS Whitelisted";
  else if(GDT.includes(w)) r.textContent="🎟️ GDT Whitelisted";
  else r.textContent="❌ Not Whitelisted";
}

/* LINKS */
function openTwitter(){
  window.open("https://x.com/Phanto0ms","_blank");
}

/* SCROLL-BASED GLOW */
window.addEventListener("scroll",()=>{
  const sc=window.scrollY/window.innerHeight;
  document.documentElement.style.setProperty("--glow",Math.min(.5,.25+sc*.3));
});
