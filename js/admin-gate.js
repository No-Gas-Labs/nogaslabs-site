/* Displays admin-only nav link and protects /admin */
(async function(){
  const sess = await (window.sbGetSession ? window.sbGetSession() : Promise.resolve(null));
  const claim = sess?.user?.user_metadata?.is_admin || sess?.user?.app_metadata?.role==="admin";
  if(location.pathname.match(/\/admin\/?$/)){
    if(!sess){ location.href = "/nogaslabs-site/admin/signin.html"; return; }
    if(!claim){ document.body.innerHTML="<main class='wrap'><h1>403</h1><p>Admins only.</p></main>"; return; }
  } else {
    if(claim){
      document.querySelectorAll("nav.nav").forEach(nav=>{
        if(nav.innerHTML.includes(">Admin<")) return;
        const a=document.createElement("a"); a.href="/nogaslabs-site/admin/"; a.textContent="Admin";
        nav.appendChild(a);
      });
    }
  }
})();
