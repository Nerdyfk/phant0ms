document.addEventListener("DOMContentLoaded",()=>{

/* Intro */
setTimeout(()=>document.getElementById("intro").style.display="none",4200)

/* Gradient control */
document.getElementById("gradCtl").addEventListener("input",e=>{
  document.documentElement.style.setProperty("--g",e.target.value)
})

/* About letter animation */
const about=document.getElementById("aboutText")
const chars=about.innerText.split("")
about.innerHTML=chars.map((c,i)=>
 `<span style="animation-delay:${i*0.015}s">${c===" "?"&nbsp;":c}</span>`
).join("")

/* Snake delay */
document.querySelectorAll(".snakeItem").forEach((el,i)=>{
  el.style.animationDelay=`${i*1.2}s`
})

})

function togglePanel(id){
  document.getElementById(id).classList.toggle("show")
}
function toggleExplore(){
  document.getElementById("exploreBox").classList.toggle("show")
}
function openTwitter(){
  window.open("https://x.com/Phanto0ms","_blank")
}
function closeTrait(){
  document.getElementById("traitModal").style.display="none"
}
/* ================= WALLET ================= */
function toggleWallet(){
  document.getElementById("walletBox").classList.toggle("show")
}

function checkWallet(){
  const w = document.getElementById("walletInput").value.trim()
  const r = document.getElementById("walletResult")

  if(!w){
    r.textContent = "Please paste a wallet address"
    return
  }

  // placeholder (real CSV/XLSX later)
  r.textContent = "Status: Coming Soon"
}

/* ================= MOBILE GYRO ================= */
function initGyro(){
  if (
    typeof DeviceOrientationEvent !== "undefined" &&
    typeof DeviceOrientationEvent.requestPermission === "function"
  ){
    DeviceOrientationEvent.requestPermission().then(res=>{
      if(res==="granted") startGyro()
    })
  } else {
    startGyro()
  }
}

function startGyro(){
  window.addEventListener("deviceorientation", e=>{
    const x = e.gamma || 0   // left-right
    const y = e.beta || 0    // front-back

    document.querySelectorAll(".snakeItem").forEach((el,i)=>{
      const depth = (i+1) * 0.6
      el.style.transform +=
        ` translate(${x*0.4}px, ${y*0.25}px)`
    })
  })
}

/* auto-init gyro when explore opens */
function toggleExplore(){
  exploreBox.classList.toggle("show")
  if(exploreBox.classList.contains("show")){
    initGyro()
  }
}
