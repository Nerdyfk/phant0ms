document.addEventListener("DOMContentLoaded",()=>{

// Intro hide (glitch loading stays)
setTimeout(()=>document.getElementById("intro").style.display="none",4200)

// Gradient controller
const gradCtl=document.getElementById("gradCtl")
gradCtl.addEventListener("input",e=>{
  document.documentElement.style.setProperty("--g",e.target.value)
})

// About letter animation (readable)
const about=document.getElementById("aboutText")
const chars=about.innerText.split("")
about.innerHTML=chars.map((c,i)=>
 `<span style="animation-delay:${i*0.015}s">${c===" "?"&nbsp;":c}</span>`
).join("")

// Snake tail-follow delays + click → trait modal
document.querySelectorAll(".snakeItem").forEach((el,i)=>{
  el.style.animationDelay=`${i*1.2}s`
  el.addEventListener("click",()=>document.getElementById("traitModal").style.display="flex")
})

})

// Explore toggle + gyro init
function toggleExplore(){
  const box=document.getElementById("exploreBox")
  box.classList.toggle("show")
  if(box.classList.contains("show")) initGyro()
}

// Panels (OpenSea / ME / Store)
function togglePanel(id){
  document.getElementById(id).classList.toggle("show")
}

// Wallet
function toggleWallet(){
  document.getElementById("walletBox").classList.toggle("show")
}
function checkWallet(){
  const w=document.getElementById("walletInput").value.trim()
  const r=document.getElementById("walletResult")
  if(!w){r.textContent="Please paste a wallet address";return}
  r.textContent="Status: Coming Soon"
}

// Twitter
function openTwitter(){
  window.open("https://x.com/Phanto0ms","_blank")
}

// Trait modal
function closeTrait(){
  document.getElementById("traitModal").style.display="none"
}

// ===== Mobile Gyro Polish (Explore only) =====
function initGyro(){
  if(typeof DeviceOrientationEvent!=="undefined" &&
     typeof DeviceOrientationEvent.requestPermission==="function"){
    DeviceOrientationEvent.requestPermission().then(res=>{
      if(res==="granted") startGyro()
    })
  } else {
    startGyro()
  }
}
function startGyro(){
  window.addEventListener("deviceorientation",e=>{
    const x=e.gamma||0
    const y=e.beta||0
    document.querySelectorAll(".snakeItem").forEach((el,i)=>{
      const d=(i+1)*0.3
      el.style.transform += ` translate(${x*0.25}px, ${y*0.2}px)`
    })
  },{passive:true})
}
