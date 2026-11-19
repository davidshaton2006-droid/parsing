/* AVM Motors · Progressive enhancement · v2.0 */
(()=>{'use strict';
const doc=document,$=(s,r=doc)=>r.querySelector(s),$$=(s,r=doc)=>[...r.querySelectorAll(s)];
const state={modalFocus:null,lightIndex:0};
const menu=$('[data-menu]'),nav=$('[data-nav]');
if(menu&&nav){menu.addEventListener('click',()=>{const open=!nav.classList.contains('is-open');nav.classList.toggle('is-open',open);menu.setAttribute('aria-expanded',String(open));menu.textContent=open?'Закрыть ×':'Меню ☰';});
$$('a',nav).forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('is-open');menu.setAttribute('aria-expanded','false');menu.textContent='Меню ☰';}));}
const list=$('[data-services]'),count=$('[data-count]'),search=$('[data-search]');
function applyFilters(){if(!list)return;const active=$('[data-filter][aria-pressed=true]')?.dataset.filter||'all',q=(search?.value||'').trim().toLocaleLowerCase('ru');let visible=0;$$('[data-cat]',list).forEach(card=>{const yes=(active==='all'||card.dataset.cat===active)&&(!q||card.textContent.toLocaleLowerCase('ru').includes(q));card.hidden=!yes;if(yes)visible++;});if(count)count.textContent=visible+' из '+$$('[data-cat]',list).length;const empty=$('[data-empty]');if(empty)empty.hidden=visible>0;}
$$('[data-filter]').forEach(b=>b.addEventListener('click',()=>{$$('[data-filter]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));applyFilters();}));
search?.addEventListener('input',applyFilters);applyFilters();
const modal=$('[data-modal]'),form=$('[data-form]'),first=$('[data-name]'),chosen=$('[data-service-choice]'),feedback=$('[data-form-feedback]');
const openModal=(service='')=>{if(!modal)return;state.modalFocus=doc.activeElement;modal.hidden=false;doc.body.classList.add('is-locked');if(chosen){const value=service||'';if(value&&![...chosen.options].some(o=>o.value===value)){const o=doc.createElement('option');o.value=value;o.textContent=value;chosen.appendChild(o);}chosen.value=value;}if(feedback)feedback.textContent='';requestAnimationFrame(()=>first?.focus());};
function closeModal(){if(!modal)return;modal.hidden=true;doc.body.classList.remove('is-locked');state.modalFocus?.focus?.();}
$$('[data-open-form]').forEach(btn=>btn.addEventListener('click',()=>openModal(btn.dataset.openForm||'')));
$$('[data-close-form]').forEach(btn=>btn.addEventListener('click',closeModal));
modal?.addEventListener('click',e=>{if(e.target===modal)closeModal();});
form?.addEventListener('submit',async e=>{e.preventDefault();if(!form.reportValidity())return;const name=$('[data-name]',form).value.trim(),car=$('[data-car]',form).value.trim(),service=chosen?.value||'Консультация',message=$('[data-message]',form).value.trim(),time=$('[data-time]',form)?.value||'не указано';const text=['Здравствуйте! Хочу уточнить обслуживание в АВМ Моторс.','Имя: '+name,'Автомобиль: '+car,'Услуга: '+service,'Предпочтительное время: '+time,'Описание: '+(message||'Нужна консультация'),'Подскажите доступность, стоимость и порядок записи.'].join('\n');let copied=false;try{await navigator.clipboard.writeText(text);copied=true;}catch(_){const t=doc.createElement('textarea');t.value=text;t.style.position='fixed';t.style.opacity='0';doc.body.appendChild(t);t.select();try{copied=doc.execCommand('copy');}catch(_){}t.remove();}
if(feedback){feedback.textContent=copied?'Обращение скопировано. Оно НЕ отправлено в сервис: позвоните по номеру ниже и согласуйте запись.':'Не удалось автоматически скопировать. Выделите текст в поле ниже.';}const preview=$('[data-copy-preview]');if(preview){preview.value=text;preview.hidden=copied;}});
const symptom=$('[data-symptom-result]');const advice={
  engine:{title:'Двигатель и диагностика',service:'Ремонт и диагностика двигателя',text:'Начните с диагностики: источник симптома определит объем ремонта.'},
  gearbox:{title:'Трансмиссия / DSG',service:'Ремонт DSG и АКПП',text:'Рывки и задержки переключения требуют проверки трансмиссии и электроники.'},
  electric:{title:'Автоэлектрика',service:'Электрика и диагностика',text:'Ошибки приборной панели и нестабильная работа систем требуют компьютерной проверки.'},
  noise:{title:'Ходовая часть',service:'Ремонт подвески и рулевого',text:'Стуки и вибрации лучше диагностировать на подъемнике.'},
  wheels:{title:'Шины и геометрия',service:'Сход-развал 3D',text:'При уводе авто или неравномерном износе стоит проверить геометрию и ходовую.'},
  care:{title:'Детейлинг и мойка',service:'Детейлинг и химчистка',text:'Подберите комплекс ухода под состояние кузова и салона.'}
};
$$('[data-symptom]').forEach(btn=>btn.addEventListener('click',()=>{const item=advice[btn.dataset.symptom];if(!item||!symptom)return;$$('[data-symptom]').forEach(x=>x.setAttribute('aria-pressed',String(x===btn)));symptom.innerHTML='';const title=doc.createElement('h3'),p=doc.createElement('p'),action=doc.createElement('button');title.textContent=item.title;p.textContent=item.text;action.type='button';action.className='button button-primary';action.textContent='Уточнить обслуживание ↗';action.addEventListener('click',()=>openModal(item.service));symptom.append(title,p,action);}));
const lightbox=$('[data-lightbox]'),lightImg=$('[data-lightbox-image]'),lightCap=$('[data-lightbox-caption]');
const gallery=$$('[data-photo]');function displayPhoto(index){if(!gallery.length||!lightbox)return;state.lightIndex=(index+gallery.length)%gallery.length;const item=gallery[state.lightIndex];const img=$('img',item);lightImg.src=(img.complete&&img.naturalWidth>0?img.currentSrc:(img.dataset.full||img.src));lightImg.alt=img.alt;lightCap.textContent=(item.dataset.caption||img.alt)+' · '+(state.lightIndex+1)+' / '+gallery.length;}
function openLight(index){state.modalFocus=doc.activeElement;displayPhoto(index);lightbox.hidden=false;doc.body.classList.add('is-locked');$('[data-close-lightbox]')?.focus();}
function closeLight(){if(!lightbox)return;lightbox.hidden=true;doc.body.classList.remove('is-locked');state.modalFocus?.focus?.();}
gallery.forEach((item,i)=>item.addEventListener('click',()=>openLight(i)));
$$('[data-close-lightbox]').forEach(b=>b.addEventListener('click',closeLight));
$('[data-lightbox-prev]')?.addEventListener('click',()=>displayPhoto(state.lightIndex-1));
$('[data-lightbox-next]')?.addEventListener('click',()=>displayPhoto(state.lightIndex+1));
lightbox?.addEventListener('click',e=>{if(e.target===lightbox)closeLight();});
doc.addEventListener('keydown',e=>{
  if(e.key==='Escape'){if(lightbox&&!lightbox.hidden)closeLight();else if(modal&&!modal.hidden)closeModal();else if(nav?.classList.contains('is-open')){nav.classList.remove('is-open');menu?.setAttribute('aria-expanded','false');}}
  if(lightbox&&!lightbox.hidden){if(e.key==='ArrowLeft')displayPhoto(state.lightIndex-1);if(e.key==='ArrowRight')displayPhoto(state.lightIndex+1);}
  const activeDialog=lightbox&&!lightbox.hidden?lightbox:(modal&&!modal.hidden?modal:null);if(e.key==='Tab'&&activeDialog){const f=$$('button:not([disabled]),a[href],input:not([disabled]),select,textarea',activeDialog).filter(x=>x.offsetParent!==null);if(!f.length)return;const i=f.indexOf(doc.activeElement);if(e.shiftKey&&i===0){e.preventDefault();f.at(-1).focus();}else if(!e.shiftKey&&i===f.length-1){e.preventDefault();f[0].focus();}}
});
$('[data-image-fallback]').forEach(img=>{const fallback=()=>{if(img.dataset.fallbackDone)return;img.dataset.fallbackDone='1';img.src=img.dataset.imageFallback;};img.addEventListener('error',fallback);if(img.complete&&img.naturalWidth===0)fallback();});
/* Motion for JavaScript: optional cinematic polish; every section remains visible without it. */
if(typeof matchMedia==='function'&&!matchMedia('(prefers-reduced-motion: reduce)').matches){
  import('https://cdn.jsdelivr.net/npm/motion@12.0.0/+esm').then(({animate,inView})=>{
    const image=$('.hero-media img');
    if(image)animate(image,{scale:[1.04,1]},{duration:1.25,ease:'easeOut'});
    inView('.section-head h2, .editorial h2, .steps h2, .review-card, .feature-card',el=>{
      animate(el,{y:[18,0]},{duration:0.72,ease:'easeOut'});
    },{margin:'0px 0px -8% 0px'});
  }).catch(()=>{/* Graceful fallback: no animation, same visible content. */});
}

})();
