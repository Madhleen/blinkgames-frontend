
const canvas = document.getElementById('pacman-bg');
if(canvas){
  const ctx = canvas.getContext('2d');
  let w,h, dots=[], t=0;
  function resize(){ w=canvas.width=window.innerWidth; h=300; dots = Array.from({length: 60}, (_,i)=>({x:(i* w/60), y: h-30, r:2})) }
  resize(); window.addEventListener('resize', resize);
  function draw(){
    ctx.clearRect(0,0,w,h);
    ctx.fillStyle='#0b0520'; ctx.fillRect(0,0,w,h);
    ctx.strokeStyle='rgba(0,224,255,.12)';
    for(let y=0;y<h;y+=24){ ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(w,y); ctx.stroke(); }
    ctx.fillStyle='#00e0ff'; dots.forEach(d=>{ ctx.beginPath(); ctx.arc(d.x, d.y, d.r, 0, Math.PI*2); ctx.fill(); });
    const px = (t*2) % (w+60) - 30; const py = h-30;
    const mouth = Math.abs(Math.sin(t*.2))*0.6 + 0.2;
    ctx.fillStyle='#ffde59'; ctx.beginPath(); ctx.moveTo(px,py); ctx.arc(px,py,18, mouth, Math.PI*2 - mouth, false); ctx.closePath(); ctx.fill();
    t+=1; requestAnimationFrame(draw);
  }
  draw();
}
