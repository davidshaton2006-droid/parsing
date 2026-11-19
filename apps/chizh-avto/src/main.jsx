import React, {useState,useEffect,useMemo,useRef} from 'react';
import {createRoot} from 'react-dom/client';
import {motion,AnimatePresence,useReducedMotion} from 'motion/react';
import useEmblaCarousel from 'embla-carousel-react';
import {
  ArrowUpRight, ArrowRight, ArrowLeft, ChevronDown, ChevronRight, Menu, X,
  Phone, MapPin, Clock3, Play, Search, Plus, Minus, Check, ExternalLink,
  Copy, SlidersHorizontal, ArrowDown, Instagram, Mail, MoveUpRight
} from 'lucide-react';
import {PHOTO,groups,projects,prices,reviews,facts,ORIGIN} from './data/catalog';
import optimizedImages from './data/optimized-images.json';
import './studio.css';
import {ShowroomHome,ShowroomHeader,ShowroomFooter,ShowroomMobileNav} from './showroom.jsx';
import './showroom.css';

const navigation = [
  {to:'/services', label:'Услуги'}, {to:'/projects',label:'Работы'},
  {to:'/prices',label:'Цены'}, {to:'/about',label:'О нас'},
  {to:'/offers',label:'Акции'}, {to:'/contacts',label:'Контакты'}
];
const emptySnapshot={syncedAt:null, servicePages:[], projectRows:[], priceRows:[]};
const goodSrc=url=>typeof url==='string' && /^https:\/\/chizhavto\.ru\//.test(url);
const pad=n=>String(n).padStart(2,'0');
const href=to=>'#'+to;

function useLocation(){
 const get=()=>{const frag=window.location.hash.slice(1)||'/';const path=frag.split('?')[0]||'/';return navigation.some(item=>item.to===path)||path==='/'?path:'/'};
 const [pathname,setPathname]=useState(get);
 useEffect(()=>{const onChange=()=>{setPathname(get());window.scrollTo({top:0,behavior:'instant'});};addEventListener('hashchange',onChange);return()=>removeEventListener('hashchange',onChange)},[]);
 useEffect(()=>{const page=navigation.find(x=>x.to===pathname)?.label||'Главная';document.title=`${page} · Чиж-Авто — тюнинг и дооснащение, Краснодар (концепт)`},[pathname]);
 return pathname;
}
function useSnapshot(enabled){
 const [value,setValue]=useState(emptySnapshot);
 useEffect(()=>{if(!enabled)return;let active=true;import('./data/snapshot.json').then(m=>{if(active&&m.default)setValue(m.default)}).catch(()=>{});return()=>{active=false}},[enabled]);
 return value;
}
function SiteLink({to,children,className='',onClick,...props}){return <a href={href(to)} className={className} onClick={onClick} {...props}>{children}</a>}
function Out({to,children,className='',...props}){return <a href={to} target="_blank" rel="noopener noreferrer" className={className} {...props}>{children}</a>}
function Photo({src,alt='',className='',hero=false,...props}){
 const [original,setOriginal]=useState(false),[broken,setBroken]=useState(false);
 useEffect(()=>{setOriginal(false);setBroken(false)},[src]);
 const entry=optimizedImages[src];const useLocal=entry&&!original;const base=import.meta.env.BASE_URL;
 const imgSrc=useLocal?base+entry.large:src;
 const imgSet=useLocal?(entry.largeWidth===entry.smallWidth?`${base}${entry.large} ${entry.largeWidth}w`:`${base}${entry.small} ${entry.smallWidth}w, ${base}${entry.large} ${entry.largeWidth}w`):undefined;
 if(broken)return <div className={'sc-photo-fallback '+className} role="img" aria-label={alt}>Изображение временно недоступно</div>;
 return <img src={imgSrc} srcSet={imgSet} sizes={hero?'(max-width: 880px) 100vw, 60vw':'(max-width: 720px) 100vw, (max-width: 1100px) 55vw, 33vw'} alt={alt} className={className} loading={hero?'eager':'lazy'} fetchPriority={hero?'high':'low'} decoding="async" width={entry?.largeWidth} height={entry?.largeHeight} onError={()=>{if(useLocal)setOriginal(true);else setBroken(true)}} {...props}/>;
}
function Eyebrow({n,children,muted=false}){return <span className={'sc-eyebrow'+(muted?' muted':'')}>{n&&<b>{n}</b>}{children}</span>}
function Rise({children,className=''}){const reduce=useReducedMotion();return <motion.div className={className} initial={false} whileInView={reduce?{}:{y:[12,0],opacity:[.75,1]}} viewport={{once:true,margin:'0px 0px -10% 0px'}} transition={{duration:.65,ease:[.22,1,.36,1]}}>{children}</motion.div>}
function Button({children,to='/contacts',light=false,outline=false,className=''}){return <SiteLink to={to} className={'sc-button'+(light?' light':'')+(outline?' outline':'')+' '+className}>{children}<ArrowUpRight size={19} strokeWidth={1.8}/></SiteLink>}
function Mark({reverse=false}){return <SiteLink to="/" className={'sc-mark'+(reverse?' reverse':'')} aria-label="Чиж-Авто, главная"><span className="sc-mark-name">ЧИЖ<span>АВТО</span></span><span className="sc-mark-dot" aria-hidden="true"/></SiteLink>}

