import React,{useEffect,useMemo,useRef,useState} from 'react';
import {createRoot} from 'react-dom/client';
import {motion,AnimatePresence} from 'motion/react';
import {ArrowRight,ArrowUpRight,Check,CheckCircle2,ChevronDown,Phone,MapPin,Clock3,Sun,Moon,Menu,X,ExternalLink,Search,ShieldCheck,ScanLine,Settings2,Disc3,CarFront,Wrench,ClipboardCopy,Info,Activity,Route,OilCan,Layers3,MessageSquareText,Gauge} from 'lucide-react';
import CarBlueprint from './CarBlueprint.jsx';
import {COMPANY,SERVICES,SYMPTOMS,FAQ} from './data.js';
import './style.css';

const PAGES=[['/','Главная'],['/services','Услуги'],['/work','Работы'],['/prices','Стоимость'],['/contact','Контакты']];
const to=(p)=>'#'+p;
const current=()=>{const r=location.hash.slice(1).split('?')[0];return PAGES.some(([p])=>p===r)?r:'/'};
const ICONS={diagnostic:ScanLine,maintenance:OilCan,engine:Settings2,suspension:Disc3,steering:Gauge,transmission:Layers3,metal:Wrench,parts:CarFront};
const Logo=()=> <a className="brand" href="#/" aria-label="Доктор Кар — главная"><span className="logo-mark"><i/><i/></span><span className="logo-text"><strong>ДОКТОР <em>КАР</em></strong><small>АВТОСЕРВИС · КРАСНОДАР</small></span></a>;
const Icon=({id,size=26})=>{const Component=ICONS[id]||Wrench;return <Component size={size} strokeWidth={1.65}/>};
const Btn=({children,href,onClick,kind='primary',className='',...props})=>href?<a href={href} className={'btn btn-'+kind+' '+className} {...props}>{children}</a>:<button type="button" onClick={onClick} className={'btn btn-'+kind+' '+className} {...props}>{children}</button>;
const Eyebrow=({children})=><div className="eyebrow"><span className="eyebrow-dash"/> {children}</div>;
const SectionTitle=({label,title,desc,side})=><div className="section-heading"><div><Eyebrow>{label}</Eyebrow><h2>{title}</h2>{desc&&<p>{desc}</p>}</div>{side&&<div className="heading-side">{side}</div>}</div>;
function Spotlight({children,className=''}){const move=e=>{const r=e.currentTarget.getBoundingClientRect();e.currentTarget.style.setProperty('--x',(e.clientX-r.left)+'px');e.currentTarget.style.setProperty('--y',(e.clientY-r.top)+'px')};return <div className={'spotlight '+className} onPointerMove={move}>{children}</div>}
function App(){
 const [route,setRoute]=useState(current);
 const [theme,setTheme]=useState(()=>{try{return localStorage.getItem('doctorcar-theme')==='light'?'light':'dark'}catch{return 'dark'}});
 const [menu,setMenu]=useState(false);
 const [ask,setAsk]=useState(null);
 useEffect(()=>{const handler=()=>{setRoute(current());setMenu(false);window.scrollTo(0,0)};window.addEventListener('hashchange',handler);return()=>window.removeEventListener('hashchange',handler)},[]);
 useEffect(()=>{document.documentElement.dataset.theme=theme;document.documentElement.style.colorScheme=theme;try{localStorage.setItem('doctorcar-theme',theme)}catch{}},[theme]);
 const content=route==='/services'?<ServicesPage onAsk={setAsk}/>:route==='/work'?<WorkPage onAsk={setAsk}/>:route==='/prices'?<PricesPage onAsk={setAsk}/>:route==='/contact'?<ContactPage onAsk={setAsk}/>:<Home onAsk={setAsk}/>;
 return <div className="app">
  <a className="skip" href="#main">К содержимому</a>
  <div className="demo-notice">НЕОФИЦИАЛЬНЫЙ ДИЗАЙН-КОНЦЕПТ · ЗАЯВКИ ЧЕРЕЗ САЙТ НЕ ПОДТВЕРЖДАЮТСЯ</div>
  <header className="header"><div className="shell header-inner">
   <Logo/>
   <nav className={'nav'+(menu?' is-open':'')} id="main-nav" aria-label="Навигация">{PAGES.map(([path,label])=><a href={to(path)} key={path} aria-current={route===path?'page':undefined} onClick={()=>setMenu(false)}>{label}</a>)}</nav>
   <div className="header-right">
    <button type="button" className="theme-toggle" onClick={()=>setTheme(t=>t==='dark'?'light':'dark')} aria-label={'Включить '+(theme==='dark'?'светлую':'тёмную')+' тему'} title="Сменить тему">
     <Sun size={17}/><Moon size={17}/><span className="theme-dot" data-theme={theme}/></button>
    <a className="phone-link" href={'tel:'+COMPANY.tel}><Phone size={16}/><span>{COMPANY.phone}</span></a>
    <Btn onClick={()=>setAsk('Консультация по ремонту')} className="header-cta">Связаться <ArrowUpRight size={18}/></Btn>
    <button type="button" className="menu-toggle" onClick={()=>setMenu(!menu)} aria-expanded={menu} aria-controls="main-nav" aria-label={menu?'Закрыть меню':'Открыть меню'}>{menu?<X size={22}/>:<Menu size={22}/>}</button>
   </div>
  </div></header>
  <main id="main">{content}<FAQSection/></main><Footer/>
  <nav className="mobile-dock" aria-label="Быстрые действия"><a href="#/services"><Wrench size={18}/>Услуги</a><button type="button" onClick={()=>setAsk('Консультация по ремонту')}><MessageSquareText size={18}/>Запрос</button><a href={'tel:'+COMPANY.tel}><Phone size={18}/>Звонок</a></nav>
  {ask!==null&&<Inquiry key={ask} value={ask} close={()=>setAsk(null)}/>}
 </div>
}
function Service({item,index,onAsk}){
 return <Spotlight className="service-card"><div className="service-top"><span className="service-icon"><Icon id={item.id}/></span><span className="card-index">{String(index+1).padStart(2,'0')}</span></div>
 <h3>{item.name}</h3><p>{item.desc}</p><div className="service-details">{item.tags.slice(0,3).map(x=><span key={x}>{x}</span>)}</div>
 <button type="button" className="service-action" onClick={()=>onAsk(item.name)}>Уточнить услугу <ArrowUpRight size={17}/></button></Spotlight>
}
function Home({onAsk}){
 const [part,setPart]=useState('diagnostic');
 const selected=SERVICES.find(x=>x.id===part)||SERVICES[0];
 return <>
 <section className="shell hero"><div className="hero-main">
  <div className="hero-copy"><Eyebrow>КРАСНОДАР · УЛИЦА ЖЛОБЫ, 24</Eyebrow>
   <h1>Ремонт начинается <em>с причины.</em></h1>
   <p className="hero-lead">Диагностика, обслуживание и ремонт автомобилей. Сперва разберёмся в задаче, затем обсудим подходящие работы.</p>
   <div className="hero-buttons"><Btn onClick={()=>onAsk(selected.name)}>Обсудить неисправность <ArrowUpRight size={19}/></Btn><Btn kind="glass" href="#/services">Наши услуги <ArrowRight size={18}/></Btn></div>
   <div className="hero-note"><CheckCircle2 size={15}/> Запись и стоимость подтверждает сотрудник сервиса</div>
  </div>
  <div className="hero-car"><div className="hero-car-caption"><span className="live-dot"/> ИНТЕРАКТИВНАЯ СХЕМА АВТОМОБИЛЯ</div>
   <CarBlueprint active={part} onPick={setPart}/>
   <Spotlight className="system-card"><div className="system-top"><span>ВЫБРАННОЕ НАПРАВЛЕНИЕ</span><ScanLine size={20}/></div><h3>{selected.name}</h3><p>{selected.desc}</p>
    <div className="system-points">{selected.tags.slice(0,3).map(x=><span key={x}><Check size={14}/>{x}</span>)}</div>
    <button type="button" onClick={()=>onAsk(selected.name)}>Получить консультацию <ArrowUpRight size={15}/></button>
   </Spotlight>
  </div>
 </div><div className="hero-meta">
  <div><MapPin size={18}/>{COMPANY.address}</div><div><Clock3 size={18}/>{COMPANY.hours}</div><div><Wrench size={18}/>Диагностика и ремонт</div><a href={COMPANY.map} target="_blank" rel="noopener noreferrer">Маршрут <ArrowUpRight size={17}/></a>
 </div></section>
 <section className="shell section"><SectionTitle label="01 / НАПРАВЛЕНИЯ" title={<>Когда нужна <em>точная работа.</em></>} desc="Выберите узел автомобиля. В каталоге указаны направления, опубликованные в открытых источниках." side={<a className="text-link" href="#/services">Весь каталог <ArrowUpRight size={17}/></a>}/>
  <div className="services-grid">{SERVICES.slice(0,6).map((s,i)=><Service key={s.id} item={s} index={i} onAsk={onAsk}/>)}</div></section>
 <SymptomSelector onAsk={onAsk}/><Process/><Showcase/><Trust/><CTA onAsk={onAsk}/></>
}
function SymptomSelector({onAsk}){
 const [active,setActive]=useState(0);const s=SYMPTOMS[active];
 return <section className="shell section"><div className="symptom-panel"><div><Eyebrow>02 / С ЧЕГО НАЧАТЬ</Eyebrow><h2>Не знаете, как называется поломка?</h2><p>Выберите признак неисправности. Это подсказка для разговора, а не дистанционный диагноз.</p></div>
 <div className="symptom-interactive"><div className="symptom-options" role="group" aria-label="Признаки неисправности">{SYMPTOMS.map((x,i)=><button type="button" key={x.id} className={active===i?'is-selected':''} aria-pressed={active===i} onClick={()=>setActive(i)}>{x.label}<ArrowUpRight size={16}/></button>)}</div>
  <AnimatePresence mode="wait"><motion.div key={s.id} className="symptom-result" initial={{opacity:.8,y:5}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-5}} transition={{duration:.2}}><span className="overline">ВОЗМОЖНОЕ НАПРАВЛЕНИЕ</span><h3>{s.title}</h3><p>{s.desc}</p><Btn onClick={()=>onAsk(SERVICES.find(x=>x.id===s.service)?.name||'Консультация')}>Обсудить с мастером <ArrowUpRight size={16}/></Btn></motion.div></AnimatePresence>
 </div></div></section>
}
function Process(){const arr=[['01','Опишите ситуацию','Расскажите о машине и о том, при каких условиях возникла проблема.'],['02','Уточните диагностику','Мастер подскажет, с какого осмотра начать и какие данные нужны.'],['03','Согласуйте работы','Состав и стоимость ремонта необходимо подтвердить до выполнения.']];
 return <section className="shell section"><SectionTitle label="03 / КАК ЭТО УСТРОЕНО" title={<>Всё <em>по делу.</em></>} desc="Простой маршрут от первого обращения до решения по ремонту."/><div className="process-grid">{arr.map(([n,h,p])=><div className="process-card" key={n}><strong>{n}</strong><h3>{h}</h3><p>{p}</p></div>)}</div></section>
}
function Showcase(){return <section className="shell section"><SectionTitle label="04 / РАБОТЫ" title={<>Техника в <em>деталях.</em></>} desc="Визуализации узлов автомобиля созданы для интерфейса. Фактические фотографии мастерской смотрите в карточке компании на Яндекс Картах." side={<a className="text-link" href={COMPANY.map} target="_blank" rel="noopener noreferrer">Реальные фото <ExternalLink size={17}/></a>}/>
 <div className="showcase-grid">{[['engine','Двигатель','ГБЦ · ГРМ · ремонт'],['suspension','Ходовая','Подвеска · тормоза'],['steering','Управление','Рейка · ГУР · тяги']].map(([id,title,desc],i)=><Spotlight className={'showcase-tile showcase-'+id} key={id}>
 <div className="showcase-figure"><span className="showcase-circle"/><Icon id={id} size={104}/><span className="showcase-serial">TECH / 0{i+1}</span></div><div className="showcase-caption"><span>{desc}</span><h3>{title}</h3><a href="#/services" aria-label={'Открыть каталог: '+title}><ArrowUpRight size={23}/></a></div>
 </Spotlight>)}</div><p className="source-note"><Info size={16}/> Здесь нет вымышленных фотографий выполненных работ.</p>
 </section>}
