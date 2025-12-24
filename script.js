const startBtn = document.getElementById("startBtn");
const startScreen = document.getElementById("start");
const main = document.getElementById("main");

const crash = document.getElementById("crash");
const rebootBtn = document.getElementById("rebootBtn");
const crashFill = document.getElementById("crashFill");
const countdownText = document.getElementById("countdownText");

const frameOverlay = document.getElementById("frameOverlay");
const page2Decor = document.getElementById("page2Decor");

const typedTitle = document.getElementById("typedTitle");
const confettiBtn = document.getElementById("confettiBtn");
const celebrateBtn = document.getElementById("celebrateBtn");
const page2 = document.getElementById("page2");

const openLetterBtn = document.getElementById("openLetterBtn");

const lightbox = document.getElementById("lightbox");
const lbImg = document.getElementById("lbImg");
const closeLb = document.getElementById("closeLb");

const canvas = document.getElementById("confetti");
const ctx = canvas.getContext("2d");

const balloonsLayer = document.getElementById("balloons");
const bgMusic = document.getElementById("bgMusic");

let confetti = [];
let animId = null;

function resizeCanvas(){
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

function typeText(el, text, speed=45){
  el.textContent = "";
  let i = 0;
  const timer = setInterval(() => {
    el.textContent += text[i];
    i++;
    if(i >= text.length) clearInterval(timer);
  }, speed);
}

function burstConfetti(){
  const count = 180;
  const W = canvas.width, H = canvas.height;

  for(let i=0;i<count;i++){
    confetti.push({
      x: Math.random()*W,
      y: -20 - Math.random()*H*0.2,
      vx: (Math.random()-0.5)*4,
      vy: 3 + Math.random()*5,
      size: 4 + Math.random()*6,
      rot: Math.random()*Math.PI,
      vr: (Math.random()-0.5)*0.2,
      life: 160 + Math.random()*80
    });
  }
  if(!animId) animateConfetti();
}

function animateConfetti(){
  const W = canvas.width, H = canvas.height;
  ctx.clearRect(0,0,W,H);

  confetti.forEach(p => {
    p.x += p.vx;
    p.y += p.vy;
    p.rot += p.vr;
    p.vy += 0.03;
    p.life -= 1;

    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot);

    const g = ctx.createLinearGradient(-p.size, 0, p.size, 0);
    g.addColorStop(0, "rgba(255,95,162,.95)");
    g.addColorStop(1, "rgba(124,92,255,.95)");
    ctx.fillStyle = g;

    ctx.fillRect(-p.size/2, -p.size/2, p.size, p.size*0.8);
    ctx.restore();
  });

  confetti = confetti.filter(p => p.life > 0 && p.y < H + 40);

  if(confetti.length > 0){
    animId = requestAnimationFrame(animateConfetti);
  } else {
    cancelAnimationFrame(animId);
    animId = null;
    ctx.clearRect(0,0,W,H);
  }
}

function spawnBalloons(n = 10){
  for(let i=0;i<n;i++){
    const b = document.createElement("div");
    b.className = "balloon";

    b.style.left = (Math.random() * 100) + "vw";
    b.style.animationDuration = (3.8 + Math.random()*2.2) + "s";

    const r1 = 200 + Math.floor(Math.random()*56);
    const g1 = 80 + Math.floor(Math.random()*140);
    const b1 = 160 + Math.floor(Math.random()*90);
    const r2 = 120 + Math.floor(Math.random()*120);
    const g2 = 80 + Math.floor(Math.random()*120);
    const b2 = 220 + Math.floor(Math.random()*36);

    b.style.background = `linear-gradient(180deg, rgb(${r1},${g1},${b1}), rgb(${r2},${g2},${b2}))`;

    balloonsLayer.appendChild(b);
    setTimeout(() => b.remove(), 6500);
  }
}

startBtn.addEventListener("click", () => {
  startScreen.classList.add("hidden");
  crash.classList.remove("hidden");

  crashFill.style.width = "0%";
  rebootBtn.disabled = true;

  bgMusic.volume = 0;
  bgMusic.play().catch(() => {});
  let v = 0;
  const fadeIn = setInterval(() => {
    v += 0.02;
    bgMusic.volume = Math.min(v, 0.5);
    if (v >= 0.5) clearInterval(fadeIn);
  }, 100);

  requestAnimationFrame(() => {
    crashFill.style.width = "100%";
  });

  let t = 5;
  countdownText.textContent = `Restart available in ${t}s…`;

  const timer = setInterval(() => {
    t--;
    if(t > 0){
      countdownText.textContent = `Restart available in ${t}s…`;
    } else {
      clearInterval(timer);
      rebootBtn.disabled = false;
      countdownText.textContent = "Restart ready";
    }
  }, 1000);
});

rebootBtn.addEventListener("click", () => {
  crash.classList.add("hidden");
  main.classList.remove("hidden");

  page2.classList.add("hidden");

  frameOverlay.classList.remove("hidden"); 
  page2Decor.classList.add("hidden");      

  typeText(typedTitle, "Happy Birthday To the Coolest Girl I know 🤗˚.🎀༘⋆");
  burstConfetti();
  spawnBalloons(12);
});

confettiBtn.addEventListener("click", () => {
  burstConfetti();
  spawnBalloons(6);
});

celebrateBtn.addEventListener("click", () => {
  page2.classList.remove("hidden");

  frameOverlay.classList.add("hidden");     
  page2Decor.classList.remove("hidden");    

  burstConfetti();
  page2.scrollIntoView({ behavior: "smooth", block: "start" });
});

openLetterBtn.addEventListener("click", () => {
  openLetterBtn.classList.toggle("open");
  burstConfetti();
});

document.querySelectorAll(".photo").forEach(el => {
  el.addEventListener("click", () => {
    lbImg.src = el.dataset.full;
    lightbox.classList.remove("hidden");
  });
});

function closeLightbox(){
  lightbox.classList.add("hidden");
  lbImg.src = "";
}
closeLb.addEventListener("click", closeLightbox);
lightbox.addEventListener("click", (e) => {
  if(e.target === lightbox) closeLightbox();
});
document.addEventListener("keydown", (e) => {
  if(e.key === "Escape") closeLightbox();
});