function Header({path}){
 const [open,setOpen]=useState(false);
 useEffect(()=>{setOpen(false)},[path]);
 useEffect(()=>{const f=e=>{if(e.key==='Escape')setOpen(false)};window.addEventListener('keydown',f);return()=>removeEventListener('keydown',f)},[]);
 return <header className="sc-header"><div className="sc-header-inner">
  <div className="sc-brand-wrap"><Mark/><span className="sc-brand-meta">Центр тюнинга и дооснащения<br/>Краснодар</span></div>
  <nav className={'sc-nav'+(open?' open':'')} id="sc-nav" aria-label="Основная навигация">
    {navigation.map(n=><SiteLink key={n.to} to={n.to} aria-current={path===n.to?'page':undefined} onClick={()=>setOpen(false)}>{n.label}</SiteLink>)}
  </nav>
  <div className="sc-nav-end"><a href={'tel:'+facts.tel} className="sc-phone" aria-label={'Позвонить '+facts.phone}>{facts.phone}</a><SiteLink to="/contacts" className="sc-header-cta">Связаться <ArrowUpRight size={17}/></SiteLink></div>
  <button type="button" className="sc-menu" onClick={()=>setOpen(v=>!v)} aria-label={open?'Закрыть меню':'Открыть меню'} aria-controls="sc-nav" aria-expanded={open}>{open?<X/>:<Menu/>}</button>
 </div></header>
}
function Footer(){return <footer className="sc-footer"><div className="sc-wrap">
 <div className="sc-footer-top"><div><Mark reverse/><p>Автосигнализации, свет, звук, мультимедиа, детейлинг и другое дооснащение. Две точки в Краснодаре.</p></div><div className="sc-footer-menu"><div><b>Изучить</b><SiteLink to="/services">Услуги</SiteLink><SiteLink to="/projects">Работы</SiteLink><SiteLink to="/prices">Стоимость</SiteLink><SiteLink to="/about">О компании</SiteLink></div><div><b>Контакты</b><a href={'tel:'+facts.tel}>{facts.phone}</a><a href={'mailto:'+facts.email}>{facts.email}</a><SiteLink to="/contacts">Адреса и маршрут</SiteLink></div></div></div>
 <div className="sc-footer-bottom"><span>Чиж-Авто / Неофициальный дизайн-концепт</span><span>Фото и информация — из открытых материалов Чиж-Авто. Перед использованием необходимо согласование владельцев.</span><Out to={ORIGIN}>Оригинальный сайт <ArrowUpRight size={14}/></Out></div>
 </div></footer>}
function Booking({compact=false}){return <div className={'sc-booking'+(compact?' compact':'')}><div><span className="sc-booking-kicker">Начнём с вашего автомобиля</span><h2>Какую задачу решаем?</h2><p>Подберём оборудование и уточним стоимость под модель автомобиля. Запись подтверждает только сотрудник центра.</p></div><div className="sc-booking-actions"><Button to="/contacts" light>Обсудить задачу</Button><a href={'tel:'+facts.tel} className="sc-booking-call"><Phone size={18}/>{facts.phone}</a></div></div>}

function Hero(){return <section className="sc-hero" aria-label="Возможности Чиж-Авто"><div className="sc-hero-copy">
 <div className="sc-hero-upper"><Eyebrow>Сертифицированный тюнинг-центр</Eyebrow><span>Краснодар / Жлобы, 115</span></div>
 <h1>Больше, чем<br/><em>заводская</em><br/>комплектация.</h1>
 <p>Охрана и автозапуск, современная мультимедиа, качественный свет, звук и защита кузова. Дооснащение вашего автомобиля в Чиж-Авто.</p>
 <div className="sc-hero-buttons"><Button to="/services">Выбрать услугу</Button><SiteLink to="/projects" className="sc-text-link">Смотреть работы <ArrowUpRight size={18}/></SiteLink></div>
 <div className="sc-hero-foot"><span><b>20+ лет</b><small>по информации компании</small></span><span><b>12</b><small>направлений услуг</small></span><SiteLink to="/about" className="sc-arrow-alone" aria-label="Подробнее о Чиж-Авто"><ArrowUpRight size={24}/></SiteLink></div>
 </div><div className="sc-hero-visual"><Photo hero className="sc-hero-photo" src={PHOTO.hero} alt="Реальный автомобиль в установочном центре Чиж-Авто"/><div className="sc-hero-visual-caption"><span>Чиж-Авто / реальный проект</span><span>01 / 04</span></div></div></section>}

