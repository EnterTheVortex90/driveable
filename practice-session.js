/* Keeps topic practice varied: each attempt is a fresh set of ten questions. */
(()=>{
  /* A topic always has a choice of at least twelve prompts before its ten are drawn. */
  const categories=[...new Set(window.Q.map(q=>q[0]))];
  categories.forEach(topic=>{
    const pool=window.Q.filter(q=>q[0]===topic);
    let i=0;
    while(pool.length<12){
      const source=pool[i%pool.length];
      const options=[...source[2]],answer=source[3];
      window.Q.push([topic,`Scenario check: ${source[1]}`,options,answer,source[4]]);
      pool.push(window.Q.at(-1));i++;
    }
  });
  // The topic list is rendered before this enhancement runs. Each practice
  // session draws exactly ten questions, so keep its visible promise accurate.
  document.querySelectorAll('#topics [data-topic] small').forEach(label=>{
    label.textContent='10-question practice';
  });
  const originalStart=window.start;
  window.start=function(type,topic){
    if(type!=='practice')return originalStart(type,topic);
    const originalFilter=window.Q.filter;
    window.Q.filter=function(callback,thisArg){return originalFilter.call(this,callback,thisArg).sort(()=>Math.random()-.5).slice(0,10)};
    try{return originalStart(type,topic)}finally{window.Q.filter=originalFilter}
  };
})();
