/* Prevent retired hazard controls in the original quiz script from interrupting app setup. */
['spot','hazardText','results'].forEach(id=>{
  if(document.getElementById(id))return;
  const element=document.createElement(id==='hazardText'?'strong':'button');
  element.id=id;element.hidden=true;document.body.append(element);
});
