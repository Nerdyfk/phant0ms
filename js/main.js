document.addEventListener("DOMContentLoaded",()=>{

/* Glitch loading % */
let p=0
const percent=document.getElementById("loadingPercent")
const timer=setInterval(()=>{
  p+=Math.floor(Math.random()*8)
  if(p>=100){p=100;clearInterval(timer)}
  percent.textContent=p+"%"
},120)

setTimeout(()=>intro.style.display="none",4200)

/* Gradient control */
gradCtl.addEventListener("input",e=>{
  document.documentElement.style.setProperty("--g",e.target.value)
})

/* About animation */
const about=document.getElementById("aboutText")
const chars=about.innerText.split("")
about.innerHTML=chars.map((c,i)=>
 `<span style="animation-delay:${i*0.02}s">${c===" "?"&nbsp;":c}</span>`
).join("")

/* Snake tail follow + click */
document.querySelectorAll(".snakeItem").forEach((el,i)=>{
  el.style.animationDelay=`${i*1.4}s`
  el.onclick=()=>traitModal.style.display="flex"
})

})

function toggleExplore(){exploreBox.classList.toggle("show")}
function toggleWallet(){walletBox.classList.toggle("show")}
function togglePanel(id){document.getElementById(id).classList.toggle("show")}
function checkWallet(){
  walletResult.textContent="Status: Coming Soon"
}
function openTwitter(){
  window.open("https://x.com/Phanto0ms","_blank")
}
function closeTrait(){
  traitModal.style.display="none"
}
