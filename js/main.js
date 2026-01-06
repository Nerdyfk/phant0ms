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
