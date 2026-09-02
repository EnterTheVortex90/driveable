document.addEventListener('DOMContentLoaded',()=>{
  const $=s=>document.querySelector(s), $$=s=>document.querySelectorAll(s), originalQuiz=$('#quiz').innerHTML;
  let test=null,ticker=null;
  const show=id=>{$$('.page').forEach(x=>x.classList.remove('active'));$('#'+id).classList.add('active');scrollTo(0,0)};
  const restore=()=>{clearInterval(ticker);document.body.classList.remove('mock-active','mock-review');if(!$('#questionCard'))$('#quiz').innerHTML=originalQuiz};
  const clock=()=>`${Math.floor(test.left/60)}:${String(test.left%60).padStart(2,'0')}`;
  function start(){
    document.body.classList.add('mock-active');
    const groups=new Map();window.Q.forEach(q=>{const key=`${q[0]}|${q[2][q[3]].toLowerCase().replace(/[^a-z0-9]/g,'')}`;if(!groups.has(key))groups.set(key,[]);groups.get(key).push(q)});
    const pool=[...groups.values()].map(group=>group[Math.floor(Math.random()*group.length)]).sort(()=>Math.random()-.5).slice(0,50).map(q=>({q,opts:q[2].map((text,i)=>({text,correct:i===q[3]})).sort(()=>Math.random()-.5)}));
    test={pool,answers:Array(50).fill(null),flags:new Set(),at:0,left:3420,flagReview:false};show('quiz');clearInterval(ticker);ticker=setInterval(()=>{if(test.left>0){test.left--;const timer=$('#mockTimer');if(timer){timer.textContent=clock();timer.classList.toggle('danger',test.left<300)}}else endTest()},1000);render();
  }
  function shell(content){$('#quiz').innerHTML=`<div class="mock-banner"><button id="mockQuit">× Exit</button><span id="mockTimer">${clock()}</span><span>Question ${test.at+1} of 50</span></div><div class="track"><i style="width:${test.at/50*100}%"></i></div>${content}`;$('#mockQuit').onclick=()=>{if(confirm('Leave this mock test? Your answers will be discarded.')){restore();show('home')}}}
  function render(){
    document.body.classList.remove('mock-review');
    const item=test.pool[test.at],answer=test.answers[test.at],flag=test.flags.has(test.at),canAdvance=answer!==null||flag;
    shell(`<article class="question official-question"><div class="mock-tools"><span class="tag">${item.q[0].toUpperCase()}</span><span class="question-label">${flag&&answer===null?'Flagged — answer later':'Select one answer'}</span></div><h2>${item.q[1]}</h2><fieldset class="radio-answers"><legend class="sr-only">Answer choices</legend>${item.opts.map((o,i)=>`<label class="radio-row ${answer===i?'chosen':''}"><input type="radio" name="mock-answer" value="${i}" ${answer===i?'checked':''}><span class="radio-dot"></span><b>${'ABCD'[i]}</b><span>${o.text}</span></label>`).join('')}</fieldset></article><nav class="test-controls"><button id="previous" ${test.at===0?'disabled':''}>← Previous</button><button id="flag" class="${flag?'flagged':''}">${flag?'★ Flagged':'☆ Flag'}</button><button id="review">Review</button><button id="endTest" class="end">End test</button><button id="nextMock" ${canAdvance?'':'disabled'}>${test.flagReview?'Next flagged →':test.at===49?'Finish →':'Next →'}</button></nav>`);
    $$('.radio-row').forEach(row=>row.onclick=()=>{test.answers[test.at]=+row.querySelector('input').value;render()});
    $('#previous').onclick=()=>{test.at--;render()};$('#nextMock').onclick=advance;$('#flag').onclick=()=>{flag?test.flags.delete(test.at):test.flags.add(test.at);render()};$('#review').onclick=review;$('#endTest').onclick=endTest;
  }
  function advance(){
    if(test.flagReview){const pending=[...test.flags].filter(i=>test.answers[i]===null&&i>test.at);if(pending.length){test.at=pending[0];render()}else{test.flagReview=false;review()}return}
    if(test.at<49){test.at++;render();return}
    const pending=[...test.flags].filter(i=>test.answers[i]===null);if(pending.length){test.flagReview=true;test.at=pending[0];render()}else review();
  }
  function review(){
    document.body.classList.add('mock-review');
    const unanswered=test.answers.filter(x=>x===null).length;
    shell(`<article class="question review-card"><div class="mock-tools"><span class="tag">REVIEW QUESTIONS</span><span>${50-unanswered}/50 answered</span></div><h2>${unanswered?'Check your answers before continuing.':'All questions answered — ready to submit.'}</h2><div class="review-grid">${test.pool.map((_,i)=>`<button data-go="${i}" class="${test.flags.has(i)?'flagged':''} ${test.answers[i]===null?'empty':'answered'}">${i+1}${test.flags.has(i)?'<i>⚑</i>':''}</button>`).join('')}</div><div class="review-actions"><button id="returnTest">Return to test</button><button id="submitMock" class="cta">Submit theory mock →</button></div></article>`);
    $$('[data-go]').forEach(b=>b.onclick=()=>{test.at=+b.dataset.go;render()});$('#returnTest').onclick=render;$('#submitMock').onclick=finishTheory;
  }
  function endTest(){if(!confirm('End the test and submit your current answers? You cannot change them afterwards.'))return;finishTheory()}
  function finishTheory(){clearInterval(ticker);const score=test.pool.reduce((n,item,i)=>n+(test.answers[i]!==null&&item.opts[test.answers[i]].correct?1:0),0),weak={},misses=[];test.pool.forEach((item,i)=>{if(test.answers[i]===null||!item.opts[test.answers[i]].correct){weak[item.q[0]]=(weak[item.q[0]]||0)+1;misses.push({topic:item.q[0],question:item.q[1],answer:test.answers[i]===null?'No answer':item.opts[test.answers[i]].text,correct:item.opts.find(x=>x.correct).text,explain:item.q[4]})}});window.driveableMockAnalysis=Object.entries(weak).sort((a,b)=>b[1]-a[1]);window.driveableMockMisses=misses;showResult(score,null)}
  function showResult(score,hazard){restore();const pass=score>=43;$('#resultTitle').textContent=pass?'You passed the theory mock':'Not quite this time';$('#resultText').textContent=pass?'You reached the 43/50 theory pass standard. Review your flagged questions and any weaker topics.':'You need 43 correct answers out of 50. Review the areas that felt hardest, then take another mock.';$('#theoryScore').textContent=score+'/50';$('#hazardScore').parentElement.style.display=hazard===null?'none':'';if(hazard!==null){$('#hazardScore').textContent=hazard+'/75';$('#hazardScore').parentElement.style.display=''}$('#resultBadge').textContent=pass?'✓':'↗';show('result');const saved=JSON.parse(localStorage.driveable||'{"answered":0,"correct":0,"records":[]}');saved.records.unshift({score,hazard:hazard===null?'—':hazard,date:new Date().toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'})});localStorage.driveable=JSON.stringify(saved)}
  document.addEventListener('click',e=>{const b=e.target.closest('#beginMock');if(!b)return;e.preventDefault();e.stopImmediatePropagation();start()},true);
});
