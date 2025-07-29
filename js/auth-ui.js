(function(){
  const tpl = `
<dialog id="authbox">
  <form method="dialog">
    <h3>Sign in to sync</h3>
    <p><label>Email<br><input id="auth_email" type="email" required></label></p>
    <menu>
      <button id="auth_send" value="ok">Send magic link</button>
      <button id="auth_cancel">Cancel</button>
    </menu>
    <p id="auth_msg" style="color:#bdbdbd;font-size:.9rem"></p>
  </form>
</dialog>`;
  function mount(){
    if(document.getElementById('authbox')) return;
    const wrap=document.createElement('div'); wrap.innerHTML=tpl;
    document.body.appendChild(wrap);
    const dlg=document.getElementById('authbox');
    const send=document.getElementById('auth_send');
    const cancel=document.getElementById('auth_cancel');
    const email=document.getElementById('auth_email');
    const msg=document.getElementById('auth_msg');
    window.openAuth=()=>{ dlg.showModal(); };
    cancel?.addEventListener('click',()=>dlg.close());
    send?.addEventListener('click', async (e)=>{
      e.preventDefault();
      try{
        const em=email.value.trim();
        if(!em) return;
        msg.textContent="Sending… check your email";
        await window.sbSignIn(em);
        msg.textContent="Link sent. Open it on this device to finish sign-in.";
      }catch(err){ msg.textContent="Error: "+(err?.message||err); }
    });
  }
  document.addEventListener('DOMContentLoaded', mount);
})();
