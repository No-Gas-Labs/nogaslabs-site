(function(){
  const el=document.querySelector("#xp"); if(!el) return;
  const k="ngl_xp"; let xp=parseInt(localStorage.getItem(k)||"0",10);
  const bump=()=>{ xp+=1; localStorage.setItem(k,String(xp)); el.textContent=xp; };
  bump(); setInterval(bump,5000);
})();