function ServiceIndex({full=false}){
 const [active,setActive]=useState(()=>new URLSearchParams(window.location.hash.split('?')[1]||'').get('focus')||'detail');
 const [search,setSearch]=useState('');
 const list=full?groups:groups.slice(0,7);const visible=list.filter(g=>(g.name+' '+g.small+' '+g.items.map(x=>x[0]).join(' ')).toLowerCase().includes(search.trim().toLowerCase()));
 const chosen=groups.find(x=>x.id===active)||visible[0]||groups[0];
 useEffect(()=>{if(!visible.find(x=>x.id===active)&&visible[0])setActive(visible[0].id)},[search]);
 return <section className={'sc-service-section'+(full?' full':'')} id="services"><div className="sc-wrap"><div className="sc-intro-row"><Rise><Eyebrow n="01">Направления</Eyebrow><h2 className="sc-h2">Найдётся решение<br/>для вашей задачи.</h2></Rise><p>От полезных опций до индивидуального дооснащения. Выберите направление, чтобы посмотреть доступные работы.</p></div>
 {full&&<div className="sc-search"><Search size={18}/><input type="search" value={search} onChange={e=>setSearch(e.target.value)} aria-label="Поиск по услугам" placeholder="Название услуги или оборудование"/><span>{visible.length} из {groups.length}</span></div>}
 <div className="sc-service-shell"><div className="sc-service-list">
 {visible.map((g,i)=><button key={g.id} type="button" className={'sc-service-row'+(g.id===active?' active':'')} aria-expanded={g.id===active} onClick={()=>setActive(g.id)} onMouseEnter={()=>{if(window.matchMedia('(hover:hover)').matches)setActive(g.id)}}>
 <span className="sc-service-number">{pad(groups.indexOf(g)+1)}</span><span className="sc-service-name">{g.name}<small>{g.small}</small></span><ArrowUpRight className="sc-service-arrow" size={23} strokeWidth={1.5}/></button>)}
 {visible.length===0&&<p role="status" className="sc-empty">Ничего не найдено. <button onClick={()=>setSearch('')}>Сбросить поиск</button></p>}
 </div><div className="sc-service-detail"><div className="sc-service-photo"><AnimatePresence mode="wait"><motion.div key={chosen.id} initial={{opacity:.5}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:.3}}><Photo src={chosen.photo} alt={'Реальное фото Чиж-Авто для направления «'+chosen.name+'»'}/></motion.div></AnimatePresence><span className="sc-photo-credit">Фотография из материалов Чиж-Авто</span></div><div className="sc-service-detail-bottom"><span><small>Выбрано</small><strong>{chosen.name}</strong></span><SiteLink to={'/contacts?service='+encodeURIComponent(chosen.name)} className="sc-detail-action">Обсудить услугу <ArrowUpRight size={19}/></SiteLink></div>{full&&<div className="sc-subservices">{chosen.items.length?chosen.items.map(([name,slug])=><Out key={slug} to={ORIGIN+'/services/'+slug+'/'}>{name}<ArrowUpRight size={15}/></Out>):<Out to={ORIGIN+'/services/'+chosen.slug+'/'}>Подробнее об услуге на официальном сайте<ArrowUpRight size={15}/></Out>}</div>}</div></div>
 {!full&&<div className="sc-section-end"><span>Все 12 направлений и дополнительные услуги</span><SiteLink to="/services" className="sc-inline-cta">Открыть весь каталог <ArrowUpRight size={18}/></SiteLink></div>}
 </div></section>
}

