import React, { useLayoutEffect } from 'react'
import { createRoot } from 'react-dom/client'
import Provably from './ui/provably'
import type { ProvablyCredential } from './ui/provably'

type PageInfo = {
  lines: [string,string]; lastWord:string; value:number; suffix:string; word:string;
  note:string; cards:[string,string,string[]][]
}
const pages:Record<string,PageInfo> = {
  home:{lines:["Где ваш бизнес","теряет клиентов,"],lastWord:"время и деньги?",value:3,suffix:'',word:'Направления',note:'Разработка, ИИ, автоматизация',cards:[
    ['Заказное ПО','Индивидуальная разработка',['Веб-приложения','Личные кабинеты','API']],
    ['Искусственный интеллект','Интеллектуальные решения',['ИИ-агенты','RAG','Ассистенты']],
    ['Автоматизация','Связанные процессы',['CRM','Интеграции','Продажи']]]},
  catalog:{lines:["Разработка под задачи","вашего бизнеса,"],lastWord:"а не ограничения готовых решений.",value:8,suffix:'',word:'Направления',note:'Восемь основных направлений каталога',cards:[
    ['Веб-разработка','Сайты и приложения',['Сайты','Интернет-магазины','SaaS']],
    ['Интеграции','Цифровая инфраструктура',['CRM','ERP','API']],
    ['Telegram и ИИ','Интерактивные сервисы',['Боты','Mini Apps','ИИ-агенты']]]},
  solutions:{lines:["Что можно создать","для бизнеса"],lastWord:"в вашей отрасли?",value:16,suffix:'',word:'Сценарии',note:'Отраслевые концепции, не коробочные продукты',cards:[
    ['Заказ и оплата','Сценарий самообслуживания',['Выбор','Корзина','Подтверждение']],
    ['Онлайн-запись','Клиентский сервис',['Расписание','Запись','Уведомления']],
    ['Отдел продаж','Работа с заявками',['Квалификация','CRM','Интеграция']]]},
  pricing:{lines:["Понимайте, за что","платите, ещё до"],lastWord:"начала разработки.",value:10000,suffix:' ₽',word:'От',note:'Индивидуальная оценка согласованного объёма',cards:[
    ['Небольшие работы','От 10 000 ₽',['Отдельная функция','Интеграция']],
    ['Основной диапазон','10–300 тыс. ₽',['Разработка','Согласование']],
    ['Комплексный проект','До 1 млн ₽',['Архитектура','Интеграции','Запуск']]]},
  partners:{lines:["Ваши клиенты","могут приносить вам"],lastWord:"значительно больше.",value:40,suffix:'%',word:'Комиссия до',note:'По условиям партнёрской программы',cards:[
    ['Старт','30%',['Оплаченный проект','Без вступительного платежа']],
    ['Рост','35%',['От 300 тыс. ₽ накопительно','Повторные проекты']],
    ['Партнёрство','40%',['От 1 млн ₽ накопительно','Условия программы']]]},
  portfolio:{lines:["Посмотрите не только","на интерфейсы, но и"],lastWord:"на возможности разработки.",value:3,suffix:'',word:'Форматы',note:'Демонстрационные проекты, не оплаченные внедрения',cards:[
    ['Сайты для бизнеса','Демонстрационный проект',['Адаптивность','Формы']],
    ['Интерактивные каталоги','Демонстрационный проект',['Фильтры','Карточки']],
    ['Веб-приложения','Демонстрационный сценарий',['Интерфейс','Интерактивность']]]}
}
const accents=['#3443b7','#b69a63','#5371c9']
const icons:ProvablyCredential['icon'][]=['pen','chart','type']
const original=document.querySelector<HTMLElement>('.hero')
const heading=original?.querySelector('h1')
const copy=original?.querySelector('.hero-copy')
const route=location.pathname.replace(/\/index\.html$/,'/').split('/').filter(Boolean).at(-1)||'marketing'
const info=pages[route==='marketing'?'home':route]
if(original&&heading&&copy&&info){
  const actions=[...copy.querySelectorAll<HTMLAnchorElement>('.actions a')]
  const [primary,secondary]=actions
  if(primary&&secondary){
    const link=(a:HTMLAnchorElement)=>({label:(a.textContent||'').replace(/↗/g,'').trim(),href:a.getAttribute('href')||'#contact',topic:a.dataset.topic})
    const props={
      copy:{eyebrow:copy.querySelector('.eyebrow')?.textContent?.trim()||'',lines:info.lines,lastWord:info.lastWord,subtext:copy.querySelector('.lead')?.textContent?.trim()||'',checks:[...copy.querySelectorAll('.checks li')].map(e=>e.textContent?.trim()||'')},
      links:{explore:link(primary),howItWorks:link(secondary)},
      toggle:{label:'Включить цветовой режим',hint:{pointer:'Нажмите или перетащите',touch:'Нажмите, чтобы включить'}},
      stats:{value:info.value,suffix:info.suffix,word:info.word,states:{off:'',on:''},note:info.note},
      certificate:{kicker:'SHATON DIGITAL',type:'Возможности решения',sampleLabel:'Демонстрация',demoNote:'Пример, не выданный сертификат',recipientLabel:'Формат',recipientNote:'пример',status:{on:'Цветовой режим',off:'Монохромный режим'},statusDetail:{on:'Интерактивный режим включён. Это демонстрационная карточка.',off:'Включите цветовой режим, чтобы увидеть эффект.'},hover:'Открыть карточку',share:{idle:'Скопировать ссылку на страницу',done:'Ссылка скопирована',locked:'Включите цветовой режим'},tilt:{rest:9,verified:4,hover:0}},
      credentials:info.cards.map(([title,recipient,skills],i)=>({title,recipient,skills,accent:accents[i],icon:icons[i]})),
      statusBadge:{off:'ДЕМО РЕЖИМ',on:'ЦИФРОВЫЕ РЕШЕНИЯ',tail:'SHATON DIGITAL',stampTilt:-6,hint:'Открыть печать',back:{title:'Цифровая разработка',text:'Индивидуальное решение под бизнес-задачу. Интерактивная демонстрация.',action:'Назад'}},
      className:'shaton-provably',
      float:{stats:{x:-570,y:74},certificate:{x:348,y:128},arcLeft:{x:-365,y:145},arcRight:{x:342,y:280}}
    }
    const mount=document.createElement('div')
    mount.className='provably-mount';mount.hidden=true
    original.after(mount)
    class Boundary extends React.Component<{children:React.ReactNode},{failed:boolean}>{
      state={failed:false}
      static getDerivedStateFromError(){return {failed:true}}
      componentDidCatch(){mount.hidden=true;original.hidden=false;if(!original.isConnected)mount.before(original);document.documentElement.dataset.provably='fallback'}
      render(){return this.state.failed?null:this.props.children}
    }
    function Hero(){
      useLayoutEffect(()=>{
        // Detach the original hero only after the real component commits; no duplicate heading.
        original.remove();mount.hidden=false
        mount.classList.add('hero','provably-shell')
        mount.setAttribute('data-glow','')
        document.documentElement.dataset.provably='ready'
        return ()=>{if(!original.isConnected)mount.before(original);mount.hidden=true}
      },[])
      return <Provably {...props}/>
    }
    mount.addEventListener('click',e=>{
      const a=(e.target as Element).closest('[data-topic]') as HTMLElement|null
      if(!a)return
      const select=document.querySelector<HTMLSelectElement>('#request select')
      const topic=a.dataset.topic
      if(select&&topic){if(![...select.options].some(o=>o.value===topic))select.add(new Option(topic,topic));select.value=topic}
    })
    createRoot(mount).render(<Boundary><Hero/></Boundary>)
  }
}
