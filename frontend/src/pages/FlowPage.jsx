// Flow — a calm drawing canvas for unwinding. Named after the psychological
// "flow state" (full, relaxed absorption). Expressive doodling is a simple,
// evidence-friendly way to ease stress — tied to the emotions & stress topic.
import { useEffect, useRef, useState } from 'react'
import DisclaimerBanner from '../components/DisclaimerBanner.jsx'

const COLORS = ['#1e3a5f', '#4a7a6f', '#b8863b', '#a8553f', '#5d7089', '#7a4b63', '#20303c']
const SIZES = [
  { label: 'Fine', w: 3 },
  { label: 'Medium', w: 7 },
  { label: 'Bold', w: 14 },
]
const PAPER = '#fffdf7'
const CANVAS_H = 460

export default function FlowPage() {
  const canvasRef = useRef(null)
  const wrapRef = useRef(null)
  const drawing = useRef(false)

  const [color, setColor] = useState(COLORS[0])
  const [size, setSize] = useState(7)
  const [erasing, setErasing] = useState(false)

  const colorRef = useRef(color)
  const sizeRef = useRef(size)
  const eraseRef = useRef(erasing)
  useEffect(() => { colorRef.current = color }, [color])
  useEffect(() => { sizeRef.current = size }, [size])
  useEffect(() => { eraseRef.current = erasing }, [erasing])

  function setupCanvas() {
    const canvas = canvasRef.current
    const wrap = wrapRef.current
    if (!canvas || !wrap) return
    const dpr = window.devicePixelRatio || 1
    const w = wrap.clientWidth
    canvas.width = Math.round(w * dpr)
    canvas.height = Math.round(CANVAS_H * dpr)
    canvas.style.width = `${w}px`
    canvas.style.height = `${CANVAS_H}px`
    const ctx = canvas.getContext('2d')
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.fillStyle = PAPER
    ctx.fillRect(0, 0, w, CANVAS_H)
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
  }

  useEffect(() => {
    setupCanvas()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function point(e) {
    const rect = canvasRef.current.getBoundingClientRect()
    return { x: e.clientX - rect.left, y: e.clientY - rect.top }
  }

  function startStroke(e) {
    drawing.current = true
    try { canvasRef.current.setPointerCapture(e.pointerId) } catch { /* ignore */ }
    const ctx = canvasRef.current.getContext('2d')
    ctx.strokeStyle = eraseRef.current ? PAPER : colorRef.current
    ctx.lineWidth = eraseRef.current ? sizeRef.current * 3 : sizeRef.current
    const { x, y } = point(e)
    ctx.beginPath()
    ctx.moveTo(x, y)
    ctx.lineTo(x + 0.1, y + 0.1)
    ctx.stroke()
  }
  function moveStroke(e) {
    if (!drawing.current) return
    const ctx = canvasRef.current.getContext('2d')
    const { x, y } = point(e)
    ctx.lineTo(x, y)
    ctx.stroke()
  }
  function endStroke() {
    drawing.current = false
  }

  function clearCanvas() {
    setupCanvas()
  }
  function saveCanvas() {
    try {
      const a = document.createElement('a')
      a.href = canvasRef.current.toDataURL('image/png')
      a.download = 'flow-drawing.png'
      a.click()
    } catch { /* ignore */ }
  }

  return (
    <div className="container page">
      <header style={{ marginBottom: '1.25rem' }}>
        <p className="eyebrow">Take a breath</p>
        <h1 style={{ maxWidth: '18ch' }}>Flow</h1>
        <p className="lead" style={{ maxWidth: '60ch' }}>
          A quiet canvas to unwind. Psychologists describe <em>flow</em> as being calmly,
          fully absorbed in what you’re doing — and free drawing is one of the easiest ways to get
          there. No goal, no grade. Just move, breathe, and let your mind settle.
        </p>
        <p className="muted" style={{ maxWidth: '60ch' }}>
          Tip: breathe in for 4, out for 6, and let the line follow your breath.
        </p>
      </header>

      <div className="card">
        <div className="flow-toolbar">
          <div className="flow-swatches">
            {COLORS.map((c) => (
              <button
                type="button"
                key={c}
                className={`swatch-btn${!erasing && color === c ? ' active' : ''}`}
                style={{ background: c }}
                onClick={() => { setColor(c); setErasing(false) }}
                aria-label={`Color ${c}`}
              />
            ))}
          </div>
          <div className="row" style={{ gap: '6px' }}>
            {SIZES.map((s) => (
              <button
                type="button"
                key={s.w}
                className={`btn ${size === s.w && !erasing ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => { setSize(s.w); setErasing(false) }}
              >
                {s.label}
              </button>
            ))}
          </div>
          <div className="row" style={{ gap: '6px', marginLeft: 'auto' }}>
            <button
              type="button"
              className={`btn ${erasing ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => setErasing((v) => !v)}
            >
              Eraser
            </button>
            <button type="button" className="btn btn-ghost" onClick={clearCanvas}>Clear</button>
            <button type="button" className="btn btn-secondary" onClick={saveCanvas}>Save image</button>
          </div>
        </div>

        <div className="flow-canvas-wrap" ref={wrapRef}>
          <canvas
            ref={canvasRef}
            className="flow-canvas"
            onPointerDown={startStroke}
            onPointerMove={moveStroke}
            onPointerUp={endStroke}
            onPointerLeave={endStroke}
            onPointerCancel={endStroke}
          />
        </div>
      </div>

      <div className="section-gap">
        <DisclaimerBanner text="If you’re going through a hard time, drawing can help you relax — but it’s not a substitute for talking to someone you trust or a professional." />
      </div>
    </div>
  )
}
