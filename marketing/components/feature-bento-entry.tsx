import React, {useLayoutEffect} from "react";
import {createRoot} from "react-dom/client";
import {Globe, Smartphone, Database, Workflow, BrainCircuit, ShoppingBag, Check, ArrowUpRight, Layers} from "lucide-react";
import MarketingFeatureBento,{type BentoFeature,type BentoVisual} from "./ui/marketing-feature-bento";

function WebPreview(){
 return <div className="mb-web-preview"><div className="mb-browser-bar"><i/><i/><i/><span>business.ru</span><Globe size={15}/></div><div className="mb-web-content"><div><small>Всё для вашего бизнеса</small><b>Услуги онлайн</b><span className="mb-web-line"/><span className="mb-web-cta">Записаться <ArrowUpRight size={12}/></span></div><div className="mb-web-shape"><Globe size={40}/></div></div><div className="mb-web-mobile"><Smartphone size={18}/><span>Адаптивный интерфейс</span></div></div>
}
function SystemPreview(){
 return <div className="mb-system-preview"><div className="mb-system-side"><span><Globe/>Сайт</span><span><Smartphone/>Приложения</span></div><div className="mb-system-connector"/><div className="mb-system-core"><Layers size={30}/><b>Единая система</b><small>Бизнес-логика</small></div><div className="mb-system-connector"/><div className="mb-system-side"><span><BrainCircuit/>ИИ</span><span><Database/>CRM / ERP</span></div></div>
}
const visuals:BentoVisual[]=[
 {type:"waterfall",total:100,unit:"%",spans:[{label:"Запрос",start:0,duration:15},{label:"База знаний",start:15,duration:25},{label:"Анализ",start:40,duration:25,slow:true},{label:"Ответ",start:65,duration:20},{label:"Действие",start:85,duration:15}]},
 {type:"replay",markers:[0,.25,.5,.75,1],position:.5,timecode:"3 / 5",label:"CRM"},
 {type:"code",filename:"app.ts",lines:["const project = {",'  client: "B2B",','  modules: ["CRM", "API"],',"  access: true","};"]},
 {type:"custom",node:<WebPreview/>},
 {type:"cost",value:"Корзина",caption:"Демонстрация заказов",bars:[3,5,8,7,12,9,14,11,16,14,18,20],highlight:11},
 {type:"alerts",alerts:[{title:"Запись подтверждена",meta:"Telegram · клиент"},{title:"Выберите услугу",meta:"Mini App · каталог"},{title:"Новый заказ",meta:"Уведомление · менеджер"}]},
 {type:"keys",shortcuts:[{keys:["API"],label:"Сайт → CRM"},{keys:["ERP"],label:"Заказы → учёт"},{keys:["PAY"],label:"Оплата → заказ"},{keys:["BOT"],label:"CRM → Telegram"}]},
 {type:"custom",node:<SystemPreview/>}
];
const host=document.querySelector<HTMLElement>("[data-feature-bento-host]");
const fallback=host?.querySelector<HTMLElement>("[data-bento-fallback]");
if(host&&fallback){
 const features:BentoFeature[]=Array.from(fallback.querySelectorAll("article")).map((el,i)=>{
   const link=el.querySelector<HTMLAnchorElement>("a.textlink")!;
   return {id:link.hash.slice(1),title:el.querySelector("h3")!.textContent!,description:el.querySelector("p")!.textContent!,href:link.getAttribute("href")!,visual:visuals[i],size:(["lg","sm","sm","sm","sm","md","md","full"] as const)[i]};
 });
 if(features.length===8){
  const mount=document.createElement("div");mount.className="feature-bento-mount";host.prepend(mount);
  class Boundary extends React.Component<{children:React.ReactNode},{failed:boolean}>{
    state={failed:false};static getDerivedStateFromError(){return {failed:true}}
    componentDidCatch(){fallback!.hidden=false;mount.hidden=true;host!.dataset.bentoReady="fallback"}
    render(){return this.state.failed?null:this.props.children}
  }
  function App(){useLayoutEffect(()=>{fallback!.hidden=true;host!.dataset.bentoReady="true";return()=>{fallback!.hidden=false;delete host!.dataset.bentoReady}},[]);return <MarketingFeatureBento features={features}/>}
  createRoot(mount).render(<Boundary><App/></Boundary>);
 }
}
