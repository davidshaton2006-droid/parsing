/* AutoMediaStudio — independently accessible enhancement.
   Native HTML dialogs, functional four-step draft request, no backend. */
(()=>{'use strict';
const d=document,$=(selector,scope=d)=>scope.querySelector(selector),$$=(selector,scope=d)=>Array.from(scope.querySelectorAll(selector));
const header=$('[data-header]'),nav=$('[data-nav]'),toggle=$('[data-toggle]');
function onScroll(){header?.classList.toggle('is-scrolled',scrollY>30);}addEventListener('scroll',onScroll,{passive:true});onScroll();
function closeMenu(){nav?.classList.remove('show');toggle?.setAttribute('aria-expanded','false');if(toggle){toggle.textContent='☰';toggle.setAttribute('aria-label','Открыть меню');}}
toggle?.addEventListener('click',()=>{const open=nav?.classList.toggle('show');toggle.setAttribute('aria-expanded',String(!!open));toggle.textContent=open?'×':'☰';toggle.setAttribute('aria-label',open?'Закрыть меню':'Открыть меню');});
$$('.nav a').forEach(a=>a.addEventListener('click',closeMenu));
d.addEventListener('keydown',e=>{if(e.key==='Escape'&&nav?.classList.contains('show'))closeMenu();});
const knownGood='./assets/tech-fallback.svg';
$$('img[data-fallback]').forEach(img=>{
 function fallback(){if(img.dataset.fallbackDone)return;img.dataset.fallbackDone='1';img.src=img.dataset.fallback||knownGood;img.alt='Иллюстрация проекта AMS: исходное изображение временно недоступно';const gallery=img.closest('.gallery-item');if(gallery){const cap=gallery.querySelector('span');if(cap)cap.textContent='Иллюстрация / фото временно недоступно';gallery.dataset.caption='Концептуальная иллюстрация студии';}const proj=img.closest('.project-card');if(proj){const label=proj.querySelector('.project-info>small');if(label)label.textContent='Концептуальный визуал · ссылка ведёт к подтверждённому проекту';}if(img.closest('.intro-photo')){const label=document.querySelector('.intro-photo-caption');if(label)label.textContent='Концептуальная иллюстрация / фото студии недоступно';}if(img.closest('.hero-image')){const label=document.querySelector('.hero-photo-label');if(label)label.textContent='Концептуальная иллюстрация · исходное фото недоступно';}}
 img.addEventListener('error',fallback);if(img.complete&&!img.naturalWidth)fallback();
});
const filters=$$('[data-filter]'),serviceCards=$$('[data-category]');
filters.forEach(b=>b.addEventListener('click',()=>{
 filters.forEach(x=>x.setAttribute('aria-pressed',String(x===b)));
 const v=b.dataset.filter;serviceCards.forEach(x=>{x.hidden=v!=='all'&&x.dataset.category!==v;});
}));
/* Native dialog form - no invented bookings or storage */
const wizard=$('[data-wizard]'),form=$('[data-form]'),stepFields=$$('[data-step]'),stepMarkers=$$('[data-step-marker]'),
 stepLabel=$('[data-step-label]'),prev=$('[data-prev]'),next=$('[data-next]'),submit=$('[data-submit]'),
 finish=$('[data-finish]'),copyPreview=$('[data-copy-preview]'),error=$('[data-error]'),feedback=$('[data-feedback]');
let step=0,requestText='',lastFocus=null;
function selectService(value){
 if(!value||!form)return;
 const radio=$$('input[name="service"]',form).find(x=>x.value===value);
 if(radio)radio.checked=true;
}
function renderStep(focus=false){
 stepFields.forEach((el,i)=>el.hidden=i!==step);
 stepMarkers.forEach((el,i)=>{el.classList.toggle('active',i===step);el.classList.toggle('done',i<step);});
 if(stepLabel)stepLabel.textContent='ШАГ '+String(step+1).padStart(2,'0')+' / 04';
 prev.hidden=step===0;next.hidden=step===3;submit.hidden=step!==3;
 error.textContent='';if(step===3)renderSummary();
 if(focus){const first=stepFields[step]?.querySelector('input:not([type="radio"]),textarea,select');requestAnimationFrame(()=>first?.focus({preventScroll:true}));}
}
function openWizard(selected=''){
 if(!wizard||!form)return;
 lastFocus=d.activeElement;
 form.reset();step=0;finish.hidden=true;form.hidden=false;requestText='';
 selectService(selected);renderStep();wizard.showModal();
 requestAnimationFrame(()=>$('input[name="service"]:checked',form)?.focus({preventScroll:true}));
}
$$('[data-start]').forEach(b=>b.addEventListener('click',()=>openWizard(b.dataset.service||'')));
$('[data-close]')?.addEventListener('click',()=>wizard?.close());
wizard?.addEventListener('close',()=>lastFocus?.focus?.({preventScroll:true}));
function showError(message,el){error.textContent=message;el?.focus();return false;}
const field=(selector)=>$(selector,form)?.value.trim()||'';
function validStep(){
 if(step===0)return Boolean($('input[name="service"]:checked',form))||showError('Выберите направление.');
 if(step===1){
  if(field('[data-brand]').length<2)return showError('Укажите марку автомобиля.',$('[data-brand]'));
  if(field('[data-model]').length<2)return showError('Укажите модель автомобиля.',$('[data-model]'));
  const year=field('[data-year]');
  if(year&&(Number(year)<1980||Number(year)>2027))return showError('Проверьте год выпуска.',$('[data-year]'));
  return true;
 }
 if(step===2)return field('[data-details]').length>=8||showError('Опишите задачу хотя бы восемью символами.',$('[data-details]'));
 if(step===3){
  if(field('[data-name]').length<2)return showError('Введите имя.',$('[data-name]'));
  const phone=field('[data-phone]');if(phone&&phone.replace(/\D/g,'').length<10)return showError('Укажите полный номер телефона или оставьте поле пустым.',$('[data-phone]'));
  return true;
 }
 return true;
}
next?.addEventListener('click',()=>{if(!validStep())return;step=Math.min(step+1,3);renderStep(true);});
prev?.addEventListener('click',()=>{step=Math.max(0,step-1);renderStep(true);});
function info(){return {service:$('input[name="service"]:checked',form)?.value||'Консультация',brand:field('[data-brand]'),model:field('[data-model]'),year:field('[data-year]'),details:field('[data-details]'),when:field('[data-when]')||'По согласованию',name:field('[data-name]'),phone:field('[data-phone]')};}
function renderSummary(){const s=$('[data-summary]'),v=info();if(!s)return;s.replaceChildren();const head=d.createElement('b');head.textContent='Ваш запрос';s.append(head);[v.service,[v.brand,v.model,v.year].filter(Boolean).join(' · '),v.details].filter(Boolean).forEach(t=>{const x=d.createElement('span');x.textContent=t;s.append(x);});}
function buildText(){const v=info();return ['Здравствуйте! Хочу проконсультироваться по установке дополнительного оборудования в АвтоМедиаСтудии.','Направление: '+v.service,'Автомобиль: '+[v.brand,v.model,v.year].filter(Boolean).join(', '),'Задача: '+v.details,'Удобный срок: '+v.when,'Имя: '+v.name,v.phone?'Телефон: '+v.phone:null,'Подскажите, пожалуйста, совместимость, стоимость оборудования и установки.'].filter(Boolean).join('\n');}
form?.addEventListener('submit',e=>{
 e.preventDefault();if(!validStep())return;
 requestText=buildText();copyPreview.value=requestText;form.hidden=true;finish.hidden=false;
 if(feedback)feedback.textContent='';
 if(stepLabel)stepLabel.textContent='ТЕКСТ ПОДГОТОВЛЕН';
 requestAnimationFrame(()=>$('[data-copy]')?.focus({preventScroll:true}));
});
async function copy(text){try{if(navigator.clipboard?.writeText){await navigator.clipboard.writeText(text);return true;}}catch(_){}
 try{const t=d.createElement('textarea');t.value=text;t.style.position='fixed';t.style.left='-9999px';d.body.append(t);t.select();const ok=d.execCommand('copy');t.remove();return ok;}catch(_){return false;}}
$('[data-copy]')?.addEventListener('click',async()=>{const ok=await copy(requestText);feedback.textContent=ok?'Текст скопирован. Свяжитесь со студией самостоятельно.':'Скопируйте текст вручную из поля выше.';if(!ok)copyPreview.select();});
$('[data-email]')?.addEventListener('click',()=>{const subject='Запрос по дооснащению автомобиля — АвтоМедиаСтудия';const link='mailto:powerlab.krd@gmail.com?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(requestText);feedback.textContent='Открываем почтовое приложение. Отправку письма подтвердите самостоятельно.';location.href=link;});
$('[data-restart]')?.addEventListener('click',()=>{form.reset();finish.hidden=true;form.hidden=false;step=0;renderStep(true);});
/* Gallery — accessible native modal with left/right controls. */
const lightbox=$('[data-lightbox]'),shots=$$('[data-gallery]'),lightImage=$('[data-lightimage]'),lightCaption=$('[data-lightcaption]'),lightCount=$('[data-lightcount]');
let shot=0,lightFocus=null;
function display(index){
 if(!shots.length)return;
 shot=(index+shots.length)%shots.length;
 const el=shots[shot],img=$('img',el);
 lightImage.src=img.currentSrc||img.src;lightImage.alt=img.alt;
 lightCaption.textContent=el.dataset.caption||img.alt;
 lightCount.textContent=String(shot+1).padStart(2,'0')+' / '+String(shots.length).padStart(2,'0');
}
shots.forEach((b,i)=>b.addEventListener('click',()=>{lightFocus=d.activeElement;display(i);lightbox.showModal();}));
$('[data-lightclose]')?.addEventListener('click',()=>lightbox?.close());
$('[data-lightnext]')?.addEventListener('click',()=>display(shot+1));
$('[data-lightprev]')?.addEventListener('click',()=>display(shot-1));
lightbox?.addEventListener('close',()=>lightFocus?.focus?.({preventScroll:true}));
d.addEventListener('keydown',e=>{if(!lightbox?.open)return;if(e.key==='ArrowRight')display(shot+1);if(e.key==='ArrowLeft')display(shot-1);});
/* Motion for JavaScript — optional, never hides important content without JS. */
if(typeof matchMedia==='function'&&!matchMedia('(prefers-reduced-motion: reduce)').matches){
 import('https://cdn.jsdelivr.net/npm/motion@12.23.26/+esm').then(({animate,inView})=>{
  const headline=$('.hero h1');if(headline)animate(headline,{y:[20,0],opacity:[.87,1]},{duration:.9,ease:'easeOut'});
  $$('.section-heading h2,.intro h2,.film h2,.price-layout h2').forEach(el=>inView(el,()=>animate(el,{y:[18,0]},{duration:.7,ease:'easeOut'}),{margin:'0px 0px -7% 0px'}));
 }).catch(()=>{});
}
})();