function Trust(){return <section className="shell section trust-section"><div><Eyebrow>05 / ДОВЕРИЕ</Eyebrow><h2>Ремонт, который <em>можно объяснить.</em></h2><p>В открытых отзывах посетители отмечают диагностику, объяснения и помощь с запчастями. Полные оригинальные отзывы доступны на Яндекс Картах.</p><Btn href={COMPANY.map} target="_blank" rel="noopener noreferrer" kind="glass">Смотреть отзывы <ArrowUpRight size={18}/></Btn></div><div className="trust-items">
 <div><ShieldCheck size={23}/><h3>Понятный разговор</h3><p>Уточняйте причину и необходимые работы до принятия решения.</p></div>
 <div><Settings2 size={23}/><h3>Станочные работы</h3><p>Сварка, токарная и шлифовальная обработка указаны в справочниках сервиса.</p></div>
 <div><CarFront size={23}/><h3>Подбор запчастей</h3><p>В отзывах упоминают помощь с подбором расходников и деталей.</p></div>
 </div></section>}
function CTA({onAsk}){return <section className="shell cta"><div><Eyebrow>НУЖНА КОНСУЛЬТАЦИЯ?</Eyebrow><h2>Начните с одного обращения.</h2><p>Подготовьте описание автомобиля и задачи. Запись требует подтверждения сотрудником.</p></div><Btn onClick={()=>onAsk('Консультация по ремонту')}>Описать проблему <ArrowUpRight size={19}/></Btn></section>}
function PageHero({label,title,description}){return <div className="shell page-hero"><Eyebrow>{label}</Eyebrow><h1>{title}</h1><p>{description}</p></div>}
function ServicesPage({onAsk}){
 const [q,setQ]=useState('');const [category,setCategory]=useState('Все');
 const cats=['Все','Диагностика','Обслуживание','Ремонт'];
 const filtered=useMemo(()=>SERVICES.filter(s=>(category==='Все'||category===s.group)&&(s.name+' '+s.desc+' '+s.tags.join(' ')).toLocaleLowerCase('ru').includes(q.toLocaleLowerCase('ru'))),[q,category]);
 return <><PageHero label="01 / УСЛУГИ" title={<>По нужной <em>системе.</em></>} description="Поиск по направлениям и подуслугам. Стоимость, запчасти и возможность ремонта уточняйте у мастера."/>
 <section className="shell page-content"><div className="filters"><label className="search-field"><Search size={19}/><input type="search" value={q} onChange={e=>setQ(e.target.value)} placeholder="Поиск: ГРМ, сцепление, диагностика" aria-label="Поиск услуг"/><span>{filtered.length} из {SERVICES.length}</span></label><div className="filter-row" role="group" aria-label="Фильтр услуг">{cats.map(x=><button type="button" key={x} aria-pressed={category===x} className={category===x?'active':''} onClick={()=>setCategory(x)}>{x}</button>)}</div></div>
 <div className="services-grid">{filtered.map(s=><Service key={s.id} item={s} index={SERVICES.indexOf(s)} onAsk={onAsk}/>)}</div>
 {!filtered.length&&<div className="no-results">Совпадений нет. <button type="button" onClick={()=>{setQ('');setCategory('Все')}}>Очистить поиск</button></div>}</section><CTA onAsk={onAsk}/></>
}
function WorkPage({onAsk}){return <><PageHero label="02 / РЕМОНТ И РЕМЗОНА" title={<>Важны реальные <em>работы.</em></>} description="Визуальная часть показывает технические направления. Фотографии объектов и отзывы доступны по ссылке на карточку компании."/><Showcase/><section className="shell work-destination"><div><Eyebrow>РЕАЛЬНЫЕ МАТЕРИАЛЫ</Eyebrow><h2>Фото компании и отзывы</h2><p>Не заменяем фотографии сотрудников и помещения случайными стоковыми снимками. Откройте проверяемый первоисточник.</p></div><Btn href={COMPANY.map} target="_blank" rel="noopener noreferrer">Открыть Яндекс Карты <ExternalLink size={19}/></Btn></section><CTA onAsk={onAsk}/></>}
function PricesPage({onAsk}){return <><PageHero label="03 / СТОИМОСТЬ" title={<>Сначала причина. <em>Потом цена.</em></>} description="В предоставленных материалах нет единого подтверждённого прайса на весь ремонт. Мы не публикуем вымышленные суммы и акции."/>
 <section className="shell page-content"><div className="estimate-grid">{[['01','Марка и модель','Год выпуска, комплектация и пробег.'],['02','Симптомы','Как и когда проявляется неисправность.'],['03','Диагностика','Состав работ и запчасти определяются после проверки.']].map(([n,h,p])=><Spotlight className="estimate-card" key={n}><strong>{n}</strong><h3>{h}</h3><p>{p}</p></Spotlight>)}</div><div className="estimate-foot"><div><h3>Стоимость для вашего автомобиля</h3><p>Сформируйте запрос и обсудите ориентир цены по телефону с сервисом.</p></div><Btn onClick={()=>onAsk('Расчёт стоимости ремонта')}>Подготовить запрос <ArrowUpRight size={18}/></Btn></div></section><CTA onAsk={onAsk}/></>}
