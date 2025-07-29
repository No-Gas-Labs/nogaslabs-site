(function(){
  const el=document.querySelector("#xp"); if(!el) return;
  const k="ngl_xp"; let xp=parseInt(localStorage.getItem(k)||"0",10);
  const bump=()=>{ xp+=1; localStorage.setItem(k,String(xp)); el.textContent=xp; };
  bump(); setInterval(bump,5000);
})();

(function(){
  const cur=location.pathname.replace(/index\.html$/,"");
  document.querySelectorAll('.nav a').forEach(a=>{
    const path=new URL(a.getAttribute('href'),location).pathname.replace(/index\.html$/,'');
    if(path===cur){a.setAttribute('aria-current','page');}
  });
})();

(function(){
  const nav=document.querySelector('.nav');
  if(nav && !document.querySelector('.donate-link')){
    const a=document.createElement('a');
    a.href='/support/';
    a.textContent='Donate';
    a.className='donate-link';
    nav.appendChild(a);
  }
})();

window.nglTrack=function(event,data){
  console.log('track',event,data);
};
