// Relic tracker
console.log('// Relic Uncovered: #SHARD-Ω43-UNSEEN');

// Mobile menu toggle
(function(){
  const btn=document.getElementById('menu-toggle');
  const menu=document.getElementById('menu');
  if(btn && menu){
    btn.addEventListener('click',()=>menu.classList.toggle('hidden'));
  }
})();

// Quote rotation
(function(){
  const quotes=[
    'Gas is a lie. Gas is a leash. We cut it.',
    'Build loops that free people.',
    'All gas has been eliminated.'
  ];
  const el=document.getElementById('quote');
  if(el){ el.textContent=quotes[Math.floor(Math.random()*quotes.length)]; }
})();

// Dark mode toggle
(function(){
  const btn=document.getElementById('dark-toggle');
  if(!btn) return;
  const html=document.documentElement;
  const stored=localStorage.getItem('ngl_dark');
  if(stored==='false') html.classList.remove('dark');
  btn.addEventListener('click',()=>{
    html.classList.toggle('dark');
    localStorage.setItem('ngl_dark', html.classList.contains('dark'));
  });
})();

// Campaign mode toggle
(function(){
  const btn=document.getElementById('campaign-toggle');
  if(!btn) return;
  const style=document.createElement('style');
  style.textContent=`body.campaign{background:#fff;color:#111}
body.campaign header{background:#b91c1c;color:#fff}
body.campaign header nav a{color:#fff}
body.campaign header::after{content:"Featherstone 2028";display:block;text-align:center;font-weight:bold}`;
  document.head.appendChild(style);
  btn.addEventListener('click',()=>{
    document.body.classList.toggle('campaign');
  });
})();
