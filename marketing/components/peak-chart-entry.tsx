import * as React from "react"
import { createRoot, Root } from "react-dom/client"
import { PeakChart } from "./ui/peak-chart"

const scenarios = ["Умеренный", "Постепенный", "Интенсивный"]
const stages = ["Старт", "Шаг 1", "Шаг 2", "Шаг 3", "Шаг 4", "Шаг 5", "Финал"]
type Scenario = {manual:number[],auto:number[],scenario:number}
function readScenario(board:HTMLElement):Scenario {
  const raw=board.dataset.peakSeries
  if(raw){try {const x=JSON.parse(raw);if(x.manual?.length===7&&x.auto?.length===7&&Number.isInteger(x.scenario))return x}catch{}}
  return {manual:[100,90,75,65,50,40,35],auto:[0,10,25,35,50,60,65],scenario:0}
}
function useWidth(max=420) {
  const ref=React.useRef<HTMLDivElement>(null)
  const [width,setWidth]=React.useState(0)
  React.useLayoutEffect(()=>{
    const el=ref.current;if(!el)return
    const update=()=>setWidth(Math.max(0,Math.min(max,Math.floor(el.clientWidth-18))))
    update()
    const ro=new ResizeObserver(update);ro.observe(el)
    return ()=>ro.disconnect()
  },[max])
  return {ref,width}
}
class ChartBoundary extends React.Component<{children:React.ReactNode;onFailure:()=>void},{failed:boolean}> {
  state={failed:false}
  static getDerivedStateFromError(){return {failed:true}}
  componentDidCatch(){this.props.onFailure()}
  render(){return this.state.failed?null:this.props.children}
}
function ScenarioCharts({board}:{board:HTMLElement}) {
  const [state,setState]=React.useState(()=>readScenario(board))
  const left=useWidth(),right=useWidth()
  const active=Boolean(left.width&&right.width)
  React.useEffect(()=>{
    const sync=()=>setState(readScenario(board))
    board.addEventListener("marketing:chart-change",sync);sync()
    return ()=>board.removeEventListener("marketing:chart-change",sync)
  },[board])
  React.useEffect(()=>{
    if(!active)return
    board.classList.add("peak-enhanced")
    return ()=>board.classList.remove("peak-enhanced")
  },[board,active])
  const choose=(value:string)=>{const index=scenarios.indexOf(value);board.querySelector<HTMLButtonElement>('[data-ref-chart="'+index+'"]')?.click()}
  const common={labels:stages,domain:[0,100] as [number,number],anchorEnd:true,valueSuffix:"",decimals:0,updatedText:"Модель",periods:scenarios,period:scenarios[state.scenario],onPeriodChange:choose,loop:0,caption:"Финальный индекс из 100",formatValue:(n:number)=>String(Math.round(n))}
  return <div className="peak-chart-grid">
    <div className="peak-chart-cell" ref={left.ref}>{left.width>0&&<PeakChart {...common} width={left.width} data={state.manual} value={state.manual.at(-1)} title="Ручные операции" trend="down" accent="#e6b45e"/>}</div>
    <div className="peak-chart-cell" ref={right.ref}>{right.width>0&&<PeakChart {...common} width={right.width} data={state.auto} value={state.auto.at(-1)} title="Автоматизированные" trend="up" accent="#4f8ef7"/>}</div>
  </div>
}
const board=document.getElementById("ref-chart-board")
if(board){
  const svg=board.querySelector(".ref-dual-chart")
  if(svg){
    const mount=document.createElement("div");mount.className="peak-chart-host";svg.before(mount)
    createRoot(mount).render(<ChartBoundary onFailure={()=>board.classList.remove("peak-enhanced")}><ScenarioCharts board={board}/></ChartBoundary>)
  }
}
const dayValues=[12,18,15,22,24,17,16],days=["Пн","Вт","Ср","Чт","Пт","Сб","Вс"]
function WorkspaceChart({fallback}:{fallback:HTMLElement}) {
  const {ref,width}=useWidth(360)
  const ready=width>0
  React.useEffect(()=>{if(!ready)return;fallback.hidden=true;return ()=>{fallback.hidden=false}},[fallback,ready])
  return <div className="peak-workspace-cell" ref={ref}>{width>0&&<PeakChart width={width} data={dayValues} labels={days} domain={[0,30]} value={124} valueSuffix="" title="Обращения" caption="За 7 дней · демонстрация" updatedText="Демо" periods={["7 дней"]} defaultPeriod="7 дней" trend="none" accent="#4f8ef7" formatValue={n=>String(Math.round(n))}/>}</div>
}
const body=document.getElementById("workspace-body")
if(body){
  let root:Root|null=null,mount:HTMLElement|null=null
  const sync=()=>{
    if(mount&&!mount.isConnected){root?.unmount();root=null;mount=null}
    const fallback=body.querySelector<HTMLElement>(".workspace-chart")
    if(!fallback||mount)return
    mount=document.createElement("div");mount.className="peak-workspace-host";fallback.before(mount)
    root=createRoot(mount)
    root.render(<ChartBoundary onFailure={()=>{fallback.hidden=false}}><WorkspaceChart fallback={fallback}/></ChartBoundary>)
  }
  new MutationObserver(sync).observe(body,{childList:true});sync()
}
