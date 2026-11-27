"use client"
import * as React from "react"
import { animate, motion, useMotionValue, useMotionValueEvent, useReducedMotion, useTransform } from "motion/react"
import { ArrowLeft, ArrowRight, Check, Moon, Pause, Play, RotateCcw, Sun } from "lucide-react"
import { cn } from "../../lib/utils"

export interface PathStep {
  id: string
  title: string
  body: string
  icon?: React.ReactNode
}
export interface StepsPathProps {
  steps: PathStep[]
  title?: string
  defaultStep?: number
  /** "system" follows prefers-color-scheme until the toggle is pressed. */
  theme?: "system" | "light" | "dark"
  /** Hex driving the gold accent glow, exposed as a CSS variable (--sp-gold) so a consumer never has to override a raw literal. */
  accentColor?: string
  /** Starts the route auto-advancing; the play/pause control still lets a visitor take over at any time. */
  autoPlay?: boolean
  /** Milliseconds between auto-advanced steps. */
  autoPlayInterval?: number
  onChange?: (index: number) => void
  className?: string
}

const GOLD = "var(--sp-gold)"
const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v))

function StepCard({ s, i, reduce, active, total }: { s: PathStep; i: number; reduce: boolean; active: boolean; total: number }) {
  return (
    <motion.li aria-hidden={!active} aria-roledescription="slide" aria-label={`Этап ${i + 1} из ${total}: ${s.title}`} className="sp-card absolute top-0 list-none" initial={false} animate={{ opacity: active ? 1 : 0 }} transition={{ duration: reduce ? 0 : 0.18 }} style={{ visibility: active ? "visible" : "hidden", zIndex: active ? 2 : 1 }}>
      <div className="sp-card-body relative overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-[0_26px_44px_-28px_color-mix(in_oklab,var(--primary)_75%,transparent)]">
        <motion.span aria-hidden className="pointer-events-none absolute -right-2 -top-6 select-none text-[120px] font-black leading-none tracking-tighter text-primary/10">{i + 1}</motion.span>
        <div className="sp-card-heading relative flex items-center gap-3">
          <span className="sp-card-icon grid size-11 place-items-center rounded-2xl text-primary-foreground" style={{ background: `linear-gradient(135deg,var(--primary),${GOLD})` }}>{s.icon ?? <span className="font-bold">{i + 1}</span>}</span>
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Этап {i + 1}</p>
        </div>
        <h3 className="relative mt-3 text-2xl font-bold tracking-tight">{s.title}</h3>
        <p className="relative mt-1.5 text-[17px] leading-relaxed text-muted-foreground">{s.body}</p>
      </div>
    </motion.li>
  )
}

function useDark(theme: "system" | "light" | "dark") {
  const [dark, setDark] = React.useState(theme === "dark")
  React.useEffect(() => {
    if (theme !== "system") { setDark(theme === "dark"); return }
    const m = window.matchMedia("(prefers-color-scheme: dark)"); setDark(m.matches)
    const f = (e: MediaQueryListEvent) => setDark(e.matches); m.addEventListener("change", f); return () => m.removeEventListener("change", f)
  }, [theme])
  return [dark, setDark] as const
}

