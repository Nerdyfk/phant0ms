/* INTRO */
let p=0;
const bar=document.getElementById("loadBar");
const pct=document.getElementById("loadPct");
const t=setInterval(()=>{
  p+=Math.random()*12;
  if(p>=100){p=100;clearInterval(t);
    setTimeout(()=>document.getElementById("intro").style.display="none",600);
  }
  bar.style.width=p+"%";
  pct.textContent=Math.floor(p)+"%";
},80);

/* TOGGLES */
function toggleExplore(){
  document.getElementById("exploreBox").classList.toggle("show");
}
function toggleWallet(){
  document.getElementById("walletBox").classList.toggle("show");
}

/* SOCIAL */
function openTwitter(){
  window.open("https://x.com/Phanto0ms","_blank");
}
function comingSoon(){
  document.getElementById("modal").style.display="flex";
}
function closeModal(){
  document.getElementById("modal").style.display="none";
}

/* EXPLORE POPULATE */
const rows=document.querySelectorAll(".row");
let imgs=[];
for(let i=1;i<=23;i++) imgs.push(`assets/nft${i}.png`);
rows.forEach(r=>{
  imgs.concat(imgs).forEach(src=>{
    const im=document.createElement("img");
    im.src=src;
    im.onclick=comingSoon;
    r.appendChild(im);
  });
});

/* WALLET CHECKER */
let fcfs=[],gdt=[];
fetch("data/fcfs.csv").then(r=>r.text()).then(t=>fcfs=t.split(/\r?\n/));
fetch("data/gdt.csv").then(r=>r.text()).then(t=>gdt=t.split(/\r?\n/));

function checkWallet(){
  const w=document.getElementById("walletInput").value.trim();
  const res=document.getElementById("walletResult");
  res.textContent="Checking…";
  res.className="";
  setTimeout(()=>{
    if(gdt.includes(w)){
      res.textContent="⭐ Guaranteed (GDT) — Priority access granted";
      res.classList.add("success");
    }else if(fcfs.includes(w)){
      res.textContent="✅ FCFS Whitelisted — First come, first serve";
      res.classList.add("success");
    }else{
      res.textContent="❌ Wallet not whitelisted";
      res.classList.add("fail");
    }
  },800);
}
