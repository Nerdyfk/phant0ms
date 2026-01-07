/* INTRO LOADING */
let p=0;
const bar=document.querySelector(".loading-bar");
const per=document.getElementById("loadingPercent");
const intro=document.getElementById("intro");

const loader=setInterval(()=>{
  p+=15;
  if(p>=100){
    p=100;
    clearInterval(loader);
    setTimeout(()=>intro.style.display="none",300);
  }
  bar.style.width=p+"%";
  per.textContent=p+"%";
},50);

/* ABOUT LETTER ANIMATION */
const about=document.getElementById("aboutText");
const chars=about.innerText.split("");
about.innerHTML=chars.map((c,i)=>
  c===" "?"&nbsp;":`<span style="animation-delay:${i*0.015}s">${c}</span>`
).join("");

/* =========================
   REVEAL ON BUTTON CLICK
========================= */
function toggleExplore(){
  const box=document.getElementById("exploreBox");
  box.classList.toggle("hidden");
  setTimeout(()=>box.classList.toggle("show"),10);
}

function toggleWallet(){
  const box=document.getElementById("walletBox");
  box.classList.toggle("hidden");
  setTimeout(()=>box.classList.toggle("show"),10);
}

/* =========================
   CODE PARTICLE GENERATOR
========================= */
const codes=["0xA3F","{ }","NFT","BASE","WEB3","0110","<>"];
for(let i=0;i<18;i++){
  const s=document.createElement("span");
  s.className="code-particle";
  s.textContent=codes[Math.floor(Math.random()*codes.length)];
  s.style.left=Math.random()*100+"vw";
  s.style.top=Math.random()*100+"vh";
  s.style.animationDuration=15+Math.random()*20+"s";
  document.body.appendChild(s);
}

/* EXPLORE NFT SHUFFLE */
const rows=document.querySelectorAll(".explore-row");
const nftList=Array.from({length:23},(_,i)=>`assets/nft${i+1}.png`);

function shuffle(arr){
  for(let i=arr.length-1;i>0;i--){
    const j=Math.floor(Math.random()*(i+1));
    [arr[i],arr[j]]=[arr[j],arr[i]];
  }
  return arr;
}

function fillExplore(){
  rows.forEach(row=>{
    row.innerHTML="";
    shuffle([...nftList]).slice(0,7).forEach(src=>{
      const btn=document.createElement("button");
      btn.className="nft-btn";
      btn.innerHTML=`<img src="${src}">`;
      row.appendChild(btn);
    });
  });
}
fillExplore();
setInterval(fillExplore,7000);

/* WALLET CHECK */
let FCFS=[],GDT=[];
fetch("data/fcfs.csv").then(r=>r.text()).then(t=>FCFS=t.split(/\r?\n/).map(v=>v.trim().toLowerCase()));
fetch("data/gdt.csv").then(r=>r.text()).then(t=>GDT=t.split(/\r?\n/).map(v=>v.trim().toLowerCase()));

function checkWhitelist(){
  const w=document.getElementById("walletInput").value.trim().toLowerCase();
  const r=document.getElementById("walletResult");
  if(!w){r.textContent="Paste a wallet address";return}
  if(FCFS.includes(w)) r.textContent="✅ FCFS Whitelisted";
  else if(GDT.includes(w)) r.textContent="🎟️ GDT Whitelisted";
  else r.textContent="❌ Not Whitelisted";
}

/* LINKS */
function openTwitter(){
  window.open("https://x.com/Phanto0ms","_blank");
}
