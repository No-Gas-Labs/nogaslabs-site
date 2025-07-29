/* Supabase client bootstrap (edit URL/KEY below or define window.NGL_SUPABASE_URL/ANON_KEY before this file) */
(function(){
  const url  = window.NGL_SUPABASE_URL  || "https://YOUR-PROJECT.supabase.co";
  const anon = window.NGL_SUPABASE_ANON_KEY || "YOUR-ANON-KEY";
  if(!window.supabase){ console.error("Supabase JS not loaded"); return; }
  window.SB = window.supabase.createClient(url, anon);
  window.sbGetSession = async ()=> (await SB.auth.getSession()).data.session;
  window.sbSignIn = async (email)=> SB.auth.signInWithOtp({ email, options:{ emailRedirectTo: location.href }});
  window.sbSignOut = async ()=> SB.auth.signOut();
})();
