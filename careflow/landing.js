(() => {
const backend = 'https://careflow-lyf6.onrender.com';
let ready = false, running = null, selected = null;
const status = document.createElement('div');
status.setAttribute('role','status');
status.style.cssText='position:fixed;bottom:16px;left:16px;right:16px;z-index:1000;padding:16px;border-radius:14px;background:#163e32;color:white;box-shadow:0 8px 30px #0003;display:none';
document.body.append(status);
function message(text) {status.style.display='block';status.replaceChildren(document.createTextNode(text));}
async function wake() {
 if(ready) return true;
 if(running) return running;
 running=(async()=>{
 const deadline=Date.now()+150000;
 while(Date.now()<deadline) {
 try {
 const response=await fetch(backend+'/api/health',{credentials:'omit',cache:'no-store',signal:AbortSignal.timeout(12000)});
 const data=await response.json();
 if(response.ok&&data.status==='ok') {ready=true;return true;}
 }catch{}
 await new Promise(resolve=>setTimeout(resolve,4000));
 }
 return false;
 })();
 const result=await running;running=null;return result;
}
async function enter(page) {
 selected=page;
 message('CareFlow se connect ho raha hai. Pehli baar thoda samay lag sakta hai…');
 if(await wake()) {location.assign(backend+'/?entry='+encodeURIComponent(selected));return;}
 message('Server abhi ready nahi hai. Kripya dobara koshish karein. ');
 const retry=document.createElement('button');retry.className='primary';retry.textContent='Retry';retry.onclick=()=>enter(selected);status.append(retry);
}
document.addEventListener('click',event=>{
 const nav=event.target.closest('[data-section-nav]');
 if(nav) document.getElementById(nav.dataset.sectionNav)?.scrollIntoView({behavior:'smooth'});
 const button=event.target.closest('[data-public]');if(button) enter(button.dataset.public);
});
const hospitals=document.getElementById('publicHospitals');
if(hospitals) {hospitals.textContent='Browse registered hospitals and doctors in the CareFlow portal. ';const button=document.createElement('button');button.className='primary';button.textContent='Browse hospitals →';button.onclick=()=>enter('home');hospitals.append(button);}
wake();
})();