function ContactPage({onAsk}){
 const [mapOpen,setMapOpen]=useState(false);
 return <><PageHero label="04 / КОНТАКТЫ" title={<>Доктор Кар. <em>Жлобы, 24.</em></>} description="Краснодар. Перед приездом позвоните и уточните возможность выбранной услуги."/><section className="shell contacts">
 <div className="contact-details"><Eyebrow>НАШ АДРЕС</Eyebrow><h2>{COMPANY.address}</h2><div className="contact-lines"><p><Clock3 size={19}/><span>{COMPANY.hours}<small>По доступной карточке, уточняйте актуальность</small></span></p><p><Phone size={19}/><a href={'tel:'+COMPANY.tel}>{COMPANY.phone}<small>Номер из открытой карточки Яндекс Карт</small></a></p></div>
 <div className="contact-buttons"><Btn href={'tel:'+COMPANY.tel}>Позвонить <Phone size={18}/></Btn><Btn kind="glass" href={COMPANY.map} target="_blank" rel="noopener noreferrer">Маршрут <Route size={18}/></Btn></div></div>
 <div className="map-shell">{mapOpen?<iframe title="Доктор Кар, Краснодар, улица Жлобы, 24" loading="lazy" src={COMPANY.mapWidget} referrerPolicy="strict-origin-when-cross-origin"/>:<div className="map-placeholder"><MapPin size={42}/><strong>Жлобы, 24</strong><span>Краснодар · Яндекс Карты</span><button type="button" onClick={()=>setMapOpen(true)}>Показать карту <ArrowUpRight size={16}/></button></div>}<a className="map-link" href={COMPANY.map} target="_blank" rel="noopener noreferrer">Открыть маршрут отдельно <ExternalLink size={15}/></a></div></section>
 <section className="shell contact-cta"><h2>Нужна консультация до визита?</h2><p>Заполните форму для подготовки текста обращения. Она не отправляет данные на сервер.</p><Btn onClick={()=>onAsk('Консультация перед визитом')}>Подготовить обращение <ArrowUpRight size={18}/></Btn></section></>
}
function FAQSection(){return <section className="shell section faq"><SectionTitle label="ЧАСТЫЕ ВОПРОСЫ" title={<>Что важно <em>знать.</em></>}/><div>{FAQ.map((f,i)=><details key={i}><summary><span>{String(i+1).padStart(2,'0')}</span>{f.q}<ChevronDown size={18}/></summary><p>{f.a}</p></details>)}</div></section>}
function Inquiry({value,close}){
 const ref=useRef(null);
 const [form,setForm]=useState({name:'',phone:'',car:'',service:value,comment:''});
 const [state,setState]=useState('');
 const set=(key,val)=>setForm(x=>({...x,[key]:val}));
 useEffect(()=>{ref.current?.focus();const old=document.body.style.overflow;document.body.style.overflow='hidden';const escape=e=>{if(e.key==='Escape')close()};document.addEventListener('keydown',escape);return()=>{document.body.style.overflow=old;document.removeEventListener('keydown',escape)}},[close]);
 const text=()=>['Здравствуйте. Хочу проконсультироваться в «Доктор Кар», Краснодар, Жлобы, 24.','Имя: '+form.name,'Телефон: '+form.phone,'Автомобиль: '+(form.car||'Не указан'),'Услуга: '+form.service,'Комментарий: '+(form.comment||'Не указан'),'Подскажите, пожалуйста, возможность ремонта, стоимость и время записи.'].join('\n');
 const send=async(e)=>{e.preventDefault();if(!e.currentTarget.reportValidity())return;try{if(navigator.clipboard?.writeText)await navigator.clipboard.writeText(text());else{const a=document.createElement('textarea');a.value=text();a.style.position='fixed';a.style.opacity=0;document.body.appendChild(a);a.select();const ok=document.execCommand('copy');a.remove();if(!ok)throw Error('copy');}setState('Текст скопирован. Сайт не отправлял заявку. Позвоните в сервис и передайте информацию сотруднику.')}catch{setState('Копирование недоступно. Позвоните и сообщите данные специалисту.')}};
 return <div className="modal-overlay" onMouseDown={e=>{if(e.target===e.currentTarget)close()}}><div className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
 <div className="modal-titlebar"><Eyebrow>ОБРАЩЕНИЕ</Eyebrow><button ref={ref} type="button" onClick={close} aria-label="Закрыть окно"><X size={21}/></button></div><h2 id="modal-title">Расскажите о своей машине.</h2><p>Это демо-форма: она помогает составить запрос, но не отправляет его на сервер и не бронирует время.</p>
 <form onSubmit={send}><label>Имя *<input value={form.name} onChange={e=>set('name',e.target.value)} required maxLength="80" autoComplete="name" placeholder="Как к вам обращаться"/></label>
 <label>Телефон *<input type="tel" value={form.phone} onChange={e=>set('phone',e.target.value)} required minLength="7" maxLength="30" autoComplete="tel" placeholder="+7 999 000-00-00"/></label>
 <label>Автомобиль<input value={form.car} onChange={e=>set('car',e.target.value)} maxLength="130" placeholder="Марка, модель, год"/></label>
 <label>Направление<select value={form.service} onChange={e=>set('service',e.target.value)}><option>{value}</option>{SERVICES.filter(x=>x.name!==value).map(x=><option key={x.id}>{x.name}</option>)}</select></label>
 <label>Описание проблемы<textarea value={form.comment} onChange={e=>set('comment',e.target.value)} rows="3" maxLength="1000" placeholder="Опишите симптомы"/></label>
 <button className="btn btn-primary" type="submit">Скопировать текст обращения <ClipboardCopy size={18}/></button><div className="form-result" role="status" aria-live="polite">{state}</div>
 <a className="modal-phone" href={'tel:'+COMPANY.tel}><Phone size={17}/> Позвонить: {COMPANY.phone}</a></form></div></div>
}
function Footer(){return <footer className="footer"><div className="shell footer-grid"><div><Logo/><p>Неофициальный демонстрационный сайт. Не представляет компанию и не создаёт подтверждённую бронь.</p></div><div><span>НАВИГАЦИЯ</span>{PAGES.map(([path,label])=><a key={path} href={to(path)}>{label}</a>)}</div><div><span>КОНТАКТЫ</span><a href={'tel:'+COMPANY.tel}>{COMPANY.phone}</a><p>{COMPANY.address}</p><a href={COMPANY.map} target="_blank" rel="noopener noreferrer">Открыть Яндекс Карты <ExternalLink size={13}/></a></div></div><div className="shell footer-copy">© 2026 · Доктор Кар / дизайн-концепт · Dark / Light</div></footer>}
createRoot(document.getElementById('root')).render(<App/>);
