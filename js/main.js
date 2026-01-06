let traitsData = {};

// Load traits (real structure, placeholder values)
fetch("data/traits.json").then(r=>r.json()).then(j=>traitsData=j);

// Glitch loading %
let p=0;
const percent=document.getElementById("loadingPercent");
const t=setInterval(()=>{
  p+=Math.floor(Math.random()*7);
  if(p>=100){p=100;clearInterval(t)}
  percent.textContent=p+"%";
},120);

window.addEventListener("load",()=>{
  setTimeout(()=>{
    const intro=document.getElementById("intro");
    intro.style.opacity="0";
    setTimeout(()=>intro.style.display="none",1200);
  },4200);
});

// Gradient control
document.getElementById("gradCtl").oninput=e=>{
  document.documentElement.style.setProperty("--g",e.target.value);
};

// About letter animation
const about=document.getElementById("aboutText");
const chars=about.innerText.split("");
about.innerHTML=chars.map((c,i)=>
  `<span style="animation-delay:${i*0.02}s">${c===" "?"&nbsp;":c}</span>`
).join("");

// SVG Snake (single path, smooth, slow)
const path=document.getElementById("snakePath");
const len=path.getTotalLength();
const container=document.getElementById("snakeContainer");
const files=[...Array(23).keys()].map(i=>`assets/nft${i+1}.png`);
let paused=false;

files.forEach((src,i)=>{
  const img=document.createElement("img");
  img.src=src; img.className="snakeNFT";
  container.appendChild(img);

  let offset=i*70;
  img.onclick=()=>{
    paused=true;
    showTrait(src);
  };

  function tick(){
    if(!paused){
      offset=(offset+0.35)%len; // slow speed
      const pt=path.getPointAtLength(offset);
      img.style.left=(pt.x-36)+"px";
      img.style.top=(pt.y-36)+"px";
    }
    requestAnimationFrame(tick);
  }
  tick();
});

function showTrait(src){
  document.getElementById("traitTitle").textContent=src.split("/").pop();
  document.getElementById("traitContent").textContent=
    traitsData[src] ? JSON.stringify(traitsData[src],null,2) : "Traits: Coming Soon";
  document.getElementById("traitModal").style.display="flex";
}
function closeTrait(){
  paused=false;
  document.getElementById("traitModal").style.display="none";
}

// Toggles
function toggleExplore(){
  const box=document.getElementById("exploreBox");
  box.classList.toggle("show");
  if(box.classList.contains("show")) initGyro();
}
function toggleWallet(){document.getElementById("walletBox").classList.toggle("show")}
function togglePanel(id){document.getElementById(id).classList.toggle("show")}
function checkWallet(){document.getElementById("walletResult").textContent="Status: Coming Soon"}
function openTwitter(){window.open("https://x.com/Phanto0ms","_blank")}

// Mobile gyro (Explore only)
function initGyro(){
  if(typeof DeviceOrientationEvent!=="undefined" &&
     typeof DeviceOrientationEvent.requestPermission==="function"){
    DeviceOrientationEvent.requestPermission().then(r=>{ if(r==="granted") startGyro(); });
  } else startGyro();
}
function startGyro(){
  window.addEventListener("deviceorientation",e=>{
    const x=e.gamma||0, y=e.beta||0;
    document.querySelectorAll(".snakeNFT").forEach((el,i)=>{
      el.style.transform=`translate(${x*0.2}px, ${y*0.15}px)`;
    });
  },{passive:true});
}
