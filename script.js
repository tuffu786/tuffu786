
// Simple site-wide personalization + playful interactions
(function(){
  const params = new URLSearchParams(location.search);
  const her = params.get('her') || 'Aafi';
  const you = params.get('you') || 'Mujhse';
  document.documentElement.style.setProperty('--her', `'${her}'`);
  const herEls = document.querySelectorAll('[data-her]');
  herEls.forEach(el => el.textContent = her);

  // dodge button
  const nope = document.querySelector('[data-dodge]');
  if(nope){
    const container = document.body;
    let enterCount = 0;
    nope.addEventListener('mouseenter', ()=>{
      enterCount++;
      const maxX = window.innerWidth - nope.offsetWidth - 20;
      const maxY = window.innerHeight - nope.offsetHeight - 20;
      const x = Math.max(20, Math.min(maxX, Math.random()*maxX));
      const y = Math.max(20, Math.min(maxY, Math.random()*maxY));
      nope.style.position = 'fixed';
      nope.style.left = x+'px';
      nope.style.top = y+'px';
      nope.style.transform = 'rotate('+ (Math.random()*12-6) +'deg)';
      if(enterCount>2){ nope.textContent = 'Nahi 😝'; }
    });
  }

  // reveal-on-scroll for .step
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if(e.isIntersecting){ e.target.classList.add('show'); } });
  }, {threshold: .25});
  document.querySelectorAll('.step').forEach(el => io.observe(el));

})();

// Confetti petals
function petalsBurst(x,y){
  const count = 140;
  for(let i=0;i<count;i++){
    const petal = document.createElement('div');
    petal.className = 'petal';
    petal.style.position='fixed';
    petal.style.left = x+'px'; petal.style.top = y+'px';
    petal.style.width = (6+Math.random()*10)+'px';
    petal.style.height = petal.style.width;
    petal.style.borderRadius = '60% 60% 0 60%';
    petal.style.background = `hsl(${330+Math.random()*20}, 90%, ${60+Math.random()*15}%)`;
    petal.style.transform = `rotate(${Math.random()*360}deg)`;
    petal.style.pointerEvents='none';
    petal.style.zIndex=9999;
    document.body.appendChild(petal);
    const dx = (Math.random()-0.5)*2;
    const dy = (Math.random()-0.2)*2 - 1.2;
    const rot = (Math.random()-0.5)*12;
    let life = 0;
    const drop = ()=>{
      life += 1/60;
      const nx = x + dx*life*120;
      const ny = y + (dy*life*120) + life*life*200; // gravity
      petal.style.transform = `translate(${nx-x}px, ${ny-y}px) rotate(${rot*life*60}deg)`;
      petal.style.opacity = String(1 - life*0.7);
      if(ny < window.innerHeight+60 && life<2.2) requestAnimationFrame(drop);
      else petal.remove();
    };
    requestAnimationFrame(drop);
  }
}

// Hearts Canvas background
function startHearts(){
  const canvas = document.getElementById('heartsCanvas');
  if(!canvas) return;
  const ctx = canvas.getContext('2d');
  let w,h; const DPR = Math.min(window.devicePixelRatio||1, 2);
  const hearts = [];
  function resize(){
    w = canvas.width = innerWidth*DPR;
    h = canvas.height = innerHeight*DPR;
    canvas.style.width = innerWidth+'px';
    canvas.style.height = innerHeight+'px';
  }
  window.addEventListener('resize', resize); resize();

  function newHeart(){
    return {
      x: Math.random()*w,
      y: h + Math.random()*h*0.3,
      size: (8 + Math.random()*18)*DPR,
      alpha: 0.85 + Math.random()*0.15,
      speed: 0.6 + Math.random()*1.2,
      wobble: Math.random()*1.5 + 0.2,
      angle: Math.random()*Math.PI*2
    };
  }
  for(let i=0;i<60;i++){ hearts.push(newHeart()); }

  function drawHeart(x,y,size){
    ctx.save();
    ctx.translate(x,y);
    ctx.beginPath();
    const s = size;
    ctx.moveTo(0, s*0.35);
    ctx.bezierCurveTo(-s*0.9, -s*0.2, -s*0.4, -s*0.9, 0, -s*0.5);
    ctx.bezierCurveTo(s*0.4, -s*0.9, s*0.9, -s*0.2, 0, s*0.35);
    ctx.closePath();
    ctx.fillStyle = `rgba(255, 77, 109, 0.18)`;
    ctx.fill();
    ctx.restore();
  }

  function tick(){
    ctx.clearRect(0,0,w,h);
    hearts.forEach(hh=>{
      hh.y -= hh.speed*DPR;
      hh.angle += 0.02;
      hh.x += Math.sin(hh.angle)*hh.wobble;
      if(hh.y < -50*DPR){ Object.assign(hh, newHeart(), {y: h+50}); }
      drawHeart(hh.x, hh.y, hh.size);
    });
    requestAnimationFrame(tick);
  }
  tick();
}

window.addEventListener('DOMContentLoaded', startHearts);

// Typewriter
function typeLetter(text, targetId, speed=26){
  const el = document.getElementById(targetId);
  if(!el) return;
  let i=0;
  function step(){
    el.textContent = text.slice(0, i++);
    if(i<=text.length) setTimeout(step, speed);
    else el.insertAdjacentHTML('beforeend','<span class="type-caret"></span>');
  }
  step();
}

// Parallax simple
function parallaxInit(){
  const box = document.querySelector('.parallax');
  if(!box) return;
  const layers = box.querySelectorAll('.layer');
  box.addEventListener('mousemove', (e)=>{
    const r = box.getBoundingClientRect();
    const cx = (e.clientX - r.left)/r.width - 0.5;
    const cy = (e.clientY - r.top)/r.height - 0.5;
    layers.forEach((ly, i)=>{
      const depth = (i+1)/layers.length;
      ly.style.transform = `translate(${cx*20*depth}px, ${cy*20*depth}px)`;
    });
  });
}
window.addEventListener('DOMContentLoaded', parallaxInit);