function WorkTile({p,index,onOpen,large=false}){return <button type="button" onClick={()=>onOpen(p)} className={'sc-work-tile'+(large?' large':'')}><div className="sc-work-photo"><Photo src={p.image} alt={p.title+' / '+p.car+', материал Чиж-Авто'}/><span className="sc-work-plus"><ArrowUpRight size={19}/></span></div><div className="sc-work-desc"><div><span>{p.car||'Чиж-Авто'} {p.time&&' / '+p.time}</span><h3>{p.title}</h3></div><span>{pad(index+1)}</span></div></button>}
function Modal({p,onClose}){
 useEffect(()=>{const key=e=>{if(e.key==='Escape')onClose()};document.addEventListener('keydown',key);const old=document.body.style.overflow;document.body.style.overflow='hidden';return()=>{document.removeEventListener('keydown',key);document.body.style.overflow=old}},[onClose]);
 return <div className="sc-modal-cover" role="presentation" onMouseDown={e=>{if(e.target===e.currentTarget)onClose()}}><section className="sc-modal" role="dialog" aria-modal="true" aria-label={p.title}><button className="sc-close" onClick={onClose} aria-label="Закрыть окно"><X/></button><div className="sc-modal-photo"><Photo src={p.image} alt={p.title+' '+p.car}/></div><div className="sc-modal-info"><Eyebrow>Реальная работа / Чиж-Авто</Eyebrow><h2>{p.title}</h2><p className="sc-modal-car">{p.car} {p.time&&' · '+p.time}</p><p>{p.desc||'Информация о работе из официального портфолио.'}</p>{p.price&&<strong>{p.price}</strong>}<Out to={p.link||ORIGIN+'/projects/'} className="sc-button">Открыть оригинальный проект <ArrowUpRight size={18}/></Out></div></section></div>
}
function Portfolio({full=false,snapshot=emptySnapshot}){
 const [selected,setSelected]=useState(null),[filter,setFilter]=useState(''),[max,setMax]=useState(12);
 const synced=full?snapshot.projectRows.filter(p=>goodSrc(p.photo)&&p.title&&!projects.some(y=>y.title===p.title)).map(p=>({title:p.title,car:'Проект Чиж-Авто',image:p.photo,time:'',price:'',desc:'Проект из официального портфолио компании.',link:p.url})):[];
 const all=[...projects,...synced];const shown=all.filter(x=>(x.title+' '+x.car).toLowerCase().includes(filter.toLowerCase()));
 const cards=full?shown.slice(0,max):projects.slice(0,4);
 return <section className={'sc-portfolio'+(full?' full':'')}><div className="sc-wrap"><div className="sc-intro-row sc-portfolio-heading"><Rise><Eyebrow n={full?'':'02'}>Портфолио</Eyebrow><h2 className="sc-h2">Работа говорит<br/>лучше обещаний.</h2></Rise><div><p>Здесь настоящие фотографии и проекты центра. Каждую работу можно открыть и сверить с публикацией Чиж-Авто.</p>{!full&&<SiteLink className="sc-inline-cta" to="/projects">Все проекты <ArrowUpRight size={17}/></SiteLink>}</div></div>
 {full&&<div className="sc-search on-dark"><Search size={18}/><input value={filter} onChange={e=>{setFilter(e.target.value);setMax(12)}} aria-label="Поиск по проектам" placeholder="Найти автомобиль или услугу" type="search"/><span>{shown.length} проектов</span></div>}
 <div className={'sc-work-grid'+(full?' catalog':'')}>{cards.map((p,i)=><WorkTile key={(p.link||p.title)+i} p={p} index={i} large={!full&&i===0} onOpen={setSelected}/>)}</div>
 {full&&cards.length<shown.length&&<button className="sc-more" onClick={()=>setMax(v=>v+12)}>Показать ещё работы <Plus size={19}/></button>}
 {full&&shown.length===0&&<p className="sc-empty">Ничего не найдено. <button onClick={()=>setFilter('')}>Показать все проекты</button></p>}
 {!full&&<div className="sc-section-end on-dark"><span>Открытые публикации Чиж-Авто</span><SiteLink to="/projects" className="sc-inline-cta">Смотреть портфолио <ArrowUpRight size={18}/></SiteLink></div>}
 </div>{selected&&<Modal p={selected} onClose={()=>setSelected(null)}/>}</section>
}

