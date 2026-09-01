document.addEventListener('DOMContentLoaded',async()=>{
  const list=document.querySelector('#signsList');
  if(!list)return;
  let select=document.querySelector('#signCategory');
  if(!select){list.insertAdjacentHTML('beforebegin','<label class="sign-filter">Choose a sign category<select id="signCategory"></select></label>');select=document.querySelector('#signCategory')}
  const filter=select.closest('.sign-filter');
  if(filter)filter.style.cssText='display:flex;flex-direction:column;gap:8px;margin:20px 0 14px;font:700 12px Manrope;color:#526078;letter-spacing:.02em';
  select.style.cssText='width:100%;min-height:48px;padding:0 14px;border:1px solid #cbd3d0;border-radius:12px;background:#fff;color:#0b1426;font:700 14px Manrope;cursor:pointer';
  const search=document.createElement('input');
  search.type='search';search.placeholder='Choose a category to search';search.disabled=true;search.setAttribute('aria-label','Search signs');
  search.style.cssText='width:100%;min-height:46px;margin:0 0 14px;padding:0 14px;border:1px solid #cbd3d0;border-radius:12px;background:#f1f3f2;color:#526078;font:700 14px Manrope';
  filter.after(search);
  const intro=()=>{list.className='sign-catalogue-intro';list.style.cssText='display:block!important;padding:24px;border:1px solid #dce2df;border-radius:18px;background:#fff';list.innerHTML='<h2 style="margin:0 0 10px;font:800 22px Manrope;color:#0b1426">Learn one group at a time</h2><p class="lede" style="margin:0 0 10px">Choose a category above to explore its official UK road signs. Each sign includes its name so you can connect the symbol with what it means on the road.</p><p class="lede" style="margin:0">Once a category is open, use search to quickly find a sign by name.</p>'};
  try{
    const cards=window.SIGN_CATALOGUE||await fetch('./sign-catalogue.json').then(r=>r.ok?r.json():Promise.reject());
    const categories=[...new Set(cards.map(x=>x.category))].sort((a,b)=>a.localeCompare(b));
    select.innerHTML='<option value="">Select a category</option>'+categories.map(x=>`<option value="${x}">${x}</option>`).join('');
    // Always begin at the lightweight guide: opening a group is intentional.
    select.value='';
    localStorage.removeItem('driveable-sign-category');
    const render=()=>{
      const selected=select.value,term=search.value.trim().toLowerCase();
      if(!selected){search.value='';search.disabled=true;search.placeholder='Choose a category to search';search.style.background='#f1f3f2';intro();return}
      search.disabled=false;search.placeholder=`Search ${selected.toLowerCase()}`;search.style.background='#fff';
      const matches=cards.filter(x=>x.category===selected&&(!term||x.name.toLowerCase().includes(term)));
      list.className='sign-catalogue';list.style.cssText='display:grid!important;grid-template-columns:repeat(auto-fill,minmax(210px,1fr));gap:16px';
      list.innerHTML=matches.map(x=>`<article class="sign-card" style="display:flex;flex-direction:column;padding:14px;overflow:hidden"><div class="sign-image" style="height:300px;min-height:300px;padding:14px;display:grid;place-items:center;overflow:hidden;background:#f5f7f6;margin-bottom:8px"><img src="${x.image}" alt="${x.name}" loading="lazy" style="display:block!important;width:auto!important;height:auto!important;max-width:100%!important;max-height:270px!important;object-fit:contain!important"></div><b style="display:block;position:relative;z-index:1;clear:both;margin:0;line-height:1.35;background:#fff">${x.name}</b></article>`).join('')||'<p class="lede">No signs match that search.</p>';
    };
    select.onchange=()=>{localStorage.setItem('driveable-sign-category',select.value);render()};search.oninput=render;render();
  }catch{list.innerHTML='<p class="lede">The individual sign catalogue could not be loaded. Refresh and try again.</p>'}
});
