// INTRO LOADING (FAST)
let p=0;
const percent=document.getElementById("loadingPercent");
const bar=document.querySelector(".loading-bar");
const intro=document.getElementById("intro");
const t=setInterval(()=>{
  p+=18;
  if(p>=100){
    p=100; clearInterval(t);
    setTimeout(()=>intro.style.display="none",300);
  }
  percent.textContent=p+"%";
  bar.style.width=p+"%";
},50);

// ABOUT LETTER ANIMATION
const about=document.getElementById("aboutText");
const chars=about.innerText.split("");
about.innerHTML=chars.map((c,i)=>
  c===" "?"&nbsp;":`<span style="animation-delay:${i*0.015}s">${c}</span>`
).join("");

// NFT MODAL
document.querySelectorAll(".nft-btn").forEach(btn=>{
  btn.onclick=()=>document.getElementById("traitModal").style.display="flex";
});
function closeTrait(){
  document.getElementById("traitModal").style.display="none";
}

// WHITELIST CHECK
let FCFS=[],GDT=[];
fetch("data/fcfs.csv").then(r=>r.text()).then(t=>FCFS=t.split(/\r?\n/).map(v=>v.trim().toLowerCase()).filter(Boolean));
fetch("data/gdt.csv").then(r=>r.text()).then(t=>GDT=t.split(/\r?\n/).map(v=>v.trim().toLowerCase()).filter(Boolean));

function checkWhitelist(){
  const w=document.getElementById("walletInput").value.trim().toLowerCase();
  const r=document.getElementById("walletResult");
  if(!w){r.textContent="Please paste a wallet address.";return;}
  if(FCFS.includes(w)){
    r.textContent="✅ This address is whitelisted for FCFS mint access.";
  }else if(GDT.includes(w)){
    r.textContent="🎟️ This address is whitelisted for Guaranteed (GDT) mint access.";
  }else{
    r.textContent="❌ This address is not whitelisted.";
  }
}

// ICON ACTIONS
function openTwitter(){ window.open("https://x.com/Phanto0ms","_blank"); }
function toggleComing(id){
  const el=document.getElementById(id);
  if(el) el.classList.toggle("show");
}
function toggleExplore(){
  document.getElementById("exploreBox").classList.toggle("show");
}
function toggleWallet(){
  document.getElementById("walletBox").classList.toggle("show");
}

// auto shuffle NFTs
setInterval(()=>{
  document.querySelectorAll(".explore-row").forEach(row=>{
    const items=[...row.children];
    items.sort(()=>Math.random()-0.5);
    items.forEach(i=>row.appendChild(i));
  });
},6000);
// TOGGLES
function toggleExplore(){
  document.getElementById("exploreBox").classList.toggle("show");
}
function toggleWallet(){
  document.getElementById("walletBox").classList.toggle("show");
}

// EXPLORE NFT LOAD + SHUFFLE
const nftList = Array.from({length:23},(_,i)=>`assets/nft${i+1}.png`);
const rows = document.querySelectorAll(".explore-row");

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

function shuffle(arr){
  for(let i=arr.length-1;i>0;i--){
    const j=Math.floor(Math.random()*(i+1));
    [arr[i],arr[j]]=[arr[j],arr[i]];
  }
  return arr;
}

fillExplore();
setInterval(fillExplore,7000);

// Twitter
function openTwitter(){
  window.open("https://x.com/Phanto0ms","_blank");
}