function Reel(){const [open,setOpen]=useState(false);useEffect(()=>{if(!open)return;const fn=e=>{if(e.key==='Escape')setOpen(false)};addEventListener('keydown',fn);return()=>removeEventListener('keydown',fn)},[open]);return <section className="sc-reel" aria-label="Видео Чиж-Авто"><div className="sc-reel-image"><Photo src={PHOTO.gw} alt="Реальный автомобиль во время работ в Чиж-Авто"/></div><div className="sc-reel-copy"><Eyebrow>Видео из мастерской</Eyebrow><h2>Посмотрите,<br/>как это делается.</h2><p>Работы, оборудование и процесс установки. Ролик опубликован компанией Чиж-Авто.</p><button className="sc-reel-play" onClick={()=>setOpen(true)}><span><Play size={23} fill="currentColor"/></span> Смотреть видео</button></div>{open&&<div className="sc-video-cover" onMouseDown={e=>{if(e.target===e.currentTarget)setOpen(false)}} role="presentation"><div className="sc-video-dialog" role="dialog" aria-modal="true" aria-label="Видео Чиж-Авто"><button onClick={()=>setOpen(false)} className="sc-close" aria-label="Закрыть видео"><X/></button><iframe src={facts.video+(facts.video.includes('?')?'&':'?')+'autoplay=1'} title="Видео из официального канала Чиж-Авто" allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen/><Out to={facts.youtube}>Открыть официальный канал <ArrowUpRight size={16}/></Out></div></div>}</section>}
function StudioInfo(){return <section className="sc-studio-info"><div className="sc-studio-image"><Photo src={PHOTO.headlight} alt="Автомобильная оптика, работа из портфолио Чиж-Авто"/></div><div className="sc-studio-text"><Eyebrow n="03">Чиж-Авто</Eyebrow><h2>Дело<br/>в деталях.</h2><p>Компания более 20 лет занимается установкой дополнительного оборудования и тюнингом автомобилей. Охранные системы, мультимедиа, свет, акустика, защитные покрытия и другие работы.</p><p>Две площадки в Краснодаре: Жлобы, 115 и Каляева, 89.</p><Button to="/about" outline>О центре</Button></div></section>}
function Steps(){return <section className="sc-steps"><div className="sc-wrap"><div className="sc-intro-row"><div><Eyebrow n="04">Как начать</Eyebrow><h2 className="sc-h2">Всё начинается<br/>с вашего автомобиля.</h2></div><p>Необязательно знать точную модель оборудования. Сначала обсудим задачу и возможности установки.</p></div><div className="sc-step-grid">{[['01','Выберите направление','Определитесь, что хотите добавить или изменить.'],['02','Уточните совместимость','Назовите марку, модель, год и комплектацию.'],['03','Согласуйте работы','Стоимость и срок уточняются у сотрудников центра.']].map(v=><div key={v[0]}><span>{v[0]}</span><h3>{v[1]}</h3><p>{v[2]}</p></div>)}</div></div></section>}
function Home(){return <><Hero/><ServiceIndex/><Portfolio/><StudioInfo/><Reel/><Steps/><div className="sc-wrap sc-bottom-booking"><Booking/></div></>}
function PageIntro({kicker,title,desc,count}){return <section className="sc-page-intro"><div className="sc-wrap"><div className="sc-page-topline"><SiteLink to="/">Главная</SiteLink><ChevronRight size={13}/><span>{kicker}</span></div><div className="sc-page-heading"><div><Eyebrow>{kicker}</Eyebrow><h1>{title}</h1></div><div>{desc&&<p>{desc}</p>}{count&&<span className="sc-page-count">{count}</span>}</div></div></div></section>}
function ServicesPage(){return <><PageIntro kicker="Услуги" title="Что можно улучшить." desc="Двенадцать направлений дооснащения и подробные услуги из каталога компании." count="12 / НАПРАВЛЕНИЙ"/><ServiceIndex full/><div className="sc-wrap sc-bottom-booking"><Booking/></div></>}
function ProjectsPage(){const snap=useSnapshot(true);return <><PageIntro kicker="Портфолио" title="Сделано в Чиж-Авто." desc="Проекты и фотографии из открытых материалов компании. Откройте любую работу и перейдите к первоисточнику."/><Portfolio full snapshot={snap}/><div className="sc-wrap sc-bottom-booking"><Booking/></div></>}
// Prices from the official price list: multiple columns are not equivalent.
// Keep their actual headings instead of showing unlabeled, misleading amounts.
const priceMoney=value=>/₽|руб\.?|по запросу|договорн|уточняйте|бесплатно/i.test(String(value||''));
const vehicleClasses=['Седаны малого и среднего класса','Седаны бизнес-класса и кроссоверы','Седаны премиум-класса и внедорожники','Минивэны и микроавтобусы'];
function normalizePriceRows(snapshot){
 const src=snapshot?.priceRows?.length?snapshot.priceRows:prices.map(([name,value])=>[name,value]);
 let headers=[], section='Услуги';
 const results=[];
 for(const [index,item] of src.entries()){
  if(!Array.isArray(item))continue;
  const cells=item.map(x=>String(x??'').trim()).filter(Boolean);
  if(!cells.length)continue;
  const [name,...values]=cells;
  if(!values.length){section=name;continue}
  const isHeading=values.every(v=>!priceMoney(v)) &&
   (values.some(v=>/седаны|кроссовер|внедорож|минивэн|цена|стоимость|работы|установкой/i.test(v))||!priceMoney(name));
  if(isHeading){
   if(/^(услуга|наименование)$/i.test(name))continue;
   section=name;
   headers=values;
   continue;
  }
  if(/^(услуга|наименование|стоимость)$/i.test(name))continue;
  const clean=values.filter(v=>priceMoney(v));
  if(!clean.length)continue;
  const isVehicle=clean.length===4 && headers.length===4 &&
   headers.some(h=>/седаны|кроссовер|внедорож|минивэн/i.test(h));
  const pricesList=clean.map((value,i)=>({value,label:isVehicle?headers[i]:(headers.length===clean.length?headers[i]:clean.length===1?'Стоимость':('Вариант '+(i+1)))}));
  results.push({id:index,name,section,values:pricesList,isVehicle});
 }
 return results;
}
function PricesPage(){
 const snap=useSnapshot(true);
 const [q,setQ]=useState('');
 const [showAll,setShowAll]=useState(false);
 const [car,setCar]=useState('all');
 const all=useMemo(()=>normalizePriceRows(snap),[snap]);
 const term=q.trim().toLocaleLowerCase('ru');
 const filtered=all.filter(x=>(x.name+' '+x.section).toLocaleLowerCase('ru').includes(term));
 const shown=showAll?filtered:filtered.slice(0,32);
 return <>
  <PageIntro kicker="Прайс-лист Чиж-Авто" title="Цены на услуги." desc="Без смешения классов автомобилей: каждый вариант стоимости подписан. Окончательная цена зависит от модели, комплектации и состава работ."/>
  <section className="sc-price-section sv5-price-page"><div className="sc-wrap">
   <div className="sv5-price-tools">
    <label className="sc-search sv5-price-search"><Search size={19}/><input value={q} onChange={e=>{setQ(e.target.value);setShowAll(false)}} type="search" aria-label="Поиск по прайс-листу" placeholder="Найти услугу или направление"/><span aria-live="polite">{filtered.length} позиций</span></label>
    <label className="sv5-price-choice">Класс автомобиля
     <select aria-label="Класс автомобиля для отображения стоимости" value={car} onChange={e=>setCar(e.target.value)}>
      <option value="all">Все классы</option>
      {vehicleClasses.map((n,i)=><option key={i} value={String(i)}>{n}</option>)}
     </select>
    </label>
   </div>
   <p className="sv5-price-explainer">Для услуг с разной ценой по классу автомобиля выберите свой класс. Остальные позиции показываются по исходному прайсу с расшифровкой вариантов.</p>
   <div className="sv5-price-results">
    {shown.map(row=>{
     const selected=row.isVehicle&&car!=='all'?[row.values[Number(car)]].filter(Boolean):row.values;
     return <article className="sc-price-row sv5-price-entry" key={row.id}>
      <div className="sv5-price-description"><span className="sv5-price-category">{row.section}</span><h2>{row.name}</h2></div>
      <div className={'sv5-price-values'+(row.isVehicle?' sv5-price-values-tiered':'')}>
       {selected.map((v,i)=><div className="sv5-price-value" key={i}><span>{v.label}</span><strong>{v.value}</strong></div>)}
      </div>
     </article>;
    })}
   </div>
   {filtered.length>shown.length&&<button className="sc-more dark sv5-price-more" onClick={()=>setShowAll(true)} type="button">Показать ещё {filtered.length-shown.length} позиций <Plus size={19}/></button>}
   {filtered.length===0&&<div className="sc-empty sv5-empty-price">По такому запросу услуг не найдено. <button type="button" onClick={()=>setQ('')}>Очистить поиск</button></div>}
   <div className="sc-price-footer sv5-price-footer"><p>Стоимость указана по открытому прайсу компании. Цены могут изменяться, особенно при подборе оборудования под конкретный автомобиль. Не является окончательной сметой.</p><Out to={ORIGIN+'/prices/'} className="sc-inline-cta">Сверить с оригинальным прайсом <ArrowUpRight size={17}/></Out></div>
  </div></section>
  <div className="sc-wrap sc-bottom-booking"><Booking/></div>
 </>;
}

