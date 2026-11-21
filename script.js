/* Block 1: theme, scroll effects, counters, typewriter, calculator */
(function(){
document.documentElement.classList.add('js');
var $=function(s){return document.querySelector(s)},A=function(s){return [].slice.call(document.querySelectorAll(s))};
var reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
$('#th').onclick=function(){var r=document.documentElement,d=getComputedStyle(r).getPropertyValue('--bg').trim().toUpperCase()==='#0A1022';r.setAttribute('data-theme',d?'light':'dark')};
var secs=A('main section[id],section[id]'),links=A('nav a.l');
function sc(){var h=document.documentElement,p=h.scrollTop/(h.scrollHeight-h.clientHeight);$('#bar').style.transform='scaleX('+p+')';
var t=$('#tl'),r=t.getBoundingClientRect();t.style.setProperty('--p',Math.max(0,Math.min(1,(innerHeight*.7-r.top)/r.height)));
var cur='';secs.forEach(function(s){if(s.getBoundingClientRect().top<innerHeight*.4)cur=s.id});links.forEach(function(l){l.classList.toggle('on',l.getAttribute('href')==='#'+cur)})}
addEventListener('scroll',sc,{passive:true});sc();
addEventListener('pointermove',function(e){var g=$('#glow');g.style.setProperty('--x',e.clientX+'px');g.style.setProperty('--y',e.clientY+'px')});
A('.bx').forEach(function(b){b.addEventListener('pointermove',function(e){var r=b.getBoundingClientRect();b.style.setProperty('--mx',(e.clientX-r.left)+'px');b.style.setProperty('--my',(e.clientY-r.top)+'px')})});
if(!reduce)A('.btn').forEach(function(b){b.addEventListener('pointermove',function(e){var r=b.getBoundingClientRect();b.style.transform='translate('+((e.clientX-r.left-r.width/2)*.12)+'px,'+((e.clientY-r.top-r.height/2)*.2)+'px)'});b.addEventListener('pointerleave',function(){b.style.transform=''})});
function cnt(el){if(el.done)return;el.done=1;var n=+el.dataset.n,s=el.dataset.s,t0=null;function f(t){if(!t0)t0=t;var p=Math.min((t-t0)/1500,1);el.textContent=Math.round(n*(1-Math.pow(1-p,3)))+s;if(p<1)requestAnimationFrame(f)}reduce?el.textContent=n+s:requestAnimationFrame(f)}
var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');A('[data-n]').forEach(function(x){if(e.target.contains(x))cnt(x)});io.unobserve(e.target)}})},{threshold:.15});
A('.rv').forEach(function(x){io.observe(x)});
setTimeout(function(){A('.hero [data-n]').forEach(cnt)},500);
var W=['SEO','Meta Ads','social media','local searches'],wi=0,ci=0,del=false,tw=$('#tw');
function type(){var w=W[wi];ci+=del?-1:1;tw.textContent=w.slice(0,ci)||'\u200b';var d=del?45:95;if(!del&&ci===w.length){del=true;d=1400}else if(del&&ci===0){del=false;wi=(wi+1)%W.length;d=300}setTimeout(type,d)}
reduce?tw.textContent='SEO':type();
function calc(){var b=+$('#bs').value,c=+$('#cs').value;$('#bv').textContent='₹'+b.toLocaleString('en-IN');$('#cv').textContent='₹'+c;$('#lv').textContent=Math.round(b/c).toLocaleString('en-IN')}
$('#bs').oninput=calc;$('#cs').oninput=calc;calc();
})();

/* Block 2: skills tabs and About read-more */
(function(){
var S=[{n:'SEO',d:'Helping a website get found for the searches its customers make.',t:['On-page SEO','Off-page SEO','Technical SEO','Local SEO','Keyword Research','Backlink Building']},
{n:'Meta Ads',d:'Facebook and Instagram campaigns built to bring in enquiries.',t:['Campaign Setup','Audience Targeting','Instant Forms','Lead Generation','Budget Management','Performance Analysis']},
{n:'Social Media Marketing',d:'Planning and managing the pages where audiences meet the brand.',t:['Instagram','Facebook','LinkedIn','Content Planning','Page Management']},
{n:'Creative & Web',d:'Promotional creatives and website updates that support campaigns.',t:['Canva','Photoshop','Premiere Pro','WordPress','Elementor']}];
var tb=document.getElementById('tabs'),pn=document.getElementById('pan');
S.forEach(function(c,i){var b=document.createElement('button');b.type='button';b.className='tb';b.setAttribute('role','tab');b.id='tab'+i;b.setAttribute('aria-controls','pan');b.textContent=c.n;b.onclick=function(){pick(i)};tb.appendChild(b)});
function pick(i,f){[].forEach.call(tb.children,function(b,j){b.setAttribute('aria-selected',i===j);b.tabIndex=i===j?0:-1});var c=S[i];pn.setAttribute('aria-labelledby','tab'+i);pn.innerHTML='<div class="sw"><h3>'+c.n+'</h3><p>'+c.d+'</p><div class="tags">'+c.t.map(function(x){return '<span>'+x+'</span>'}).join('')+'</div></div>';if(f)tb.children[i].focus()}
tb.onkeydown=function(e){var i=[].findIndex.call(tb.children,function(b){return b.tabIndex===0}),n=S.length;if(e.key==='ArrowRight'||e.key==='ArrowDown')i=(i+1)%n;else if(e.key==='ArrowLeft'||e.key==='ArrowUp')i=(i+n-1)%n;else if(e.key==='Home')i=0;else if(e.key==='End')i=n-1;else return;e.preventDefault();pick(i,1)};
pick(0);
var rm=document.getElementById('rm');rm.onclick=function(){var o=document.getElementById('more').classList.toggle('o');rm.textContent=o?'Read less':'Read more';rm.setAttribute('aria-expanded',o)};
})();