export function StepsPath({ steps, title = "Этапы проекта", defaultStep = 0, theme = "system", accentColor = "#b69a63", autoPlay = false, autoPlayInterval = 3200, onChange, className }: StepsPathProps) {
  const reduce = !!useReducedMotion()
  const [dark, setDark] = useDark(theme)
  const n = steps.length, last = Math.max(1, n - 1)
  const box = React.useRef<HTMLDivElement>(null)
  const [step, setStep] = React.useState(defaultStep)
  const [burst, setBurst] = React.useState(0)
  const [playing, setPlaying] = React.useState(autoPlay && !reduce)
  const pos = useMotionValue(defaultStep)
  const drag = React.useRef<{ v: number; t: number; p: number; kind: "knob" | "card"; x: number } | null>(null)
  const destination = React.useRef(defaultStep)
  useMotionValueEvent(pos, "change", (v) => {
    const r = clamp(Math.round(v), 0, n - 1)
    setStep((s) => s === r ? s : r)
  })
  // Every marker, the line, and the draggable knob share the same percentage coordinate system.
  // No pixel measurements or stale resize-dependent motion values are used for rendering.
  const progress = useTransform(pos, (v) => `${clamp(v / last, 0, 1) * 100}%`)
  const settle = React.useCallback((target: number, velocity = 0) => {
    const t = clamp(target, 0, n - 1); destination.current = t; pos.stop(); onChange?.(t)
    if (reduce) { pos.set(t); setStep(t); return }
    animate(pos, t, { type: "spring", stiffness: 260, damping: 38, velocity: clamp(velocity, -8, 8) }).then(() => { if (destination.current === t) { setStep(t); setBurst((b) => b + 1) } })
  }, [n, onChange, pos, reduce])

  /* autoplay: advances on an interval, skips a tick mid-drag, and yields the moment a visitor takes manual control */
  React.useEffect(() => {
    if (!playing || n < 2) return
    const id = window.setInterval(() => {
      if (drag.current) return
      const s = destination.current
      settle(s >= n - 1 ? 0 : s + 1)
    }, Math.max(900, autoPlayInterval))
    return () => window.clearInterval(id)
  }, [playing, n, autoPlayInterval, settle])

  const begin = (kind: "knob" | "card") => (e: React.PointerEvent) => { setPlaying(false); (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId); pos.stop(); drag.current = { v: 0, t: performance.now(), p: pos.get(), kind, x: e.clientX } }
  const move = (e: React.PointerEvent) => {
    const d = drag.current; if (!d) return
    let next: number
    if (d.kind === "knob") { const b = box.current!.getBoundingClientRect(); next = ((e.clientX - b.left) / Math.max(1,b.width)) * last }
    else { const card = (e.currentTarget as HTMLElement).querySelector(".sp-card[aria-hidden=false]"); const width = card ? card.getBoundingClientRect().width : 280; next = d.p - (e.clientX - d.x) / Math.max(1,width * 0.55) }
    const now = performance.now(); const cur = pos.get(); d.v = (next - cur) / Math.max(1, now - d.t) * 1000; d.t = now
    pos.set(clamp(next, 0, n - 1))
  }
  const end = () => { const d = drag.current; drag.current = null; if (d) settle(d.kind === "knob" ? Math.round(pos.get()) : Math.round(pos.get() + clamp(d.v * 0.1, -0.65, 0.65)), d.v) }
  const key = (e: React.KeyboardEvent) => {
    const m: Record<string, number> = { ArrowRight: step + 1, ArrowUp: step + 1, ArrowLeft: step - 1, ArrowDown: step - 1, Home: 0, End: n - 1 }
    if (e.key in m) { e.preventDefault(); setPlaying(false); settle(m[e.key]) }
  }
  const btn = "grid size-11 place-items-center rounded-full border border-border bg-card outline-none transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:opacity-35"
  const isLast = step === n - 1
  return (
    <div data-steps-path="" className={cn(dark && "dark", "w-full")} style={{ "--sp-gold": accentColor } as React.CSSProperties}>
      <section aria-roledescription="carousel" aria-label={title} className={cn("relative w-full overflow-hidden rounded-3xl border border-border bg-background p-5 pb-6 sm:p-8 text-foreground", className)}>
        <div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: `radial-gradient(60% 40% at 50% 0%, color-mix(in oklab, ${GOLD} 20%, transparent), transparent), radial-gradient(50% 40% at 100% 100%, color-mix(in oklab, var(--primary) 16%, transparent), transparent)` }} />
        <div className="relative flex items-center justify-between gap-3">
          <div><h2 className="text-xl font-bold tracking-tight">{title}</h2><p className="text-sm tabular-nums text-muted-foreground" aria-live="polite">Этап {step + 1} из {n}: {steps[step]?.title}{playing ? " · авто" : ""}</p></div>
          <div className="flex items-center gap-2">
            <button type="button" aria-pressed={playing} aria-label={playing ? "Приостановить автопрокрутку" : "Включить автопрокрутку"} onClick={() => setPlaying((p) => !p)} className={btn}>{playing ? <Pause className="size-4" aria-hidden /> : <Play className="size-4" aria-hidden />}</button>
            <button type="button" aria-pressed={dark} aria-label="Тёмная тема" onClick={() => setDark((v) => !v)} className={btn}>{dark ? <Sun className="size-4" aria-hidden /> : <Moon className="size-4" aria-hidden />}</button>
          </div>
        </div>

        <div ref={box} data-sp-track className="sp-track relative touch-none select-none">
          <div aria-hidden className="sp-track-base"/>
          <motion.div aria-hidden className="sp-track-fill" style={{width:progress}}/>
          {steps.map((s, i) => {
            const t = i / last
            return (
              <button key={s.id} type="button" aria-current={i === step ? "step" : undefined} aria-label={`Перейти к этапу ${i + 1}: ${s.title}`} onClick={() => { setPlaying(false); settle(i) }} data-sp-marker={i+1} className="sp-marker absolute grid place-items-center rounded-full outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring" style={{ left: `${t * 100}%` }}>
                <span className={cn("sp-marker-face grid place-items-center rounded-full border-2 text-xs font-bold", i <= step ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-muted-foreground")}>
                  {i < step ? <Check className="size-3.5" aria-hidden /> : i + 1}
                </span>
              </button>
            )
          })}
          <motion.div data-sp-knob className="sp-knob absolute size-11" style={{ left: progress, x: "-50%", y: "-50%" }}>
            {burst > 0 && !reduce && (
              <span key={burst} aria-hidden className="pointer-events-none absolute left-1/2 top-1/2">
                {Array.from({ length: 10 }, (_, k) => { const a = (k / 10) * Math.PI * 2; return <motion.span key={k} className="absolute -ml-[3px] -mt-[3px] block size-1.5 rounded-full" style={{ background: k % 2 ? GOLD : "var(--primary)" }} initial={{ x: 0, y: 0, opacity: 1, scale: 1 }} animate={{ x: Math.cos(a) * 34, y: Math.sin(a) * 34, opacity: 0, scale: 0.2 }} transition={{ duration: 0.7, ease: "easeOut" }} /> })}
              </span>
            )}
            <div role="slider" tabIndex={0} aria-label="Этап проекта" aria-orientation="horizontal" aria-valuemin={1} aria-valuemax={n} aria-valuenow={step + 1} aria-valuetext={`Этап ${step + 1}: ${steps[step]?.title}`} onKeyDown={key} onPointerDown={begin("knob")} onPointerMove={move} onPointerUp={end} onPointerCancel={end}
              className="grid size-11 cursor-grab place-items-center rounded-full outline-none active:cursor-grabbing focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring">
              <span className="sp-knob-face" style={{ boxShadow: `0 0 0 2px var(--primary), 0 5px 12px -4px color-mix(in oklab, var(--primary) 55%, transparent)` }}>{step+1}</span>
            </div>
          </motion.div>
        </div>

        <div onPointerDown={begin("card")} onPointerMove={move} onPointerUp={end} onPointerCancel={end} data-sp-cards className="sp-cards relative mt-2 touch-pan-y cursor-grab select-none active:cursor-grabbing">
          <ul className="relative h-full">{steps.map((s, i) => <StepCard key={s.id} s={s} i={i} reduce={reduce} active={i === step} total={n} />)}</ul>
        </div>

        <div className="relative mt-3 flex items-center justify-between gap-2 sm:gap-3">
          <button type="button" className={btn} aria-label="Предыдущий этап" disabled={step === 0} onClick={() => { setPlaying(false); settle(step - 1) }}><ArrowLeft className="size-4" aria-hidden /></button>
          <p className="text-center text-xs text-muted-foreground min-w-0">Перетащите бегунок или листайте карточки</p>
          <button type="button" onClick={() => { setPlaying(false); settle(isLast ? 0 : step + 1) }} className="flex h-11 items-center gap-2 rounded-full bg-primary px-4 text-sm font-semibold text-primary-foreground outline-none transition-transform hover:scale-[1.04] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring">
            {isLast ? <>Сначала <RotateCcw className="size-4" aria-hidden /></> : <>Далее <ArrowRight className="size-4" aria-hidden /></>}
          </button>
        </div>
      </section>
    </div>
  )
}