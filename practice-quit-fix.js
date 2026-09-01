/* Practice questions return to the topic list instead of leaving a stale quiz view. */
document.addEventListener('click',event=>{
  const button=event.target.closest('#quit');
  if(!button)return;
  event.preventDefault();
  event.stopImmediatePropagation();
  window.page?.('practice');
},true);
