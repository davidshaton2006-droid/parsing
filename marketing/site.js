'use strict';document.documentElement.classList.add('js');const $=id=>document.getElementById(id);const rub=n=>Math.round(n).toLocaleString('ru-RU')+' ₽';const val=(id,max=1000000)=>Math.min(max,Math.max(0,Number($(id)?.value)||0));const menu=document.querySelector('.menu'),nav=$('nav');menu?.addEventListener('click',()=>{let open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',String(open));});document.addEventListener('keydown',e=>{if(e.key==='Escape'&&nav?.classList.contains('open')){nav.classList.remove('open');menu.setAttribute('aria-expanded','false');menu.focus();}});document.querySelectorAll('[data-topic]').forEach(a=>a.addEventListener('click',()=>{let s=document.querySelector('#request select'),v=a.dataset.topic;if(s){if(![...s.options].some(o=>o.value===v))s.add(new Option(v,v));s.value=v;}}));const form=$('request');const message=()=>{let f=new FormData(form);return ['Имя: '+f.get('name'),'Контакт: '+f.get('contact'),'Направление: '+f.get('topic'),'Деятельность / специализация: '+(f.get('business')||'не указано'),...(f.has('industries')?['Отрасли: '+(f.get('industries')||'не указано'),'Клиентская база: '+(f.get('clientbase')||'не указано')]:[]),'Задача: '+(f.get('message')||'не указано')].join('\n');};form?.addEventListener('submit',e=>{e.preventDefault();if(!form.reportValidity())return;location.href='mailto:pr.shaton@mail.ru?subject='+encodeURIComponent('Запрос с сайта Shaton Digital')+'&body='+encodeURIComponent(message());$('form-status').textContent='Письмо подготовлено. Отправьте его в почтовом приложении либо свяжитесь напрямую.';});$('copy-request')?.addEventListener('click',async()=>{if(!form.reportValidity())return;try{await navigator.clipboard.writeText(message());$('form-status').textContent='Текст скопирован. Откройте Telegram по ссылке рядом и вставьте сообщение.';}catch{const a=document.createElement('textarea');a.value=message();a.readOnly=true;form.append(a);a.select();$('form-status').textContent='Выделен текст обращения. Скопируйте его вручную.';}});function filter(){let q=($('search')?.value||'').toLowerCase().trim(),cat=$('category')?.value||'',n=0;document.querySelectorAll('.filter-item').forEach(x=>{x.hidden=!(x.textContent.toLowerCase().includes(q)&&(!cat||x.dataset.category===cat||x.dataset.needs?.split(' ').includes(cat)));if(!x.hidden)n++;});if($('empty'))$('empty').hidden=n!==0;}['search','category'].forEach(id=>$(id)?.addEventListener('input',filter));function partner(){let n=Math.floor(val('pc-count',100)),p=val('pc-price'),r=val('pc-rate',.4),c=Math.floor(val('pc-clients',1000)),s=val('pc-support'),volume=n*p,a=volume*r,b=c*s*r,bonus=0;if($('pc-bonus').checked&&volume>0){if(n>=10)bonus=30000;else if(n>=5&&volume>=300000)bonus=15000;else if(n>=3)bonus=5000;}$('pc-new').textContent=rub(a);$('pc-recurring').textContent=rub(b);$('pc-bonus-out').textContent=rub(bonus);$('pc-total').textContent=rub(a+b+bonus);}if($('partner-calc')){$('partner-calc').addEventListener('input',partner);partner();}function budget(){let n=val('budget-type')*val('budget-level',3)+Math.floor(val('budget-integrations',10))*10000;let l=Math.round(n/1000)*1000,h=Math.min(1000000,Math.round(n*1.5/1000)*1000);$('budget-output').textContent=l.toLocaleString('ru-RU')+'–'+rub(Math.max(l,h));}if($('budget-calc')){$('budget-calc').addEventListener('input',budget);budget();}
;(()=>{const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;const sections=document.querySelectorAll('.section-head,.feature-art,.experience article');if('IntersectionObserver'in window&&!reduced){const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');io.unobserve(e.target)}}),{threshold:.08});sections.forEach(e=>{e.classList.add('reveal');io.observe(e)});}else sections.forEach(e=>e.classList.add('visible'));
const nav=document.querySelector('nav');if(nav){const toggle=document.createElement('button');toggle.className='mega-toggle';toggle.textContent='Направления ⌄';toggle.setAttribute('aria-expanded','false');const panel=document.createElement('div');panel.className='mega';panel.hidden=true;panel.innerHTML=[['ai','Искусственный интеллект','Ассистенты, RAG, продажи'],['automation','Автоматизация бизнеса','Заявки, заказы, процессы'],['software','Заказное ПО','Платформы и кабинеты'],['web','Сайты для бизнеса','Коммерческие веб-проекты'],['commerce','Электронная коммерция','Интернет-магазины и заказы'],['telegram','Telegram-разработка','Боты и Mini Apps'],['integration','CRM, ERP и API','Интеграции'],['system','Комплексная цифровизация','Единая архитектура']].map(a=>'<a href="/parsing/marketing/catalog/#'+a[0]+'"><b>'+a[1]+'</b><small>'+a[2]+'</small></a>').join('');nav.append(toggle,panel);const close=()=>{panel.hidden=true;toggle.setAttribute('aria-expanded','false')};toggle.onclick=()=>{panel.hidden=!panel.hidden;toggle.setAttribute('aria-expanded',String(!panel.hidden))};document.addEventListener('click',e=>{if(!nav.contains(e.target))close()});document.addEventListener('keydown',e=>{if(e.key==='Escape')close()});}
const diag=document.querySelector('.diag-list');if(diag){const checks=[...diag.querySelectorAll('input')];const update=()=>{let n=checks.filter(x=>x.checked).length;document.querySelector('.score').textContent=n+' / '+checks.length;document.querySelector('.meter i').style.width=(n/checks.length*100)+'%';document.querySelector('#diag-result').textContent=n===checks.length?'Базовые процессы уже связаны. Можно оценить дальнейшее развитие.':n>=3?'Часть инфраструктуры готова. Стоит изучить оставшиеся разрывы.':'Начните с анализа ручных операций и каналов обращений.'};diag.addEventListener('change',update);update()}
const controls=document.querySelector('.demo-controls');if(controls){const views={sales:['Здравствуйте! Можно записаться на завтра?','Уточните услугу и удобное время.','Запрос передан администратору в CRM.'],knowledge:['Где найти правила возврата?','По демонстрационному регламенту: откройте раздел «Возврат».','Источник: пример внутренней базы знаний.'],orders:['Хочу заказать комплект оборудования.','Выберите даты и комплектацию.','Черновик заказа подготовлен для подтверждения.']};controls.addEventListener('click',e=>{let b=e.target.closest('button');if(!b)return;controls.querySelectorAll('button').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));document.querySelector('.chat-demo').innerHTML=views[b.dataset.demo].map((s,i)=>'<div class="bubble '+(i===1?'reply':'')+'">'+s+'</div>').join('')});}
})();
;(()=>{const root=document.querySelector('#partner-calc');if(root){const box=document.createElement('div');box.className='income-viz';box.innerHTML='<h3>Структура вознаграждения</h3><div class="income-track"><i></i><i></i><i></i></div><p>Новые проекты · сопровождение · бонус</p>';root.append(box);const draw=()=>{const a=[Math.floor(val('pc-count',100))*val('pc-price')*val('pc-rate',.4),Math.floor(val('pc-clients',1000))*val('pc-support')*val('pc-rate',.4),Number(($('pc-bonus-out').textContent||'').replace(/[^0-9]/g,''))];const total=a.reduce((s,n)=>s+n,0);box.querySelectorAll('i').forEach((x,i)=>x.style.width=(total?a[i]/total*100:0)+'%')};root.addEventListener('input',draw);draw()}})();

;(()=>{const range=$('integration-range'),num=$('budget-integrations');if(range&&num){const draw=()=>{const n=Math.floor(val('budget-integrations',10)),base=val('budget-type')*val('budget-level',3),extra=n*10000,total=base+extra;range.value=String(n);$('integration-number').textContent=n;$('cost-base').style.width=(total?base/total*100:0)+'%';$('cost-extra').style.width=(total?extra/total*100:0)+'%';$('cost-base-label').textContent=rub(base);$('cost-extra-label').textContent=rub(extra)};range.addEventListener('input',()=>{num.value=range.value;budget()});$('budget-calc').addEventListener('input',draw);$('budget-request').addEventListener('click',()=>{const field=document.querySelector('#request textarea');const type=$('budget-type').selectedOptions[0].textContent;const level=$('budget-level').selectedOptions[0].textContent;const line='Предварительный расчёт: '+type+', '+level+', интеграций: '+Math.floor(val('budget-integrations',10))+'; '+$('budget-output').textContent;if(!field.value)field.value=line;});draw()}const tier=$('tier-range');if(tier){const update=()=>{const n=Number(tier.value),rate=n>=1000000?40:n>=300000?35:30;$('tier-volume').textContent=rub(n);$('tier-rate').textContent=rate+'%';$('tier-next').textContent=rate===40?'Максимальная накопительная ставка': 'До следующей ступени: '+rub((rate===30?300000:1000000)-n)};tier.addEventListener('input',update);update()}const showcase=$('project-showcase');if(showcase){const projects=[...document.querySelectorAll('.portfolio-grid .tile')].map(e=>({name:e.querySelector('h3').textContent,desc:e.querySelector('p').textContent,url:e.querySelector('a.btn')?.getAttribute('href')||null}));const frame=$('project-frame'),placeholder=$('preview-placeholder'),load=$('load-project');let active=0;const pick=i=>{active=i;const p=projects[i];$('project-name').textContent=p.name;$('project-description').textContent=p.desc;$('project-address').textContent=p.url||'Демонстрация недоступна';$('project-link').hidden=!p.url;if(p.url)$('project-link').href=p.url;else $('project-link').removeAttribute('href');load.disabled=!p.url;frame.hidden=true;frame.removeAttribute('src');placeholder.hidden=false;placeholder.querySelector('strong').textContent=p.name;load.textContent=p.url?'Загрузить живое превью ↗':'Демо временно недоступно';showcase.querySelectorAll('[data-project]').forEach(b=>b.setAttribute('aria-pressed',String(Number(b.dataset.project)===i)))};showcase.querySelectorAll('[data-project]').forEach(b=>b.onclick=()=>pick(Number(b.dataset.project)));showcase.querySelectorAll('[data-device]').forEach(b=>b.onclick=()=>{$('preview-viewport').classList.toggle('mobile',b.dataset.device==='mobile');showcase.querySelectorAll('[data-device]').forEach(c=>c.setAttribute('aria-pressed',String(c===b)))});load.onclick=()=>{if(!projects[active].url)return;if(!frame.hidden){frame.hidden=true;frame.removeAttribute('src');placeholder.hidden=false;load.textContent='Загрузить живое превью ↗';return}frame.src=projects[active].url;frame.title='Демонстрация '+projects[active].name;frame.hidden=false;placeholder.hidden=true;load.textContent='Закрыть превью'};pick(0)}})();

;(()=>{const panel=$('economy-panel');if(panel){const keys=['ops','minutes','saving','hour','project','monthly'];const calc=()=>{const a=Object.fromEntries(keys.map(k=>[k,Number($('eco-'+k).value)]));keys.forEach(k=>$('eco-'+k+'-out').textContent=a[k].toLocaleString('ru-RU'));const before=a.ops*a.minutes/60,hours=before*a.saving/100,gross=hours*a.hour,net=gross-a.monthly,payback=net>0?a.project/net:null;const n=x=>x.toLocaleString('ru-RU',{maximumFractionDigits:1});$('eco-hours').textContent=n(hours)+' ч';$('eco-gross').textContent=rub(gross);$('eco-net').textContent=rub(net);$('eco-payback').textContent=payback===null?'Не покрывается':n(payback)+' мес.';$('eco-before').textContent=n(before)+' ч';$('eco-after').textContent=n(before-hours)+' ч';$('eco-after-bar').style.width=(100-a.saving)+'%';return a};panel.addEventListener('input',calc);$('eco-request').addEventListener('click',()=>{const a=calc(),field=document.querySelector('#request textarea');if(!field.value)field.value='Расчёт автоматизации: '+a.ops+' операций в месяц, '+a.minutes+' мин на операцию, сокращение времени '+a.saving+'%. Бюджет '+rub(a.project)+'.'});calc()}const w=$('workspace-demo');if(w){const body=$('workspace-body'),title=$('workspace-title');const render=key=>{title.textContent={overview:'Сводка операций',orders:'Входящие обращения',integrations:'Подключённые системы'}[key];if(key==='overview'){body.innerHTML='<div class="workspace-kpis"><div><span>Обращения</span><strong>124</strong></div><div><span>В обработке</span><strong>18</strong></div><div><span>Завершено</span><strong>106</strong></div></div><div class="workspace-chart" role="img" aria-label="Условное количество обращений по дням">'+[12,18,15,22,24,17,16].map((v,i)=>'<div><b>'+v+'</b><i style="height:'+v/24*75+'%;animation-delay:'+i*.05+'s"></i><span>'+['Пн','Вт','Ср','Чт','Пт','Сб','Вс'][i]+'</span></div>').join('')+'</div>'}else if(key==='orders'){body.innerHTML='<div class="workspace-table">'+[['Сайт','Запись на услугу','В работе'],['Telegram','Расчёт проекта','Уточнение'],['Почта','Запрос каталога','Передано в CRM'],['Mini App','Новый заказ','Подтверждён']].map(a=>'<div><b>'+a[0]+'</b><span>'+a[1]+'</span><em>'+a[2]+'</em></div>').join('')+'</div>'}else{body.innerHTML='<div class="workspace-integrations">'+[['CRM','Синхронизация'],['Telegram','Диалоги'],['API','Обмен данными'],['База знаний','Источники ответов']].map(a=>'<div><b>'+a[0]+'</b><small>● '+a[1]+'</small></div>').join('')+'</div>'}w.querySelectorAll('[data-workspace]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.workspace===key)))};w.querySelectorAll('[data-workspace]').forEach(b=>b.addEventListener('click',()=>render(b.dataset.workspace)));render('overview')}})();

;(()=>{const el=document.getElementById('journey-v5');if(!el)return;const journeys=[[['Выбор услуги','Клиент выбирает нужные работы.'],['Запись','Указывает желаемое время.'],['Подтверждение','Администратор согласует визит.']],[['Меню на игровом месте','Игрок выбирает еду и напитки.'],['Заказ и оплата','Подтверждает заказ с учётом доступных способов оплаты.'],['Доставка к месту','Сотрудник получает номер игрового места.']],[['Каталог','Покупатель подбирает товар и комплектацию.'],['Корзина и оплата','Выбирает способ доставки и оплаты.'],['Получение заказа','Система передаёт заказ в обработку.']]];const buttons=[...el.querySelectorAll('[data-journey]')];buttons.forEach(b=>b.addEventListener('click',()=>{const data=journeys[Number(b.dataset.journey)];if(!data)return;el.querySelector('.journey-steps-v5').innerHTML=data.map((a,i)=>'<article><b>0'+(i+1)+'</b><h3>'+a[0]+'</h3><p>'+a[1]+'</p></article>').join('');buttons.forEach(x=>x.setAttribute('aria-pressed',String(x===b)))}))})();



;(()=>{const diag=document.querySelector('.ref-diag');if(diag){const checks=[...diag.querySelectorAll('input[type=checkbox]')],update=()=>{const n=checks.filter(c=>c.checked).length;const ring=$('ref-score-ring');ring.style.setProperty('--score-turn',n/checks.length*360+'deg');ring.setAttribute('aria-label',n+' из '+checks.length);$('diag-result').textContent=n===8?'Базовые возможности отмечены. Оцените реальный эффект и устойчивость системы.':n>=5?'Основная инфраструктура есть. Начните с оставшихся разрывов.':'Есть несколько направлений для предметного разбора.';const tips=checks.filter(c=>!c.checked).slice(0,3).map(c=>c.dataset.recommend);$('ref-diag-tips').replaceChildren(...(tips.length?tips:['Проверить показатели и определить следующий этап.']).map(v=>{const li=document.createElement('li');li.textContent=v;return li}))};diag.addEventListener('change',update);update()}const chart=$('ref-chart-board');if(chart){const datasets=[[100,90,75,65,50,40,35],[100,95,90,80,70,60,55],[100,85,60,45,30,20,15]];const buttons=[...chart.querySelectorAll('[data-ref-chart]')];const draw=n=>{const a=datasets[n];if(!a)return;const path=values=>values.map((v,i)=>(i?'L':'M')+(55+i*637/6).toFixed(1)+' '+(228-v*1.96).toFixed(1)).join(' ');[['ref-chart-manual',a],['ref-chart-auto',a.map(v=>100-v)]].forEach(([id,values])=>{const el=$(id);el.setAttribute('d',path(values));el.classList.remove('ref-draw');el.getBoundingClientRect();el.classList.add('ref-draw')});$('ref-manual-out').textContent=a.at(-1);$('ref-auto-out').textContent=100-a.at(-1);buttons.forEach(b=>b.setAttribute('aria-pressed',String(Number(b.dataset.refChart)===n)));chart.dataset.peakSeries=JSON.stringify({manual:a,auto:a.map(v=>100-v),scenario:n});chart.dispatchEvent(new CustomEvent('marketing:chart-change'))};buttons.forEach(b=>b.addEventListener('click',()=>draw(Number(b.dataset.refChart))));draw(0)}})();

;(()=>{const filterGrid=document.querySelector('.catalog-bento'),search=$('search'),category=$('category');if(filterGrid){const refresh=()=>filterGrid.classList.toggle('is-filtered',Boolean(search?.value.trim()||category?.value));search?.addEventListener('input',refresh);category?.addEventListener('change',refresh);refresh()}const cards=[...document.querySelectorAll('[data-project-preview]')],showcase=$('project-showcase');if(!cards.length&&!showcase)return;fetch('/parsing/marketing/assets/previews.json',{cache:'no-cache'}).then(r=>r.ok?r.json():{}).then(manifest=>{const valid=v=>typeof v==='string'&&/^\/parsing\/marketing\/assets\/previews\/[a-z0-9-]+\.(jpg|webp|png)$/.test(v);cards.forEach(card=>{const url=manifest[card.dataset.projectPreview]?.desktop;if(!valid(url))return;const img=document.createElement('img');img.alt='Снимок демонстрационного сайта';img.loading='lazy';img.decoding='async';img.onload=()=>card.classList.add('has-preview');img.onerror=()=>img.remove();card.append(img);img.src=url});if(showcase){const frame=$('preview-placeholder'),img=frame?.querySelector('.showcase-shot');if(!img)return;let token=0;const update=()=>{const link=$('project-link')?.getAttribute('href')||'',slug=link.match(/^\/parsing\/([^/]+)\//)?.[1],device=$('preview-viewport')?.classList.contains('mobile')?'mobile':'desktop',url=manifest[slug]?.[device];const n=++token;frame.classList.remove('has-preview');img.hidden=true;if(!valid(url))return;const probe=new Image();probe.onload=()=>{if(n!==token)return;img.src=url;img.alt='Снимок проекта '+$('project-name').textContent;img.hidden=false;frame.classList.add('has-preview')};probe.src=url};showcase.querySelectorAll('[data-project],[data-device]').forEach(b=>b.addEventListener('click',()=>queueMicrotask(update)));update()}}).catch(()=>{});})();

;(()=>{const root=$('club-demo');if(!root)return;const products=[['Бургер',290],['Картофель фри',150],['Лимонад',120],['Сэндвич',230]],qty=[0,0,0,0];let orderId=0,pending=false;const items=$('club-items'),send=$('club-send'),accept=$('club-accept'),admin=$('club-admin-order');const total=()=>qty.reduce((s,n,i)=>s+n*products[i][1],0);const render=()=>{items.innerHTML=qty.map((n,i)=>n?'<div class="club-cart-row"><div><b>'+products[i][0]+'</b><small>'+rub(n*products[i][1])+'</small></div><div class="club-qty"><button type="button" data-club-delta="-1" data-product="'+i+'" aria-label="Убрать '+products[i][0]+'">−</button><span>'+n+'</span><button type="button" data-club-delta="1" data-product="'+i+'" aria-label="Добавить '+products[i][0]+'">+</button></div></div>':'').join('')||'<p class="small">Выберите блюда в меню.</p>';$('club-total').textContent=rub(total());send.disabled=!total()||pending};root.addEventListener('click',e=>{const add=e.target.closest('[data-club-add]'),delta=e.target.closest('[data-club-delta]');if(add){const i=Number(add.dataset.clubAdd);qty[i]=Math.min(20,qty[i]+1);render()}else if(delta){const i=Number(delta.dataset.product);qty[i]=Math.max(0,Math.min(20,qty[i]+Number(delta.dataset.clubDelta)));render()}});send.addEventListener('click',()=>{if(!total()||pending)return;orderId++;pending=true;const list=qty.map((n,i)=>n?products[i][0]+' × '+n:'').filter(Boolean).join(', ');admin.innerHTML='<div class="club-order-box"><b>Заказ № '+orderId+' · место 12</b><small>'+list+'</small><strong>'+rub(total())+'</strong><small>Новый тестовый заказ</small></div>';accept.hidden=false;qty.fill(0);render()});accept.addEventListener('click',()=>{if(!pending)return;pending=false;admin.querySelector('.club-order-box small:last-child').textContent='Принят сотрудником · демо';accept.hidden=true;render()});render()})();
;(()=>{const buttons=[...document.querySelectorAll('[data-preset]')],calc=$('partner-calc');if(!buttons.length||!calc)return;const presets={start:[2,60000,.3,0,0,false],active:[5,100000,.35,10,20000,true],agency:[10,150000,.4,20,20000,true]},ids=['pc-count','pc-price','pc-rate','pc-clients','pc-support'];buttons.forEach(b=>b.addEventListener('click',()=>{const a=presets[b.dataset.preset];if(!a)return;ids.forEach((id,i)=>$(id).value=String(a[i]));$('pc-bonus').checked=a[5];$('pc-count').dispatchEvent(new Event('input',{bubbles:true}));buttons.forEach(x=>x.setAttribute('aria-pressed',String(x===b)))}));calc.addEventListener('input',()=>{const match=Object.entries(presets).find(([k,a])=>ids.every((id,i)=>Number($(id).value)===a[i])&&$('pc-bonus').checked===a[5]);buttons.forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.preset===match?.[0])))});})();
;(()=>{const root=$('partner-finder');if(!root)return;const examples=[{"service":"web","obs":"Компания А: сайт не подтверждён","hyp":"Проверить наличие сайта и интерес к собственному цифровому сервису.","site":false},{"service":"web","obs":"Компания Б: существующий сайт","hyp":"Оценить функциональность сайта и необходимость доработок.","site":true},{"service":"ai","obs":"Компания Б: есть собственный сайт","hyp":"Изучить процесс консультации клиентов и возможность внедрения ИИ-ассистента.","site":true},{"service":"ai","obs":"Компания В: развитое цифровое присутствие","hyp":"Проверить объём повторяющихся обращений и потребность в интеллектуальном консультанте.","site":true},{"service":"automation","obs":"Компания А: несколько каналов связи","hyp":"Уточнить, как обрабатываются обращения и передаются данные.","site":true},{"service":"automation","obs":"Компания Г: есть сайт и онлайн-запись","hyp":"Проверить существующие интеграции и ручные операции.","site":true},{"service":"telegram","obs":"Компания В: есть клиентская аудитория","hyp":"Изучить востребованность дополнительного сервиса внутри Telegram.","site":true},{"service":"telegram","obs":"Компания Д: есть повторные продажи","hyp":"Проверить возможность клиентского приложения или цифровой лояльности.","site":true}];const rows=$('finder-rows'),detail=$('finder-detail');let data=[];
const render=()=>{const city=$('finder-city').value,type=$('finder-type').value,service=$('finder-service').value,missing=$('finder-site').checked;
data=examples.filter(d=>d.service===service&&(!missing||!d.site)).map(d=>({...d,city,type}));$('finder-count').textContent=data.length+' условных записей';
rows.replaceChildren(...data.map((d,i)=>{const b=document.createElement('button');b.type='button';b.className='finder-row';b.dataset.finderRow=String(i);b.setAttribute('aria-pressed','false');const left=document.createElement('span'),title=document.createElement('b'),sub=document.createElement('small'),status=document.createElement('span');title.textContent=d.obs;sub.textContent=city+' · '+$('finder-type').selectedOptions[0].textContent;status.className='finder-status';status.textContent=d.site?'Условное наблюдение':'Сайт не подтверждён';left.append(title,sub);b.append(left,status);return b}));
detail.replaceChildren();if(data.length)show(0);else{const p=document.createElement('p');p.className='small';p.textContent='Нет тестовых записей по фильтрам.';rows.append(p)}};
const show=i=>{const d=data[i];if(!d)return;const box=document.createElement('div');box.className='finder-detail-box';const small=document.createElement('small'),b=document.createElement('b'),p=document.createElement('p');small.textContent='ГИПОТЕЗА ДЛЯ ОБСУЖДЕНИЯ';b.textContent=d.obs;b.style.display='block';p.textContent=d.hyp;box.append(small,b,p);detail.replaceChildren(box);rows.querySelectorAll('[data-finder-row]').forEach(b=>b.setAttribute('aria-pressed',String(+b.dataset.finderRow===i)))};
rows.addEventListener('click',e=>{const b=e.target.closest('[data-finder-row]');if(b)show(+b.dataset.finderRow)});$('finder-run').addEventListener('click',render);['finder-city','finder-type','finder-site','finder-service'].forEach(id=>$(id)?.addEventListener('change',render));render()})();


;(()=>{const targets=[...document.querySelectorAll('[data-ref-art]:not(.service-scene-v6)')];if(!targets.length)return;
fetch('/parsing/marketing/assets/reference/manifest.json',{cache:'no-cache'}).then(r=>r.ok?r.json():{}).then(manifest=>{
targets.forEach(target=>{const key=target.dataset.refArt,url=manifest[key];if(url!=='/parsing/marketing/assets/reference/'+key+'.webp')return;
const img=document.createElement('img');img.className='reference-object-art';img.alt='';img.decoding='async';img.loading=target.classList.contains('visual-stage-v5')?'eager':'lazy';
img.addEventListener('load',()=>{if(img.naturalWidth>0)target.classList.add('has-object-art')},{once:true});img.addEventListener('error',()=>{target.classList.remove('has-object-art');img.remove()},{once:true});
target.prepend(img);img.src=url;
});
}).catch(()=>{});})();

;(()=>{if(!matchMedia('(hover:hover) and (pointer:fine)').matches||matchMedia('(prefers-reduced-motion: reduce)').matches)return;document.querySelectorAll('[data-ref-art]').forEach(el=>{let raf=0;el.addEventListener('pointermove',event=>{if(!el.classList.contains('has-object-art'))return;const rect=el.getBoundingClientRect();const x=Math.max(-1,Math.min(1,(event.clientX-rect.left)/rect.width*2-1)),y=Math.max(-1,Math.min(1,(event.clientY-rect.top)/rect.height*2-1));cancelAnimationFrame(raf);raf=requestAnimationFrame(()=>{el.style.setProperty('--art-x',(x*4).toFixed(2)+'px');el.style.setProperty('--art-y',(y*3).toFixed(2)+'px')})});el.addEventListener('pointerleave',()=>{cancelAnimationFrame(raf);el.style.setProperty('--art-x','0px');el.style.setProperty('--art-y','0px')})})})();

/* Motion design layer: no generated imagery. Motion is optional; native WAAPI is the fallback. */
;(()=>{
  const reduce=matchMedia('(prefers-reduced-motion: reduce)');
  const cards=[...document.querySelectorAll('.service-scene-v6')];
  const ease=[.22,1,.36,1];
  const running=new WeakMap();
  let engine=null;
  const play=(el,frames,ms,delay=0)=>{
    if(!el||reduce.matches)return;
    const prev=running.get(el);if(prev){try{prev.cancel?.()}catch{}}
    let a;
    try{
      if(engine?.animate) {
        const props={};Object.keys(frames[0]).forEach(k=>props[k]=frames.map(f=>f[k]));
        a=engine.animate(el,props,{duration:ms/1000,delay:delay/1000,ease});
      }else if(el.animate){a=el.animate(frames,{duration:ms,delay,easing:'cubic-bezier(.22,1,.36,1)',fill:'backwards'})}
    }catch{try{a=el.animate(frames,{duration:ms,delay,easing:'cubic-bezier(.22,1,.36,1)',fill:'backwards'})}catch{}}
    if(a)running.set(el,a);
  };
  // Three approach cards become distinct working-style visual compositions.
  const approaches={
    components:'<div class="motion-assembly"><div class="assembly-module"><b>UI</b><span>Интерфейс</span></div><div class="assembly-module"><b>API</b><span>Подключение</span></div><div class="assembly-module"><b>✓</b><span>Настройка</span></div><div class="assembly-result"><i></i><b>Готовый модуль</b><span>Компоненты собраны</span></div></div>',
    hybrid:'<div class="motion-hybrid"><div class="hybrid-source"><b>Готовые модули</b><i></i><i></i></div><div class="hybrid-source"><b>Своя логика</b><span>&lt;/&gt;</span></div><div class="hybrid-join"></div><div class="hybrid-output"><i>✓</i><b>Единый продукт</b></div></div>',
    custom:'<div class="motion-custom"><div class="custom-code"><b>Бизнес-логика</b><code>if (request) {<br>&nbsp; process();<br>&nbsp; sync();<br>}</code></div><div class="custom-ui"><b>Свой интерфейс</b><i></i><div><span></span><span></span></div><span class="custom-button">Готово</span></div></div>'
  };
  cards.forEach(scene=>{
    const key=Object.keys(approaches).find(k=>scene.classList.contains('scene-'+k));
    if(key){const win=scene.querySelector('.scene-window-v6');if(win){const old=[...win.children].find(n=>!n.classList.contains('scene-top-v6'));if(old){old.outerHTML=approaches[key];scene.classList.add('motion-approach')}}}
  });
  const align=scene=>{
    if(!scene.isConnected||scene.closest('[hidden]'))return;
    scene.classList.add('motion-aligned');
    scene.dataset.motionPlayed='true';
    const win=scene.querySelector('.scene-window-v6');
    if(!win)return;
    play(win,[{transform:'perspective(850px) rotateX(6deg) rotateY(-10deg) rotateZ(-4deg) translateY(10px)'},{transform:'perspective(850px) rotateX(0deg) rotateY(0deg) rotateZ(0deg) translateY(0px)'}],720);
    const items=win.querySelectorAll('.scene-chat-v6>div,.scene-nodes-v6>span,.scene-products-v6>div,.scene-app-side-v6>span,.scene-mobile-v6>span,.scene-config-v6>div,.assembly-module,.assembly-result,.hybrid-source,.hybrid-output,.custom-code,.custom-ui,.scene-web-hero-v6>div');
    [...items].slice(0,8).forEach((el,i)=>play(el,[{opacity:.25,transform:'translateY(9px) scale(.97)'},{opacity:1,transform:'translateY(0px) scale(1)'}],430,80+Math.min(i,5)*60));
  };
  const transitions=()=>{
    // Only the changed visual content animates, never the buttons or form inputs.
    const nodes=[
      ['#workspace-demo','#workspace-body > *','[data-workspace]'],
      ['#journey-v5','.journey-steps-v5 article','[data-journey]'],
      ['#project-showcase','.showcase-info > h3,.showcase-info > p,.preview-placeholder','[data-project]']
    ];
    nodes.forEach(([root,sel,trigger])=>{
      const el=document.querySelector(root);if(!el)return;
      el.addEventListener('click',e=>{if(!e.target.closest(trigger))return;requestAnimationFrame(()=>{
        [...el.querySelectorAll(sel)].slice(0,6).forEach((n,i)=>play(n,[{opacity:.45,transform:'translateY(7px)'},{opacity:1,transform:'translateY(0px)'}],300,i*40));
      })});
    });
  };
  const start=()=>{
    if(reduce.matches){cards.forEach(s=>s.classList.add('motion-aligned'));return}
    if(engine?.inView){
      engine.inView(cards,el=>{align(el)},{amount:.35});
    }else if('IntersectionObserver'in window){
      const obs=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){align(e.target);obs.unobserve(e.target)}}),{threshold:.35});cards.forEach(el=>obs.observe(el));
    }else cards.forEach(align);
    transitions();
    document.documentElement.dataset.marketingMotion=engine?.animate?'motion':'native';
  };
  // The published site receives a pinned local vendor bundle. No third-party
  // browser request is needed, and a failed library load never hides content.
  let begun=false;const begin=()=>{if(begun)return;begun=true;engine=window.Motion||null;start()};
  if(window.Motion){begin();return}
  const script=document.createElement('script');script.src='/parsing/marketing/vendor/motion.js';script.async=true;
  script.onload=begin;script.onerror=begin;document.head.append(script);setTimeout(begin,1200);
})();


/* LiquidGlassTabBar — seven-item native DOM adaptation of the supplied React component.
   Original damped spring: z=.53, wn=11.1, ~14% overshoot, settles at 1.2s. */
;(()=>{
  const nav=document.getElementById('nav');
  if(!nav||nav.classList.contains('liquid-glass-nav'))return;
  const links=[...nav.querySelectorAll(':scope > a')];
  const directions=nav.querySelector(':scope > .mega-toggle');
  const panel=nav.querySelector(':scope > .mega');
  if(links.length!==6||!directions||!panel)return;
  const items=[...links,directions],count=items.length;
  const labels=['Главная','Услуги','Решения для бизнеса','Стоимость','Партнёрство','Проекты','Направления'];
  const icons=[
    '<path fill="currentColor" stroke="currentColor" stroke-width="2.6" stroke-linejoin="round" d="M12 2.7 22 10v11H16v-4.5a3.5 3.5 0 0 0-3.5-3.5h-1A3.5 3.5 0 0 0 8 16.5V21H2V10Z"/>',
    '<g fill="currentColor"><rect x="2" y="2" width="9" height="9" rx="2.4"/><rect x="13" y="2" width="9" height="9" rx="2.4"/><rect x="2" y="13" width="9" height="9" rx="2.4"/><rect x="13" y="13" width="9" height="9" rx="2.4"/></g>',
    '<path fill="currentColor" d="M8.5 2.2a3.5 3.5 0 0 1 7 0v2H20a2 2 0 0 1 2 2v4.2h-2a3.5 3.5 0 0 0 0 7h2V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6.2a2 2 0 0 1 2-2h4.5Z"/>',
    '<path d="M8 22V3h6.4a5.2 5.2 0 0 1 0 10.4H5M5 17h11" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>',
    '<g fill="currentColor"><circle cx="12" cy="6.2" r="5"/><path d="M2 21a10 10 0 0 1 20 0v1H2Z"/></g>',
    '<g fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round"><rect x="2" y="3" width="20" height="14" rx="2.5"/><path d="M12 17v4M7 21h10"/></g>',
    '<g fill="none" stroke="currentColor" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"><path d="M12 2v20M2 12h20M8 6l4-4 4 4M8 18l4 4 4-4M6 8l-4 4 4 4M18 8l4 4-4 4"/></g>'
  ];
  const current=Math.max(0,links.findIndex(a=>a.hasAttribute('aria-current')));
  const reduce=matchMedia('(prefers-reduced-motion: reduce)');
  const track=document.createElement('div');track.className='lgt-track';
  const lens=document.createElement('div');lens.className='lgt-lens';lens.setAttribute('aria-hidden','true');
  lens.innerHTML='<div class="lgt-clip"><div class="lgt-glass"></div><div class="lgt-refracted"></div><div class="lgt-band lgt-band-top"></div><div class="lgt-band lgt-band-bottom"></div><div class="lgt-glow"></div></div><div class="lgt-rim"></div>';
  track.append(lens);
  items.forEach((el,i)=>{
    el.classList.add('lgt-item');el.dataset.lgtIndex=String(i);
    el.setAttribute('aria-label',labels[i]);el.title=labels[i];
    el.innerHTML='<svg class="lgt-icon" viewBox="0 0 24 24" aria-hidden="true">'+icons[i]+'</svg><span class="lgt-label">'+labels[i]+'</span>';
    track.append(el);
  });
  nav.insertBefore(track,panel);nav.classList.add('liquid-glass-nav');
  panel.id='liquid-glass-directions';directions.setAttribute('aria-controls',panel.id);
  let selected=current,raf=0,redirect=0,cell=1,lensWidth=1,cur={lens:0,x:[]};
  const target=n=>{
    const w=track.clientWidth;
    // Expand the active cell on compact layouts to make the Russian label fit.
    const active=Math.min(w-6*34,Math.max(cell*1.13,78));
    const base=(w-active)/(count-1),extra=active-base;
    const centers=Array.from({length:count},(_,i)=>base*(i+.5)+(i>n?extra:i===n?extra/2:0));
    const shift=w>440?cell*.055:0;
    centers.forEach((v,i)=>{if(i!==n)centers[i]=v+(i<n?-1:1)*shift*Math.exp(-Math.abs(i-n)*.5)});
    return {lens:centers[n],x:centers,activeWidth:base+extra,base};
  };
  const paint=()=>{
    const left=Math.max(-4,Math.min(track.clientWidth-lensWidth+4,cur.lens-lensWidth/2));
    lens.style.transform='translate3d('+left+'px,0,0)';
    lens.style.setProperty('--lgt-offset',(-left)+'px');
    lens.style.setProperty('--lgt-track-width',track.clientWidth+'px');
    items.forEach((el,i)=>{el.style.left=cur.x[i]+'px'});
  };
  const size=()=>{
    if(!track.clientWidth)return;
    cancelAnimationFrame(raf);
    cell=track.clientWidth/count;const to=target(selected);
    lensWidth=to.activeWidth+8;
    lens.style.width=lensWidth+'px';
    items.forEach((el,i)=>{el.style.width=(i===selected?to.activeWidth:to.base)+'px'});
    cur={lens:to.lens,x:to.x.slice()};paint();
  };
  const spring=t=>{const z=.53,wn=11.1,wd=wn*Math.sqrt(1-z*z),k=z/Math.sqrt(1-z*z);return t<=0?0:1-Math.exp(-z*wn*t)*(Math.cos(wd*t)+k*Math.sin(wd*t))};
  const select=n=>{
    if(n<0||n>=count)return;
    selected=n;
    items.forEach((el,i)=>el.classList.toggle('lgt-on',i===n));
    track.dataset.active=String(n);
    cancelAnimationFrame(raf);
    const to=target(n),from={lens:cur.lens,x:cur.x.slice()};
    lensWidth=to.activeWidth+8;lens.style.width=lensWidth+'px';
    items.forEach((el,i)=>{el.style.width=(i===n?to.activeWidth:to.base)+'px'});
    if(reduce.matches||!from.x.length||Math.abs(from.lens-to.lens)<.01){cur={lens:to.lens,x:to.x.slice()};paint();return}
    const t0=performance.now();
    const tick=now=>{
      const t=(now-t0)/1000,p=t>=1.2?1:spring(t);
      cur={lens:from.lens+(to.lens-from.lens)*p,x:from.x.map((v,i)=>v+(to.x[i]-v)*p)};
      paint();if(t<1.2)raf=requestAnimationFrame(tick);
    };
    raf=requestAnimationFrame(tick);
  };
  size();select(current);
  if('ResizeObserver'in window)new ResizeObserver(size).observe(track);
  else window.addEventListener('resize',size);
  links.forEach((el,i)=>el.addEventListener('click',e=>{
    if(e.defaultPrevented||e.button!==0||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey||el.target==='_blank')return;
    clearTimeout(redirect);
    if(el.href===location.href){e.preventDefault();panel.hidden=true;select(current);return}
    if(reduce.matches)return;
    e.preventDefault();panel.hidden=true;select(i);
    redirect=setTimeout(()=>location.assign(el.href),620);
  }));
  directions.addEventListener('click',()=>{clearTimeout(redirect);select(panel.hidden?current:6)});
  new MutationObserver(()=>{if(panel.hidden&&selected===6)select(current);else if(!panel.hidden&&selected!==6)select(6)}).observe(panel,{attributes:true,attributeFilter:['hidden']});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&selected===6){clearTimeout(redirect);select(current);directions.focus();}});
  panel.addEventListener('click',e=>{if(e.target.closest('a')){panel.hidden=true;directions.setAttribute('aria-expanded','false');}});
  window.addEventListener('pageshow',()=>{clearTimeout(redirect);panel.hidden=true;directions.setAttribute('aria-expanded','false');size();select(current)});
})();

/* Spotlight Card / GlowCard — native adaptation of the supplied React component.
   Preserve each existing surface's layout, color and interactive descendants.
   Original defaults: blue base 220, spread 200, 200px spotlight, 3px rim. */
;(()=>{
  const root=document.documentElement;
  const selector=[
    '.hero','.tile','.story-tile-v5','.ref-project','.rows','.rows > article',
    '.metrics','.metrics > div','.faq','.faq > details','.promo','.contact',
    '.experience > article','.audit-offer','.audit-board','.economy-panel','.economy-result',
    '.workspace-demo','.workspace-content','.workspace-kpis > div','.steps-path-host',
    '.ref-chart-board','.journey-v5','.journey-steps-v5 > article',
    '.club-demo','.club-screen','.club-product','.club-cart',
    '.calc','.calc-result','.flow','.table-wrap','.tier-simulator','.tier-result',
    '.partner-presets > button','.finder-demo','.finder-panel','.finder-results',
    '.showcase','.showcase-screen'
  ].join(',');
  const fine=matchMedia('(hover: hover) and (pointer: fine)');
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const cards=new Set(), active=new Set();
  let point=null,frame=0;
  const enabled=()=>fine.matches&&!reduced.matches;
  const register=el=>{
    if(cards.has(el))return;
    cards.add(el);el.setAttribute('data-glow','');
    if(getComputedStyle(el).position==='static')el.classList.add('spotlight-position');
  };
  const scan=node=>{
    if(node.nodeType!==1&&node.nodeType!==9)return;
    if(node.matches?.(selector))register(node);
    node.querySelectorAll(selector).forEach(register);
  };
  scan(document);
  root.dataset.spotlight='ready';
  const clear=()=>{active.forEach(el=>el.classList.remove('spotlight-active'));active.clear()};
  const render=()=>{
    frame=0;
    if(!point||!enabled()){clear();return}
    const {x,y}=point, hue=220+200*Math.max(0,Math.min(1,x/Math.max(1,innerWidth)));
    const next=new Set(), updates=[];
    for(const el of cards){
      if(!el.isConnected){cards.delete(el);continue}
      if(el.hidden||el.closest('[hidden]'))continue;
      const b=el.getBoundingClientRect();
      if(!b.width||!b.height||b.bottom<-200||b.top>innerHeight+200)continue;
      const dx=Math.max(b.left-x,0,x-b.right),dy=Math.max(b.top-y,0,y-b.bottom);
      if(dx*dx+dy*dy>200*200)continue;
      next.add(el);updates.push([el,x-b.left,y-b.top]);
    }
    for(const el of active)if(!next.has(el)){el.classList.remove('spotlight-active');active.delete(el)}
    for(const [el,lx,ly] of updates){
      el.style.setProperty('--spot-x',lx.toFixed(2)+'px');
      el.style.setProperty('--spot-y',ly.toFixed(2)+'px');
      el.style.setProperty('--spot-hue',hue.toFixed(2));
      if(!active.has(el)){el.classList.add('spotlight-active');active.add(el)}
    }
  };
  const schedule=()=>{if(!frame)frame=requestAnimationFrame(render)};
  const reset=()=>{point=null;if(frame)cancelAnimationFrame(frame);frame=0;clear()};
  document.addEventListener('pointermove',e=>{
    if(!enabled()||e.pointerType==='touch')return;
    point={x:e.clientX,y:e.clientY};schedule();
  },{passive:true});
  document.documentElement.addEventListener('pointerleave',reset);
  window.addEventListener('blur',reset);
  window.addEventListener('scroll',()=>{if(point)schedule()},{passive:true,capture:true});
  window.addEventListener('resize',()=>{if(point)schedule()},{passive:true});
  document.addEventListener('visibilitychange',()=>{if(document.hidden)reset()});
  fine.addEventListener?.('change',reset);reduced.addEventListener?.('change',reset);
  // Existing dashboards and filtered views may replace their content.
  // Observe additions only; do not react to the spotlight's own style writes.
  const observer=new MutationObserver(records=>{
    let added=false;
    for(const rec of records)for(const node of rec.addedNodes)if(node.nodeType===1){scan(node);added=true}
    if(added&&point)schedule();
  });
  observer.observe(document.body,{childList:true,subtree:true});
})();

/* Progressive enhancement: the original HTML hero remains if either asset fails. */
;(()=>{
  if(!document.querySelector('.hero')||document.querySelector('link[data-provably-css]'))return;
  const style=document.createElement('link');style.rel='stylesheet';style.href='/parsing/marketing/vendor/provably.css';style.dataset.provablyCss='';
  style.addEventListener('load',()=>{
    const script=document.createElement('script');script.src='/parsing/marketing/vendor/provably.js';script.async=true;script.dataset.provablyJs='';
    script.addEventListener('error',()=>{document.documentElement.dataset.provably='fallback'});
    document.head.append(script);
  },{once:true});
  style.addEventListener('error',()=>{document.documentElement.dataset.provably='fallback'},{once:true});
  document.head.append(style);
})();

/* HowItWorks pinned cards — native port of the supplied component.
   Exact section labels only; no global card selectors or content changes. */
;(()=>{
  const svgNS='http://www.w3.org/2000/svg';
  const pinPath='M16 3a1 1 0 0 1 .117 1.993l-.117 .007v4.764l1.894 3.789a1 1 0 0 1 .1 .331l.006 .116v2a1 1 0 0 1 -.883 .993l-.117 .007h-4v4a1 1 0 0 1 -1.993 .117l-.007 -.117v-4h-4a1 1 0 0 1 -.993 -.883l-.007 -.117v-2a1 1 0 0 1 .06 -.34l.046 -.107l1.894 -3.791v-4.762a1 1 0 0 1 -.117 -1.993l.117 -.007h8z';
  const labels=new Set(['С чем ко мне приходят','Практический подход']);
  for(const section of document.querySelectorAll('section.section')){
    const label=section.querySelector(':scope > .section-head > .eyebrow')?.textContent.trim();
    if(!labels.has(label)&&!section.hasAttribute('data-pinned-source'))continue;
    const grid=section.querySelector(':scope > .rows, :scope > .story-grid-v5, :scope > .journey-v5 > .journey-steps-v5');
    if(!grid)continue;
    section.dataset.pinnedApproach='true';grid.classList.add('pinned-approach');
    const svg=document.createElementNS(svgNS,'svg');svg.classList.add('pinned-connector');svg.setAttribute('aria-hidden','true');svg.setAttribute('preserveAspectRatio','none');
    const path=document.createElementNS(svgNS,'path');path.setAttribute('fill','none');path.setAttribute('stroke-width','2');path.setAttribute('stroke-dasharray','8 6');path.setAttribute('stroke-linecap','round');path.setAttribute('vector-effect','non-scaling-stroke');svg.append(path);
    let raf=0;
    const draw=()=>{
      raf=0;
      const cards=[...grid.querySelectorAll(':scope > article.pinned-note')];
      const box=grid.getBoundingClientRect();
      if(!box.width||!box.height||cards.length<2){path.setAttribute('d','');return}
      svg.setAttribute('viewBox','0 0 '+box.width+' '+box.height);
      const pts=cards.map(card=>{const r=card.getBoundingClientRect();return [r.left+r.width/2-box.left,r.top+r.height/2-box.top]});
      let d='M '+pts[0].join(' ');
      for(let i=1;i<pts.length;i++){
        const a=pts[i-1],z=pts[i],mid=(a[0]+z[0])/2;
        d+=' C '+mid+' '+a[1]+', '+mid+' '+z[1]+', '+z.join(' ');
      }
      path.setAttribute('d',d);
    };
    const schedule=()=>{if(!raf)raf=requestAnimationFrame(draw)};
    const observer='ResizeObserver'in window?new ResizeObserver(schedule):null;
    const decorate=()=>{
      const cards=[...grid.querySelectorAll(':scope > article')];
      cards.forEach((card,i)=>{
        if(card.classList.contains('pinned-note'))return;
        const h=card.querySelector('h3'),p=card.querySelector('p');
        if(!h||!p)return;
        const num=card.querySelector('.num,.story-number-v5,:scope > b');
        const number=document.createElement('span');number.className='pinned-number';number.textContent=num?.textContent.trim()||String(i+1).padStart(2,'0');
        const pin=document.createElementNS(svgNS,'svg');pin.setAttribute('viewBox','0 0 24 24');pin.setAttribute('width','32');pin.setAttribute('height','32');pin.setAttribute('fill','currentColor');pin.setAttribute('aria-hidden','true');pin.classList.add('pinned-pin');
        const icon=document.createElementNS(svgNS,'path');icon.setAttribute('d',pinPath);pin.append(icon);
        const body=document.createElement('div');body.className='pinned-note-body';body.append(number,h,...[...card.querySelectorAll('p, a.textlink, a.btn')]);
        const frame=document.createElement('div');frame.className='pinned-note-frame';frame.append(pin,body);
        card.replaceChildren(frame);
        card.classList.add('pinned-note');card.dataset.pinTheme=['gold','blue','lavender'][i%3];
        card.style.setProperty('--pin-rotation',i%2?'-8deg':'8deg');
      });
      if(!svg.isConnected)grid.prepend(svg);
      observer?.disconnect();observer?.observe(grid);cards.forEach(c=>observer?.observe(c));
      schedule();
    };
    decorate();
    // Scenario buttons replace only their own three articles; decorate those again.
    if(grid.classList.contains('journey-steps-v5')){
      new MutationObserver(()=>{if(!svg.isConnected||grid.querySelector(':scope > article:not(.pinned-note)'))decorate()}).observe(grid,{childList:true});
    }
    window.addEventListener('resize',schedule,{passive:true});
    document.fonts?.ready.then(schedule);
  }
})();

/* Content revision: additive scenario and recommendation functionality, existing styles only. */
;(()=>{const root=$('business-scenarios');if(root){const scenarios=[["Продажа товаров","От интереса покупателя до выполненного заказа.",[["Клиент открывает каталог","Знакомится с товарами на сайте или в приложении."],["Получает консультацию","ИИ-консультант помогает подобрать подходящий товар."],["Оформляет заказ","Самостоятельно выбирает комплектацию и дополнительные услуги."],["Оплачивает покупку","Выбирает доступный способ оплаты и получения."],["Информация передаётся в систему","Заказ поступает сотрудникам и синхронизируется с CRM."],["Получает товар","Компания выполняет заказ и сохраняет историю взаимодействия."]]],["Оказание услуг","Клиент выбирает услугу, получает консультацию, записывается, получает подтверждение и посещает компанию. Сотрудники располагают информацией о запросе и записи.",[]],["Обработка заявок","Обращение поступает в систему, уточняется потребность, выполняется квалификация, информация передаётся менеджеру для дальнейшей работы.",[]],["Работа с оптовыми клиентами","Контрагент авторизуется, получает доступ к индивидуальным ценам, подбирает продукцию, оформляет заказ. Информация поступает в учётную систему.",[]],["Внутренние процессы компании","Сотрудник получает задачу, обращается к корпоративным данным, система выполняет согласованные действия и передаёт результат ответственному сотруднику.",[]]];const content=$('business-scenario-content');const show=n=>{const row=scenarios[n];if(!row)return;const p=document.createElement('p');p.textContent=row[1];const grid=document.createElement('div');grid.className='journey-steps-v5';row[2].forEach(([title,desc],i)=>{const a=document.createElement('article'),b=document.createElement('b'),h=document.createElement('h3'),p=document.createElement('p');b.textContent=String(i+1).padStart(2,'0');h.textContent=title;p.textContent=desc;a.append(b,h,p);grid.append(a)});content.replaceChildren(p,...(row[2].length?[grid]:[]));root.querySelectorAll('[data-business-scenario]').forEach(b=>b.setAttribute('aria-pressed',String(+b.dataset.businessScenario===n)))};root.addEventListener('click',e=>{const b=e.target.closest('[data-business-scenario]');if(b)show(+b.dataset.businessScenario)});show(0)}})();
;(()=>{const root=$('business-diagnosis');if(!root)return;const matrix=[["Онлайн-запись и собственный клиентский сервис; ИИ-консультант для входящих обращений; коммерческий сайт с интерактивным каталогом","Интеграция обращений и записи с CRM; автоматизация уведомлений; ассистент для сотрудников","Собственное приложение для клиентов; цифровая система бронирования"],["Интернет-магазин и собственный канал заказов; ИИ-консультант по каталогу; программа лояльности","Интеграция склада и заказов; автоматизация обработки покупок","B2B-портал; интерактивный конфигуратор продукции"],["Собственный сервис онлайн-заказов; Telegram Mini App с меню","Интеграция заказов с учётной системой; автоматизация бронирования","Система заказа непосредственно с места; клиентское приложение с лояльностью"],["Интерактивный каталог; конфигуратор с предварительным расчётом","Интеграция CRM и ERP; автоматизация обработки запросов","Закрытая дилерская платформа; B2B-портал"],["Развитие собственного цифрового канала; интеллектуальная обработка обращений","Анализ повторяющихся операций; интеграция существующих сервисов","Проектирование индивидуального приложения; разработка MVP"]],notes=["Можно начать с отдельного инструмента и постепенно расширять его функциональность","Приоритет — оценить возможность развития и интеграции существующих систем","Начать стоит с обсуждения действующих процессов и определения приоритетной задачи"];const result=()=>{const a=+$('diag-industry').value,b=+$('diag-goal').value,c=+$('diag-position').value;const list=matrix[a][b].split('; ').map(t=>{const li=document.createElement('li');li.textContent=t;return li});$('business-recommendations').replaceChildren(...list);$('business-recommendation-note').textContent=notes[c]};root.addEventListener('change',result);result();$('business-diagnosis-request').addEventListener('click',()=>{const text=['Подбор решений:',$('diag-industry').selectedOptions[0].textContent,$('diag-goal').selectedOptions[0].textContent,$('diag-position').selectedOptions[0].textContent,...[...$('business-recommendations').children].map(e=>e.textContent)].join('\n');const target=document.querySelector('#request textarea[name=message]');if(target&&!target.value.includes(text))target.value=(target.value?target.value+'\n\n':'')+text})})();
;(()=>{const root=$('business-economics');if(!root)return;const n=id=>{const el=$(id);return Math.max(0,Math.min(Number(el.max)||1e9,Number(el.value)||0))};const recalc=()=>{const turnover=n('sales-orders')*n('sales-check'),gross=turnover*n('sales-margin')/100,own=gross-n('sales-expense'),market=gross-turnover*n('sales-commission')/100;$('sales-result').textContent=rub(own)+' / мес.';$('sales-result').nextElementSibling.textContent='Разница относительно сценария со сторонней площадкой: '+rub(own-market)+' / мес. При одинаковом объёме продаж. Без учёта бюджета разработки и дополнительных расходов на привлечение.';const profit=n('product-users')*(n('product-price')-n('product-variable'))-n('product-fixed');$('product-result').textContent=rub(profit)+' / мес.';$('product-payback').textContent=profit>0?'Расчётный срок покрытия разработки: '+(n('product-build')/profit).toLocaleString('ru-RU',{maximumFractionDigits:1})+' мес.':'При введённых параметрах стоимость разработки не покрывается.'};root.addEventListener('input',recalc);recalc()})();
