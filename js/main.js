let traitsData = {}

fetch("data/traits.json")
  .then(res=>res.json())
  .then(data=>traitsData=data)

/* Glitch loading */
let p=0
const percent=document.getElementById("loadingPercent")
const t=setInterval(()=>{
  p+=Math.floor(Math.random()*7)
  if(p>=100){p=100;clearInterval(t)}
  percent.textContent=p+"%"
},120)

window.addEventListener("load",()=>{
  setTimeout(()=>{
    intro.style.opacity="0"
    setTimeout(()=>intro.style.display="none",1200)
  },4200)
})

/* Gradient */
gradCtl.oninput=e=>{
  document.documentElement.style.setProperty("--g",e.target.value)
}

/* About animation */
const about=document.getElementById("aboutText")
const chars=about.innerText.split("")
about.innerHTML=chars.map((c,i)=>
 `<span style="animation-delay:${i*0.02}s">${c===" "?"&nbsp;":c}</span>`
).join("")

/* SVG Snake */
const path=document.getElementById("snakePath")
const len=path.getTotalLength()
const container=document.getElementById("snakeContainer")

const nftFiles=[...Array(23).keys()].map(i=>`assets/nft${i+1}.png`)

nftFiles.forEach((src,i)=>{
  const img=document.createElement("img")
  img.src=src
  img.className="snakeNFT"
  container.appendChild(img)

  let offset=i*60
  let paused=false

  img.onclick=()=>{
    paused=true
    showTrait(src)
  }

  function animate(){
    if(!paused){
      offset=(offset+0.6)%len
      const p=path.getPointAtLength(offset)
      img.style.left=p.x-36+"px"
      img.style.top=p.y-36+"px"
    }
    requestAnimationFrame(animate)
  }
  animate()
})

function showTrait(src){
  traitTitle.textContent=src.split("/").pop()
  traitContent.textContent=traitsData[src] ?
    JSON.stringify(traitsData[src],null,2) :
    "Traits: Coming Soon"
  traitModal.style.display="flex"
}

function closeTrait(){
  traitModal.style.display="none"
}

/* Explore / Wallet */
function toggleExplore(){exploreBox.classList.toggle("show")}
function toggleWallet(){walletBox.classList.toggle("show")}
function checkWallet(){walletResult.textContent="Status: Coming Soon"}
function togglePanel(id){document.getElementById(id).classList.toggle("show")}
