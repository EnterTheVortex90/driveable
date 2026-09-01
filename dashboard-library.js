document.addEventListener('DOMContentLoaded',()=>{
  const route=document.querySelectorAll('.routes button')[2];
  if(route){route.dataset.page='learn';route.innerHTML='<i class="green">⌘</i><b>Highway Code</b><span>Build safer road knowledge</span><strong>→</strong>'}
  const learn=document.querySelector('#learn .learn');
  if(learn)learn.innerHTML=`<article><b>01</b><h2>Multiple choice</h2><p>Practise observation, signs, rules, safety margins, vehicle checks and decisions at junctions. A strong answer gives you time, space and the safest outcome.</p></article><article><b>02</b><h2>Hazard perception</h2><p>Look well ahead for situations that may require a change of speed or direction. Scan pavements, side roads, parked vehicles and the behaviour of other road users.</p></article><article><b>03</b><h2>Highway Code essentials</h2><p>The Code covers road signs and markings, signals, speed, overtaking, junctions, parking, motorway driving, road works and vehicle condition. Check the live Highway Code for current legal wording.</p><a href="https://www.gov.uk/guidance/the-highway-code" target="_blank" rel="noreferrer">Read the current Highway Code →</a></article>`;
});
