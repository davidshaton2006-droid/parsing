import React from "react";
import {motion,useReducedMotion} from "motion/react";
import {Crosshair,MoveUpRight} from "lucide-react";

const hotspots=[
 {id:"engine",name:"Двигатель",x:75,y:55},
 {id:"suspension",name:"Подвеска",x:27,y:76},
 {id:"steering",name:"Рулевое",x:38,y:53},
 {id:"diagnostic",name:"Диагностика",x:55,y:34}
];

export default function CarBlueprint({active="diagnostic",onPick}){
 const reduced=useReducedMotion();
 return <div className="blueprint" role="group" aria-label="Интерактивная схема автомобиля">
   <div className="blueprint-grid" aria-hidden="true"/>
   <div className="blueprint-coordinate top-left" aria-hidden="true">DC // SYSTEM / 04</div>
   <div className="blueprint-coordinate bottom-right" aria-hidden="true">КРАСНОДАР · ЖЛОБЫ 24</div>
   <svg className="blueprint-vehicle" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 940 475" fill="none" role="img" aria-label="Авторская техническая иллюстрация автомобиля, не фотография автосервиса">
    <defs>
      <linearGradient id="autoBody" x1="136" y1="132" x2="730" y2="344" gradientUnits="userSpaceOnUse">
        <stop stopColor="#70b9d0" stopOpacity=".19"/>
        <stop offset=".42" stopColor="#437bb0" stopOpacity=".07"/>
        <stop offset=".78" stopColor="#9e3a46" stopOpacity=".19"/>
        <stop offset="1" stopColor="#e31526" stopOpacity=".13"/>
      </linearGradient>
      <linearGradient id="autoStroke" x1="116" y1="178" x2="823" y2="336" gradientUnits="userSpaceOnUse">
        <stop stopColor="#58b8df"/><stop offset=".5" stopColor="#90afc7"/><stop offset="1" stopColor="#e91c31"/>
      </linearGradient>
      <filter id="redGlow"><feGaussianBlur stdDeviation="7"/></filter>
    </defs>
    <g className="car-construction" stroke="#8e9fb3" strokeWidth="1" strokeOpacity=".25" strokeDasharray="6 8">
      <path d="M86 341H886M95 152H889M185 75V419M734 65V429M22 245H920"/>
      <path d="M93 130L855 388M117 385L837 98"/>
      <circle cx="475" cy="255" r="223" strokeDasharray="2 12"/>
    </g>
    <g strokeLinecap="round" strokeLinejoin="round">
      <path d="M97 307L111 266C132 253 178 243 209 237L290 163C316 141 347 132 389 129H587C636 135 676 155 727 215L817 239C851 248 869 264 877 288L867 316L812 330H150L109 322Z" fill="url(#autoBody)" stroke="url(#autoStroke)" strokeWidth="3.4"/>
      <path d="M291 165C340 141 378 140 431 139H572C616 141 643 160 698 218H287Z" stroke="#72abc6" strokeOpacity=".75" strokeWidth="2.3"/>
      <path d="M405 143L368 217M588 145L622 217" stroke="#6b9db8" strokeWidth="1.5" strokeOpacity=".65"/>
      <path d="M418 220L415 290M631 220L646 292" stroke="#7e9fbe" strokeWidth="1.3" strokeOpacity=".6"/>
      <path d="M219 241L282 220H728L812 244" stroke="#8bc6df" strokeOpacity=".4"/>
      <path d="M183 300H817" stroke="#7f9fbc" strokeOpacity=".75" strokeWidth="1.5"/>
      <path d="M317 231L305 236M548 230H579" stroke="#80bdd8" strokeWidth="3.3"/>
      <path d="M152 285L199 265L190 294L139 302Z" stroke="#f53049" strokeWidth="3" fill="#e3152640"/>
      <path d="M806 258L859 276L864 294L805 289Z" fill="#60c2f02a" stroke="#65b5df" strokeWidth="2"/>
      <path d="M122 294L169 300M826 303L871 297" stroke="#9bb8c9" strokeWidth="2.4"/>
      <path d="M298 161L308 157H397M604 155L650 180" stroke="#def8ff" strokeOpacity=".75" strokeWidth="2"/>
      <path d="M755 229L805 248M234 248L283 231" stroke="#edfaff" strokeOpacity=".65" strokeWidth="2"/>
      <path d="M119 323H878" stroke="#eb2845" strokeOpacity=".52" strokeWidth="2"/>
      <g>
        <circle cx="258" cy="327" r="57" fill="#0e1720" stroke="url(#autoStroke)" strokeWidth="3"/>
        <circle cx="258" cy="327" r="43" stroke="#87bed7" strokeOpacity=".55"/>
        <circle cx="258" cy="327" r="20" stroke="#7db2ca" strokeWidth="2"/>
        <path d="M258 281V372M213 327H303M227 296L289 359M287 294L226 358" stroke="#8bb1c5" strokeOpacity=".35"/>
      </g>
      <g>
        <circle cx="732" cy="327" r="57" fill="#0e1720" stroke="url(#autoStroke)" strokeWidth="3"/>
        <circle cx="732" cy="327" r="43" stroke="#87bed7" strokeOpacity=".55"/>
        <circle cx="732" cy="327" r="20" stroke="#7db2ca" strokeWidth="2"/>
        <path d="M732 281V372M687 327H777M701 296L763 359M761 294L700 358" stroke="#8bb1c5" strokeOpacity=".35"/>
      </g>
      <path d="M368 222H598M367 226L345 302" stroke="#b5d0df" strokeOpacity=".22" strokeWidth="1.2"/>
    </g>
    <path d="M678 245L727 240L756 264" stroke="#ea1b30" strokeWidth="5" strokeOpacity=".6" filter="url(#redGlow)"/>
    <path d="M164 288H213M810 278H864" stroke="#ea1b30" strokeWidth="6" filter="url(#redGlow)" opacity=".7"/>
    <g stroke="#df263c" strokeWidth="1" strokeOpacity=".38">
      <path d="M765 218V126H841"/><path d="M260 380V418H167"/>
    </g>
    <text x="840" y="120" fill="#fa4559" fontSize="12" letterSpacing="3">ENGINE</text>
    <text x="94" y="423" fill="#f34a60" fontSize="11" letterSpacing="2">CHASSIS</text>
   </svg>
   {hotspots.map(h=><button type="button" key={h.id} className={"hotspot"+(active===h.id?" is-active":"")} style={{left:h.x+"%",top:h.y+"%"}} onClick={()=>onPick?.(h.id)} aria-pressed={active===h.id} aria-label={"Показать: "+h.name} title={"Показать: "+h.name}>
    <motion.span className="hotspot-ring" animate={reduced?{}:{scale:[1,1.65,1],opacity:[.6,.12,.6]}} transition={{duration:2.5,repeat:Infinity,delay:(h.x/50),ease:"easeOut"}}/>
    <span className="hotspot-core"><Crosshair size={12}/></span><span className="hotspot-tip">{h.name} <MoveUpRight size={11}/></span>
   </button>)}
   <div className="scan-bar" aria-hidden="true"/>
 </div>;
}
