/* AVM MOTORS — Cinematic concept / independent interactive layer.
   Astryx-inspired form controls and accessible dialogs, Aceternity-inspired
   image preview, Motion for JavaScript progressive enhancement. No React runtime. */
(()=>{"use strict";
const d=document,$=(s,r=d)=>r.querySelector(s),$$=(s,r=d)=>[...r.querySelectorAll(s)];
const reduced=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;
const header=$('[data-header]'),nav=$('[data-nav]'),menu=$('[data-menu]');
function onScroll(){header?.classList.toggle('is-scrolled',scrollY>28);}
addEventListener('scroll',onScroll,{passive:true});onScroll();
menu?.addEventListener('click',()=>{
 const open=nav.classList.toggle('is-open');
 menu.setAttribute('aria-expanded',String(open));
 menu.setAttribute('aria-label',open?'Закрыть меню':'Открыть меню');
 const use=$('use',menu);if(use)use.setAttribute('href',open?'#i-x':'#i-menu');
});
$$('.nav a').forEach(a=>a.addEventListener('click',()=>{
 nav.classList.remove('is-open');menu?.setAttribute('aria-expanded','false');
 const use=$('use',menu);use?.setAttribute('href','#i-menu');
}));
d.addEventListener('keydown',e=>{
 if(e.key==='Escape'&&nav?.classList.contains('is-open')){nav.classList.remove('is-open');menu?.setAttribute('aria-expanded','false');}
});
const services=$$('[data-services] .service-row'),searchInput=$('[data-search]'),count=$('[data-count]'),serviceEmpty=$('[data-empty]');
let activeFilter='all';
function filterServices(){
 const q=searchInput?.value.trim().toLocaleLowerCase('ru')||'';
 let found=0;
 services.forEach(row=>{
  const show=(activeFilter==='all'||row.dataset.cat===activeFilter)&&(!q||row.textContent.toLocaleLowerCase('ru').includes(q));
  row.hidden=!show;if(show)found++;
 });
 if(count)count.textContent=found+' из '+services.length+' направлений';
 if(serviceEmpty)serviceEmpty.hidden=found!==0;
}
$$('[data-filter]').forEach(button=>button.addEventListener('click',()=>{
 activeFilter=button.dataset.filter;
 $$('[data-filter]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
 filterServices();
}));
searchInput?.addEventListener('input',filterServices);filterServices();
const preview=$('[data-preview-image]'),previewTitle=$('[data-preview-title]');
const serviceCardButtons=$$('[data-services] [data-open-form]');
let lastPreviewImage='';
function previewService(row){
 if(!row||row.hidden||!preview)return;
 services.forEach(r=>r.classList.toggle('is-active',r===row));
 const source=row.dataset.image||'';
 if(source&&source!==lastPreviewImage){lastPreviewImage=source;preview.src=source;}
 if(previewTitle)previewTitle.textContent=row.dataset.service||'Диагностика и ремонт';
 const cardButton=$('.preview-circle');if(cardButton)cardButton.dataset.openForm=row.dataset.service||'';
}
services.forEach(row=>{
 row.addEventListener('mouseenter',()=>previewService(row));
 row.addEventListener('focusin',()=>previewService(row));
 row.addEventListener('click',e=>{if(e.target.closest('button'))return;openWizard(row.dataset.service||'');});
});
/* Native dialog + four step state machine, no account or backend. */
const wizard=$('[data-wizard]'),form=$('[data-form]'),finish=$('[data-finish]'),
 stepFields=$$('[data-step]'),markers=$$('[data-step-marker]'),
 label=$('[data-step-label]'),error=$('[data-error]'),
 next=$('[data-next]'),prev=$('[data-prev]'),submit=$('[data-submit]'),
 serviceChoice=$('[data-service-choice]'),carModel=$('[data-car]'),carBrand=$('[data-brand-input]'),
 nameField=$('[data-name]'),description=$('[data-message]');
let step=0,requestText='',returnFocus=null;
function lock(){d.body.classList.add('is-locked')}
function unlock(){if(!wizard?.open&&!$('[data-search-dialog]')?.open&&!$('[data-lightbox]')?.open)d.body.classList.remove('is-locked')}
function selectedIssue(){return form?.querySelector('input[name="issue"]:checked')?.value||'Компьютерная диагностика'}
function chooseService(value){
 if(!serviceChoice||!value)return;
 const found=[...serviceChoice.options].find(o=>o.value===value);
 if(!found){const opt=d.createElement('option');opt.value=value;opt.textContent=value;serviceChoice.append(opt);}
 serviceChoice.value=value;
 const matching=form.querySelector('input[name="issue"][value="'+CSS.escape(value)+'"]');
 if(matching)matching.checked=true;
}
function renderStep(){
 stepFields.forEach((s,i)=>s.hidden=i!==step);
 markers.forEach((m,i)=>{m.classList.toggle('is-current',i===step);m.classList.toggle('is-complete',i<step);});
 label.textContent='ШАГ '+String(step+1).padStart(2,'0')+' / 04';
 prev.hidden=step===0;next.hidden=step===3;submit.hidden=step!==3;
 if(error)error.textContent='';
 if(step===3)renderSummary();
 const visible=stepFields[step];
 const focus=visible?.querySelector('input[type="text"],input:not([type=radio]),textarea,select');
 if(step>0&&focus)requestAnimationFrame(()=>focus.focus({preventScroll:true}));
}
function openWizard(service=''){
 if(!wizard||!form)return;
 if(wizard.open){if(service)chooseService(service);return;}
 const cmd=$('[data-search-dialog]');if(cmd?.open)cmd.close();
 returnFocus=d.activeElement;form.reset();finish.hidden=true;form.hidden=false;step=0;requestText='';
 chooseService(service);
 renderStep();
 wizard.showModal();lock();
 requestAnimationFrame(()=>form.querySelector('input[name="issue"]:checked')?.focus({preventScroll:true}));
}
function closeWizard(){if(wizard?.open)wizard.close();}
wizard?.addEventListener('close',()=>{unlock();returnFocus?.focus?.({preventScroll:true});});
wizard?.addEventListener('click',e=>{if(e.target!==wizard)return;const r=wizard.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)closeWizard();});
$$('[data-open-form]').forEach(b=>b.addEventListener('click',()=>openWizard(b.dataset.openForm||'')));
$$('[data-close-form]').forEach(b=>b.addEventListener('click',closeWizard));
const intentMap={engine:'Ремонт двигателя',trans:'Ремонт DSG и АКПП',diag:'Компьютерная диагностика',chassis:'Ремонт ходовой части',care:'Замена масла и ТО'};
$$('[data-intent]').forEach(b=>b.addEventListener('click',()=>openWizard(intentMap[b.dataset.intent]||'')));
$$('[data-brand]').forEach(b=>b.addEventListener('click',()=>{
 const v=b.dataset.brand;
 carBrand.value=v==='Другая'?'':v;
 $$('[data-brand]').forEach(t=>t.classList.toggle('is-active',t===b));
 carModel?.focus();
}));
serviceChoice?.addEventListener('change',()=>{
 if(!serviceChoice.value)return;
 const issue=form?.querySelector('input[name="issue"][value="'+CSS.escape(serviceChoice.value)+'"]');
 if(issue)issue.checked=true;
});
$$('input[name="issue"]',form).forEach(r=>r.addEventListener('change',()=>{
 if(serviceChoice)serviceChoice.value='';
}));
function fail(message,control){if(error)error.textContent=message;control?.focus();return false}
function validate(){
 if(step===0){if(!form.querySelector('input[name="issue"]:checked')&&!serviceChoice?.value)return fail('Выберите направление работ.');return true}
 if(step===1){if(!carBrand?.value.trim())return fail('Укажите марку автомобиля.',carBrand);
  if(!carModel?.value.trim())return fail('Укажите модель автомобиля.',carModel);
  const year=$('[data-year]');if(year?.value&&(Number(year.value)<1980||Number(year.value)>2027))return fail('Проверьте год выпуска.',year);
  return true}
 if(step===2){if((description?.value.trim().length||0)<8)return fail('Опишите проблему хотя бы в нескольких словах (от 8 символов).',description);return true}
 if(step===3){if((nameField?.value.trim().length||0)<2)return fail('Укажите имя (минимум 2 символа).',nameField);
 const phone=$('[data-phone]')?.value.trim()||'';
 if(phone&&phone.replace(/\D/g,'').length<10)return fail('Если вводите телефон, укажите не менее 10 цифр.',$('[data-phone]'));
 return true}return true;
}
next?.addEventListener('click',()=>{if(!validate())return;step=Math.min(3,step+1);renderStep();});
prev?.addEventListener('click',()=>{step=Math.max(0,step-1);renderStep();});
function fieldValue(selector){return $(selector,form)?.value.trim()||''}
function summaryData(){
 const service=serviceChoice?.value||selectedIssue();
 return {service,brand:fieldValue('[data-brand-input]'),model:fieldValue('[data-car]'),year:fieldValue('[data-year]'),
  mileage:fieldValue('[data-mileage]'),description:fieldValue('[data-message]'),time:fieldValue('[data-time]')||'В любое время',
  name:fieldValue('[data-name]'),phone:fieldValue('[data-phone]')};
}
function renderSummary(){
 const sum=$('[data-summary]'),v=summaryData();if(!sum)return;
 sum.replaceChildren();
 const title=d.createElement('strong');title.textContent='ПРОВЕРЬТЕ ДЕТАЛИ';sum.append(title);
 [v.service,[v.brand,v.model,v.year].filter(Boolean).join(' · '),v.description&&'Описание: '+v.description].filter(Boolean).forEach(t=>{const el=d.createElement('span');el.textContent=t;sum.append(el)});
}
function messageText(){
 const v=summaryData();
 return ['Здравствуйте! Хочу уточнить обслуживание автомобиля в АВМ Моторс.',
  'Направление: '+v.service,'Автомобиль: '+[v.brand,v.model,v.year].filter(Boolean).join(', '),
  v.mileage?'Пробег: '+v.mileage:null,'Описание: '+v.description,'Удобное время: '+v.time,
  'Имя: '+v.name,v.phone?'Телефон: '+v.phone:null,
  'Подскажите возможность диагностики, стоимость и время обращения.'].filter(Boolean).join('\n');
}
form?.addEventListener('submit',e=>{
 e.preventDefault();if(!validate())return;
 requestText=messageText();form.hidden=true;finish.hidden=false;
 const textarea=$('[data-copy-preview]');if(textarea)textarea.value=requestText;
 if($('[data-feedback]'))$('[data-feedback]').textContent='';
 $('[data-step-label]').textContent='ЗАЯВКА ПОДГОТОВЛЕНА';
 requestAnimationFrame(()=>$('[data-copy]')?.focus({preventScroll:true}));
});
async function copyText(text){
 try{if(navigator.clipboard?.writeText){await navigator.clipboard.writeText(text);return true;}}catch(_){}
 try{const t=d.createElement('textarea');t.value=text;t.style.position='fixed';t.style.top='-999px';d.body.append(t);t.select();const ok=d.execCommand('copy');t.remove();return ok;}catch(_){return false;}
}
$('[data-copy]')?.addEventListener('click',async()=>{
 const text=requestText||$('[data-copy-preview]')?.value||'';
 const ok=await copyText(text);
 const feedback=$('[data-feedback]');
 if(feedback)feedback.textContent=ok?'Текст скопирован. Он не отправлен в сервис.':'Не удалось скопировать автоматически. Выделите текст в поле и скопируйте вручную.';
 if(!ok)$('[data-copy-preview]')?.select();
});
$('[data-share]')?.addEventListener('click',async()=>{
 const feedback=$('[data-feedback]');
 if(typeof navigator.share==='function'){
  try{await navigator.share({title:'Обращение в АВМ Моторс',text:requestText});if(feedback)feedback.textContent='Открылось меню отправки. Подтверждение доставки зависит от выбранного приложения.';}
  catch(e){if(e?.name!=='AbortError'&&feedback)feedback.textContent='Не удалось открыть меню отправки. Можно скопировать сообщение.';}
 }else{const ok=await copyText(requestText);if(feedback)feedback.textContent=ok?'Устройство не поддерживает меню «Поделиться». Сообщение скопировано.':'На этом устройстве используйте ручное копирование.';}
});
$('[data-restart]')?.addEventListener('click',()=>{form.reset();finish.hidden=true;form.hidden=false;step=0;renderStep();});
/* Live command palette, accessible via Ctrl/Cmd+K. */
const cmd=$('[data-search-dialog]'),cmdInput=$('[data-command-input]'),cmdResults=$('[data-command-results]');
function renderCommand(){
 if(!cmdResults)return;
 const q=(cmdInput?.value||'').trim().toLocaleLowerCase('ru');cmdResults.replaceChildren();
 let n=0;
 services.forEach(r=>{
  const name=r.dataset.service||'',desc=$('.service-name p',r)?.textContent||'';
  if(q&&!(name+' '+desc).toLocaleLowerCase('ru').includes(q))return;
  if(n++>=10)return;
  const b=d.createElement('button');b.className='result-button';b.type='button';
  const wrap=d.createElement('span'),st=d.createElement('strong'),sm=d.createElement('small');
  st.textContent=name;sm.textContent=desc;wrap.append(st,sm);
  const icon=d.createElementNS('http://www.w3.org/2000/svg','svg'),use=d.createElementNS('http://www.w3.org/2000/svg','use');
  use.setAttribute('href','#i-arrow');icon.append(use);b.append(wrap,icon);
  b.addEventListener('click',()=>{cmd.close();openWizard(name);});
  cmdResults.append(b);
 });
 if(!n){const p=d.createElement('p');p.textContent='Ничего не найдено. Попробуйте другой запрос.';p.className='service-empty';cmdResults.append(p);}
}
function openCmd(){
 if(!cmd||cmd.open)return;
 if(wizard?.open)wizard.close();
 cmdInput.value='';renderCommand();cmd.showModal();lock();cmdInput.focus();
}
$$('[data-command-open]').forEach(b=>b.addEventListener('click',openCmd));
$('[data-search-close]')?.addEventListener('click',()=>cmd?.close());
cmd?.addEventListener('close',unlock);
cmdInput?.addEventListener('input',renderCommand);
d.addEventListener('keydown',e=>{
 if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){e.preventDefault();if(cmd?.open)cmd.close();else openCmd();}
 if(cmd?.open&&e.key==='ArrowDown'&&d.activeElement===cmdInput){const f=$('.result-button',cmdResults);if(f){e.preventDefault();f.focus();}}
});
/* Gallery: native lightbox + keyboard arrows. */
const gallery=$$('[data-photo]'),lightbox=$('[data-lightbox]'),limg=$('[data-lightbox-image]'),lcaption=$('[data-lightbox-caption]'),lcount=$('[data-lightbox-count]');
let imageIndex=0;
function setGallery(index){
 imageIndex=(index+gallery.length)%gallery.length;
 const el=gallery[imageIndex],img=$('img',el);
 limg.src=img.currentSrc||img.src;limg.alt=img.alt;
 lcaption.textContent=el.dataset.caption||img.alt;
 lcount.textContent=String(imageIndex+1).padStart(2,'0')+' / '+String(gallery.length).padStart(2,'0');
}
gallery.forEach((b,i)=>b.addEventListener('click',()=>{setGallery(i);lightbox.showModal();lock();}));
$('[data-close-lightbox]')?.addEventListener('click',()=>lightbox.close());
$('[data-lightbox-prev]')?.addEventListener('click',()=>setGallery(imageIndex-1));
$('[data-lightbox-next]')?.addEventListener('click',()=>setGallery(imageIndex+1));
lightbox?.addEventListener('close',unlock);
d.addEventListener('keydown',e=>{if(!lightbox?.open)return;if(e.key==='ArrowRight')setGallery(imageIndex+1);if(e.key==='ArrowLeft')setGallery(imageIndex-1);});
/* Motion for JavaScript is optional. CSS remains legible without it. */
if(!reduced()){
 import('https://cdn.jsdelivr.net/npm/motion@12.23.26/+esm').then(({animate,inView})=>{
   if(!reduced()){
    const targets=$$('.section-heading,.intro-words h2,.services-title h2,.process-top h2,.gallery-title h2,.price-layout h2');
    targets.forEach(el=>inView(el,()=>{
      animate(el,{opacity:[.82,1],y:[20,0]},{duration:.72,ease:'easeOut'});
    },{margin:'0px 0px -8% 0px'}));
    const hero=$('.hero h1');if(hero)animate(hero,{opacity:[.8,1],y:[26,0]},{duration:1,ease:'easeOut'});
   }
 }).catch(()=>{/* Content and interaction are independent of motion CDN. */});
}
/* Defensive: never replace client imagery with unrelated stock assets. */
})();
