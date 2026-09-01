document.addEventListener('click',event=>{
  const button=event.target.closest('[data-page]');
  if(button&&button.dataset.page)sessionStorage.setItem('driveable-page',button.dataset.page);
},true);
document.addEventListener('DOMContentLoaded',()=>{
  const saved=sessionStorage.getItem('driveable-page');
  if(!saved)return;
  if(typeof window.page==='function')window.page(saved);
  else{document.querySelectorAll('.page').forEach(x=>x.classList.toggle('active',x.id===saved))}
});
