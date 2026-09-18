/** Scroll reveals, driven by a script rather than a client component.
 *
 * Runs after the page is interactive, and only ever hides elements that are
 * already below the fold. That ordering is the whole point: nothing is hidden
 * until the code that reveals it is running, so a JS failure leaves the page
 * fully readable instead of blank — which is what happened when this logic
 * lived in a React effect and hydration did not complete.
 *
 * Mutating after hydration also keeps the server and client markup identical,
 * so React has nothing to mismatch on.
 */
export const revealScript = `(function(){
  var d=document,PENDING='reveal-pending',SHOWN='data-shown';
  if(!('IntersectionObserver' in window))return;
  try{if(matchMedia('(prefers-reduced-motion: reduce)').matches)return}catch(e){}
  function reveal(el){el.setAttribute(SHOWN,'true')}
  var io=new IntersectionObserver(function(entries){
    entries.forEach(function(en){
      if(en.isIntersecting){reveal(en.target);io.unobserve(en.target)}
    })
  },{rootMargin:'0px 0px -8% 0px',threshold:0.05});
  function scan(){
    var groups=new Map();
    d.querySelectorAll('.reveal:not(.'+PENDING+'):not(['+SHOWN+'])').forEach(function(el){
      if(el.getBoundingClientRect().top<innerHeight*0.9)return;
      var key=el.parentElement||d.body,n=groups.get(key)||0;
      groups.set(key,n+1);
      el.style.setProperty('--reveal-delay',Math.min(n,5)*80+'ms');
      el.classList.add(PENDING);
      io.observe(el);
    })
  }
  scan();
  new MutationObserver(scan).observe(d.body,{childList:true,subtree:true});
  addEventListener('pageshow',scan);
  setInterval(function(){
    d.querySelectorAll('.'+PENDING+':not(['+SHOWN+'])').forEach(function(el){
      if(el.getBoundingClientRect().top<innerHeight)reveal(el)
    })
  },1500);
})();`
