(function(){
'use strict';

// ----- Config -----
const TILE=32, VIEW_W=20, VIEW_H=12; // tiles per view (canvas 640x384)
const SAVE_K="nglq_save_v01", XP_K="ngl_xp";

// ----- State -----
let state = load() || { px:5, py:5, hp:10, bag:{sticks:0, coins:0}, xp:0, t:0 };
let keys={}, paused=false;

// ----- Map (0 floor, 1 wall). Simple 40x24 tilemap.
const W=40, H=24;
const map = new Array(W*H).fill(0).map((v,i)=> {
  const x=i%W, y=(i/W)|0;
  // Border walls
  if(x===0||y===0||x===W-1||y===H-1) return 1;
  // A hut in the middle
  if(x>17&&x<23&&y>9&&y<15) return 1;
  return 0;
});

// ----- DOM -----
const c = document.getElementById('game');
const ctx = c.getContext('2d');
const hpEl = document.getElementById('hp');
const xpEl = document.getElementById('xp');
const bagEl= document.getElementById('bag');
const resetBtn=document.getElementById('reset');
const pauseDlg=document.getElementById('pause');
const resumeBtn=document.getElementById('resume');
const touch=document.getElementById('touch');

// ----- Helpers -----
function save(){ try{ localStorage.setItem(SAVE_K, JSON.stringify(state)); }catch(e){} }
function load(){ try{ return JSON.parse(localStorage.getItem(SAVE_K)||" "); }catch(e){ return null; } }
function bumpXP(){ try{ const v=parseInt(localStorage.getItem(XP_K)||"0",10)+1; localStorage.setItem(XP_K,String(v)); }catch(e){} }

// ----- Input -----
window.addEventListener('keydown',e=>{
  if(e.key==='Escape'){ paused=!paused; togglePause(); return; }
  keys[e.key.toLowerCase()]=true;
});
window.addEventListener('keyup',e=>{ keys[e.key.toLowerCase()]=false; });

touch.addEventListener('click',e=>{
  const d=e.target.getAttribute('data-dpad'); if(!d) return;
  if(d==='interact') interact(); else move(d);
});

resetBtn.addEventListener('click',()=>{ state={px:5,py:5,hp:10,bag:{sticks:0,coins:0},xp:0,t:0}; save(); });
resumeBtn.addEventListener('click',()=>{ paused=false; togglePause(); });

function togglePause(){ if(paused) pauseDlg.showModal(); else pauseDlg.close(); }

// ----- Game actions -----
function canWalk(nx,ny){ return nx>0 && ny>0 && nx<W-1 && ny<H-1 && tile(nx,ny)===0; }
function tile(x,y){ return map[y*W+x]; }
function move(dir){
  let dx=0, dy=0;
  if(dir==='left'||keys['a']||keys['arrowleft']) dx=-1;
  if(dir==='right'||keys['d']||keys['arrowright']) dx=1;
  if(dir==='up'||keys['w']||keys['arrowup']) dy=-1;
  if(dir==='down'||keys['s']||keys['arrowdown']) dy=1;
  const nx=state.px+dx, ny=state.py+dy;
  if(dx||dy){ if(canWalk(nx,ny)){ state.px=nx; state.py=ny; } }
}
function interact(){
  // Simple NPC near hut door
  if(Math.abs(state.px-17)<=1 && Math.abs(state.py-9)<=1){
    alert("Villager: Need a stick? Check the trees outside the hut.");
    return;
  }
  // Pick up stick tile (place some virtual \"trees\")
  if(state.py===3 && (state.px===3 || state.px===W-4)){
    state.bag.sticks++; save();
  }
}

function update(dt){
  state.t += dt;
  if(keys['a']||keys['arrowleft']) move('left');
  if(keys['d']||keys['arrowright']) move('right');
  if(keys['w']||keys['arrowup']) move('up');
  if(keys['s']||keys['arrowdown']) move('down');
  if(keys['e']) { interact(); keys['e']=false; }
  if(state.t>=60){ state.t=0; state.xp++; bumpXP(); save(); }
}

function draw(){
  const cx=Math.max(0, Math.min(state.px - (VIEW_W>>1), W - VIEW_W));
  const cy=Math.max(0, Math.min(state.py - (VIEW_H>>1), H - VIEW_H));
  ctx.fillStyle='#0b0b0c'; ctx.fillRect(0,0,c.width,c.height);
  for(let ty=0;ty<VIEW_H;ty++){
    for(let tx=0;tx<VIEW_W;tx++){
      const mx=cx+tx, my=cy+ty, t=tile(mx,my);
      const x=tx*TILE, y=ty*TILE;
      if(t===1){ ctx.fillStyle='#24303a'; } else { ctx.fillStyle='#1a1f24'; }
      ctx.fillRect(x,y,TILE,TILE);
      if(my===3 && (mx===3||mx===W-4)){ ctx.fillStyle='#3fa34d'; ctx.fillRect(x+8,y+8,16,16); }
    }
  }
  // NPC marker near hut (tile 17,9)
  ctx.fillStyle = '#c8a063';
  ctx.fillRect((17-cx)*TILE+8,(9-cy)*TILE+8,16,16);

  // Player
  ctx.fillStyle='#62d0ff';
  ctx.fillRect((state.px-cx)*TILE+6,(state.py-cy)*TILE+6,20,20);

  // HUD text hint when near NPC
  if(Math.abs(state.px-17)<=1 && Math.abs(state.py-9)<=1){
    ctx.fillStyle='#ffffff';
    ctx.font='12px ui-monospace, Menlo, Consolas, monospace';
    ctx.fillText('Press E to talk', (state.px-cx)*TILE-10,(state.py-cy)*TILE-6);
  }
}

function resize(){
  // Keep 32:19-ish aspect by scaling CSS only
  const scale = Math.min(window.innerWidth/640, 480/384, 1);
  c.style.width = (640*scale)+'px';
  c.style.height = (384*scale)+'px';
}
window.addEventListener('resize', resize); resize();

// Main loop
let last=performance.now();
function loop(t){
  const dt=(t-last)/1000; last=t;
  if(!paused){ update(dt); draw(); }
  // UI
  hpEl.textContent = state.hp;
  xpEl.textContent = state.xp;
  bagEl.textContent = 'sticks:'+state.bag.sticks+', coins:'+state.bag.coins;
  requestAnimationFrame(loop);
}
togglePause(); paused=false; // ensure dialog closed
requestAnimationFrame(loop);
})();
