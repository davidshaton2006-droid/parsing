import React, { useLayoutEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { Search, Layers, PenTool, Code2, Rocket, TrendingUp } from 'lucide-react'
import { StepsPath, type PathStep } from './ui/cd-steps-path'

const host = document.querySelector<HTMLElement>('[data-steps-path-host]')
const fallback = host?.querySelector<HTMLElement>('[data-steps-fallback]')
if (host && fallback) {
  const icons = [Search, Layers, PenTool, Code2, Rocket, TrendingUp]
  const steps: PathStep[] = Array.from(fallback.querySelectorAll<HTMLElement>('li')).map((el, i) => {
    const Icon = icons[i]
    return { id: String(i+1), title: el.querySelector('h3')!.textContent!, body: el.querySelector('p')!.textContent!, icon: <Icon className="size-6" aria-hidden /> }
  })
  const mount = document.createElement('div')
  mount.className = 'steps-path-mount'
  host.prepend(mount)
  class Boundary extends React.Component<{children: React.ReactNode}, {failed:boolean}> {
    state={failed:false}
    static getDerivedStateFromError(){return {failed:true}}
    componentDidCatch(){ fallback!.hidden=false; mount.hidden=true; host!.dataset.stepsReady='fallback' }
    render(){return this.state.failed?null:this.props.children}
  }
  function Path(){
    useLayoutEffect(()=>{fallback!.hidden=true;host!.dataset.stepsReady='true';return ()=>{fallback!.hidden=false;delete host!.dataset.stepsReady}},[])
    return <StepsPath steps={steps} title="Этапы проекта" theme="light" autoPlay={false} autoPlayInterval={3800} accentColor="#b69a63" />
  }
  if (steps.length === 6) createRoot(mount).render(<Boundary><Path/></Boundary>)
}