function AboutPage(){return <><PageIntro kicker="О компании" title="Мастерская возможностей." desc="Чиж-Авто — сертифицированный центр автомобильного тюнинга и установки дополнительного оборудования в Краснодаре."/><section className="sc-about-page sc-wrap"><div className="sc-about-hero-photo"><Photo src={PHOTO.gw} alt="Автомобиль в мастерской Чиж-Авто"/></div><div className="sc-about-columns"><div><Eyebrow>Более 20 лет опыта</Eyebrow><h2>Опыт — в каждой установке.</h2></div><div><p>Компания занимается установкой охранных систем, мультимедиа, автозвука, систем обзора и парковки, доработкой света, шумоизоляцией и защитой кузова.</p><p>В опубликованном портфолио представлены работы с автомобилями разных марок. Конкретную совместимость оборудования и условия установки уточняют сотрудники центра.</p><Out to={ORIGIN+'/company/'} className="sc-inline-cta">Подробнее на официальном сайте <ArrowUpRight size={18}/></Out></div></div></section><Reel/><Steps/><div className="sc-wrap sc-bottom-booking"><Booking/></div></>}
function OffersPage(){const deals=[['Оклейка зон риска','Полировка и керамическое покрытие в подарок при заказе оклейки зон риска.'],['Шумоизоляция','Обработка арок в подарок при заказе шумоизоляции салона.'],['Гибридная антигравийная плёнка','Предложение об оклейке защитной плёнкой по специальной цене.']];return <><PageIntro kicker="Акции" title="Предложения центра." desc="Условия и сроки могут измениться. Перед оформлением заказа уточните актуальность акции в Чиж-Авто."/><section className="sc-offers sc-wrap"><div className="sc-offer-grid">{deals.map((d,i)=><div className="sc-offer" key={d[0]}><span>{pad(i+1)} / ИЗ АРХИВА ПРЕДЛОЖЕНИЙ</span><h2>{d[0]}</h2><p>{d[1]}</p><Out to={ORIGIN+'/shares/'} className="sc-inline-cta">Проверить условия <ArrowUpRight size={18}/></Out></div>)}</div><p className="sc-offers-note">Эти предложения упоминались на официальном сайте. Активность, даты и условия необходимо подтвердить у компании.</p></section><div className="sc-wrap sc-bottom-booking"><Booking/></div></>}
const chizhOffices=[
 {id:'zhloby',label:'Жлобы, 115',address:'Краснодар, ул. имени Жлобы, 115',map:'https://yandex.ru/maps/org/chizh_avto/1266081535/',embed:'https://yandex.ru/map-widget/v1/?oid=1266081535&z=16'},
 {id:'kalyaeva',label:'Каляева, 89',address:'Краснодар, ул. Каляева, 89',map:'https://yandex.ru/maps/?text='+encodeURIComponent('Краснодар, улица Каляева, 89'),embed:'https://yandex.ru/map-widget/v1/?text='+encodeURIComponent('Краснодар, улица Каляева, 89')+'&z=16'}
];
function ContactsPage(){
 const params=new URLSearchParams(location.hash.split('?')[1]||'');
 const [officeIndex,setOfficeIndex]=useState(0);
 const [form,setForm]=useState(()=>({name:'',phone:'',service:params.get('service')||'',car:'',note:'',requestedDate:params.get('date')||'',requestedTime:params.get('time')||''}));
 const [message,setMessage]=useState('');
 const office=chizhOffices[officeIndex];
 const update=(k,v)=>setForm(x=>({...x,[k]:v}));
 const body=()=>['Здравствуйте! Хочу уточнить услугу в Чиж-Авто.','Предпочтительный филиал: '+office.address,'Имя: '+form.name,'Телефон: '+form.phone,'Услуга: '+(form.service||'Нужна консультация'),'Автомобиль: '+(form.car||'Не указан'),'Желаемая дата: '+(form.requestedDate||'Не указана'),'Желаемое время: '+(form.requestedTime||'Не указано'),'Комментарий: '+(form.note||'Нет'),'Указанные дата и время — пожелание, запись требует подтверждения.'].join('\n');
 const mail=e=>{e.preventDefault();if(!e.currentTarget.reportValidity())return;setMessage('Откроется почтовое приложение с подготовленным письмом. Нажмите «Отправить» в почте: сама страница заявку не отправляет.');window.location.href='mailto:'+facts.email+'?subject='+encodeURIComponent('Запрос Чиж-Авто: '+office.label)+'&body='+encodeURIComponent(body())};
 const copy=async()=>{try{if(!navigator.clipboard?.writeText)throw Error('clipboard unavailable');await navigator.clipboard.writeText(body());setMessage('Текст обращения скопирован. Отправьте его на '+facts.email+' или сообщите по телефону.')}catch{setMessage('Скопировать не удалось. Позвоните или откройте письмо в почтовом приложении.')}};
 return <>
  <PageIntro kicker="Контакты" title="Приезжайте в Чиж-Авто." desc="Две точки в Краснодаре. Выберите нужный филиал, откройте маршрут или отправьте запрос на консультацию."/>
  <section className="sc-contacts sc-wrap sv5-contacts-page">
   <div className="sc-contact-side">
    <div className="sv5-office-heading"><span>НАШИ АДРЕСА</span><h2>Выберите филиал</h2><p>Телефон, email и режим работы взяты с официального сайта компании.</p></div>
    <div className="sv5-office-list" role="group" aria-label="Выбор филиала Чиж-Авто">
     {chizhOffices.map((item,i)=><button key={item.id} type="button" className={'sc-contact-address sv5-office'+(officeIndex===i?' is-active':'')} onClick={()=>setOfficeIndex(i)} aria-pressed={officeIndex===i}>
      <span>{String(i+1).padStart(2,'0')} / КРАСНОДАР</span><h3>{item.label}</h3><p>{facts.hours}</p><span className="sv5-office-select">{officeIndex===i?'Выбранный филиал':'Выбрать филиал'} <ArrowUpRight size={17}/></span>
     </button>)}
    </div>
    <div className="sv5-office-details">
     <div className="sv5-office-address-line"><MapPin size={21}/><div><span>АДРЕС</span><strong>{office.address}</strong></div></div>
     <div className="sv5-office-links"><a href={'tel:'+facts.tel}><Phone size={18}/>{facts.phone}</a><a href={'mailto:'+facts.email}><Mail size={18}/>{facts.email}</a></div>
     <a className="sv5-route-button" href={office.map} target="_blank" rel="noopener noreferrer">Построить маршрут в Яндекс Картах <ArrowUpRight size={19}/></a>
    </div>
    <div className="sc-map sv5-office-map"><iframe key={office.id} title={'Расположение Чиж-Авто: '+office.label} loading="lazy" src={office.embed} referrerPolicy="strict-origin-when-cross-origin"/><a href={office.map} target="_blank" rel="noopener noreferrer" className="sv5-map-link">Открыть карту <ArrowUpRight size={15}/></a></div>
   </div>
   <div className="sc-contact-form sv5-contact-panel">
    <Eyebrow>Консультация</Eyebrow><h2>Обсудим ваш автомобиль.</h2>
    <p>Подготовим письмо с вашими пожеланиями и данными автомобиля. Отправка происходит в почтовой программе; автоматической записи здесь нет.</p>
    <form onSubmit={mail}>
     <label>Филиал<select aria-label="Предпочтительный филиал" value={office.id} onChange={e=>setOfficeIndex(Math.max(0,chizhOffices.findIndex(x=>x.id===e.target.value)))}>{chizhOffices.map(x=><option key={x.id} value={x.id}>{x.address}</option>)}</select></label>
     <label>Имя *<input required maxLength="80" autoComplete="name" value={form.name} onChange={e=>update('name',e.target.value)} placeholder="Ваше имя"/></label>
     <label>Телефон *<input required minLength="7" maxLength="30" inputMode="tel" type="tel" autoComplete="tel" value={form.phone} onChange={e=>update('phone',e.target.value)} placeholder="+7 (999) 000-00-00"/></label>
     <label>Что хотите сделать?<select value={form.service} onChange={e=>update('service',e.target.value)}><option value="">Нужна консультация</option>{groups.map(x=><option key={x.id} value={x.name}>{x.name}</option>)}</select></label>
     <label>Марка и модель<input value={form.car} maxLength="150" onChange={e=>update('car',e.target.value)} placeholder="Например, Toyota Camry 2022"/></label>
     <div className="sv5-form-requested"><label>Желаемая дата<input type="date" value={form.requestedDate} onChange={e=>update('requestedDate',e.target.value)}/></label><label>Желаемое время<select value={form.requestedTime} onChange={e=>update('requestedTime',e.target.value)}><option value="">Любое время</option>{['09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00'].map(t=><option key={t} value={t}>{t}</option>)}</select></label></div>
     <label>Комментарий<textarea rows="3" maxLength="1500" value={form.note} onChange={e=>update('note',e.target.value)} placeholder="Опишите задачу"/></label>
     <div className="sc-form-buttons"><button type="submit" className="sc-button">Открыть письмо <ArrowUpRight size={17}/></button><button type="button" className="sc-button outline" onClick={copy}>Скопировать текст <Copy size={17}/></button></div>
     <div className="sc-form-status" role="status" aria-live="polite">{message}</div>
    </form>
    <p className="sc-form-note">Запрос не отправляется с этой страницы автоматически. Дату и время сотрудник должен подтвердить отдельно. Для прямой связи: <a href={'tel:'+facts.tel}>{facts.phone}</a>.</p>
   </div>
  </section>
 </>;
}

function App(){const path=useLocation();return <><a className="sc-skip" href="#sc-main">Перейти к содержимому</a><ShowroomHeader path={path}/><main id="sc-main" tabIndex="-1">{path==='/'?<ShowroomHome/>:path==='/services'?<ServicesPage/>:path==='/projects'?<ProjectsPage/>:path==='/prices'?<PricesPage/>:path==='/about'?<AboutPage/>:path==='/offers'?<OffersPage/>:<ContactsPage/>}</main><ShowroomFooter/><ShowroomMobileNav path={path}/></>}
createRoot(document.getElementById('root')).render(<App/>);
