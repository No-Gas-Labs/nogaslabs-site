(async function(){
  const sess = await (window.sbGetSession? window.sbGetSession(): null);
  const isAdmin = !!(sess?.user?.user_metadata?.is_admin || sess?.user?.app_metadata?.role==="admin");
  if(!isAdmin){ document.body.innerHTML="<main class='wrap'><h1>403</h1><p>Admins only.</p></main>"; return; }

  const npcList=document.getElementById('npc_list');
  const npcReload=document.getElementById('npc_reload');
  const npcNew=document.getElementById('npc_new');
  const flagList=document.getElementById('flag_list');
  const flagReload=document.getElementById('flag_reload');
  const flagSet=document.getElementById('flag_set');

  async function loadNPCs(){
    const { data, error } = await SB.from('npcs').select('*').order('id');
    npcList.textContent = error ? ("ERR "+error.message) : JSON.stringify(data,null,2);
  }
  async function addNPC(){
    const slug=prompt("slug (unique, e.g., villager-1):"); if(!slug) return;
    const name=prompt("name:", "Villager"); if(!name) return;
    const dialog=prompt("dialog (single line):", "Hello, traveler!"); 
    const posx=+prompt("x:", "10"), posy=+prompt("y:", "10");
    const { error } = await SB.from('npcs').insert({ slug,name,dialogue:{lines:[dialog]}, pos:{x:posx,y:posy}, active:true });
    if(error) alert("ERR "+error.message); else loadNPCs();
  }
  async function loadFlags(){
    const { data, error } = await SB.from('world_flags').select('*').order('key');
    flagList.textContent = error ? ("ERR "+error.message) : JSON.stringify(data,null,2);
  }
  async function setFlag(){
    const key=prompt("flag key:", "demo_opened"); if(!key) return;
    const val=prompt("flag value (string):","true"); 
    const { error } = await SB.from('world_flags').upsert({ key, value:{val} });
    if(error) alert("ERR "+error.message); else loadFlags();
  }

  npcReload?.addEventListener('click', loadNPCs);
  npcNew?.addEventListener('click', addNPC);
  flagReload?.addEventListener('click', loadFlags);
  flagSet?.addEventListener('click', setFlag);

  loadNPCs(); loadFlags();
})();
