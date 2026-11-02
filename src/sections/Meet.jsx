import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import Scene from '../components/Scene'
import { Stop } from '../PupJourney'
import { Photo } from '../Art'
import { pups } from '../data'
import './meet.css'

const BREEDS = ['maltese', 'poodle/toy', 'poodle/toy', 'havanese', 'poodle/toy', 'shihtzu', 'maltese', 'havanese', 'pomeranian', 'pomeranian', 'havanese', 'poodle/toy', 'maltese', 'spaniel/cocker', 'shihtzu']

// extra door entries to fill out the hall track
const doors = [...pups,
{ name: 'Havanese', meta: 'boy, 3 months', door: '#a64a1c' },
{ name: 'Teacup Poodle', meta: 'girl, 2 months', door: '#5a3624' },
{ name: 'Maltese', meta: 'boy, 2 months', door: '#d4893c' },
{ name: 'Cocker Spaniel', meta: 'girl, 3 months', door: '#b9634a' },
{ name: 'Shih Tzu', meta: 'girl, 2.5 months', door: '#7a4a2e' },
]

const clamp01 = (v) => Math.min(1, Math.max(0, v))

function Peephole() {
  return (
    <svg viewBox="0 0 64 64" className="tp-door__peephole" aria-hidden fill="currentColor">
      <ellipse cx="32" cy="44" rx="14" ry="10" />
      <circle cx="15" cy="29" r="5.5" /><circle cx="24" cy="17" r="5.5" />
      <circle cx="40" cy="17" r="5.5" /><circle cx="49" cy="29" r="5.5" />
    </svg>
  )
}

export default function Meet() {
  const range = useRef(null)
  const hall = useRef(null)
  const track = useRef(null)
  const [pinned, setPinned] = useState(false)
  const [travel, setTravel] = useState(0)
  const [photos, setPhotos] = useState([])

  useEffect(() => {
    let live = true
    Promise.all(doors.map((_, i) =>
      fetch(`https://dog.ceo/api/breed/${BREEDS[i % BREEDS.length]}/images/random`)
        .then((r) => r.json()).then((d) => (d.status === 'success' ? d.message : '')).catch(() => ''),
    )).then((urls) => live && setPhotos(urls))
    return () => { live = false }
  }, [])

  // pin on desktop only, scale doors to fit, calc travel distance
  useLayoutEffect(() => {
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
    const measure = () => {
      const wide = matchMedia('(min-width: 1024px)').matches && !reduce
      setPinned(wide)
      const t = track.current, h = hall.current
      if (h && t && wide) {
        const stage = h.parentElement
        const head = stage.querySelector('.tp-meet__head')
        const plate = Math.max(64, ...[...t.querySelectorAll('.tp-door__plate')].map((e) => e.offsetHeight))
        const floor = h.querySelector('.tp-meet__floor')?.offsetHeight ?? 0
        const w = Math.max(128, Math.min(256, 0.15 * innerWidth, (stage.clientHeight - (head ? head.offsetTop + head.offsetHeight : 0) - floor - plate - 40) / 1.3))
        h.style.setProperty('--door-w', `${w.toFixed(0)}px`)
      } else h?.style.removeProperty('--door-w')
      setTravel(t ? Math.max(0, t.scrollWidth - innerWidth) : 0)
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(track.current)
    ro.observe(hall.current.parentElement)
    addEventListener('resize', measure)
    return () => { ro.disconnect(); removeEventListener('resize', measure) }
  }, [])

  // drive horizontal scroll position with a spring
  useLayoutEffect(() => {
    const t = track.current, h = hall.current
    if (!pinned) {
      t.style.transform = ''
      for (const li of t.children) li.dataset.open = 'true'
      return
    }
    const target = () => {
      const r = range.current.getBoundingClientRect()
      const span = r.height - innerHeight
      return span > 0 ? clamp01(-r.top / span) : 0
    }
    const apply = (p) => {
      const x = -p * travel
      t.style.transform = `translateX(${x.toFixed(1)}px)`
      h.style.setProperty('--floor-x', `${x.toFixed(1)}px`)
      const edge = 0.36 * innerWidth
      for (const li of t.children) {
        const open = li.offsetLeft + x < edge || li.classList.contains('tp-door--all')
        if ((li.dataset.open === 'true') !== open) li.dataset.open = String(open)
      }
    }
    // spring setup: stiffness 170, damping 32, mass 0.35
    let pos = target(), vel = 0, last = performance.now(), raf
    apply(pos)
    const tick = (now) => {
      const dt = Math.min(0.064, (now - last) / 1000); last = now
      const goal = target()
      for (let i = 0, n = 8; i < n; i++) {
        const s = dt / n
        vel += ((-170 * (pos - goal) - 32 * vel) / 0.35) * s
        pos += vel * s
      }
      if (Math.abs(goal - pos) < 1e-4 && Math.abs(vel) < 1e-3) { pos = goal; vel = 0 }
      apply(pos)
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [pinned, travel])

  return (
    <Scene name="meet" tone="light" aria-labelledby="meet-title" data-pinned={pinned || undefined}>
      <div
        ref={range}
        data-pin-range="true"
        style={{ height: pinned ? `calc(100vh + ${Math.round(0.8 * travel)}px)` : undefined, '--pinned': +pinned }}
      >
        <div className="tp-meet__stage">
          <header className="tp-meet__head gutter">
            <div>
              <h2 id="meet-title" className="font-plush text-huge">Meet the pups</h2>
              <p className="text-lede tp-meet__lede">Every door hides a puppy waiting to meet its new family.</p>
            </div>
            <a className="btn btn-primary tp-meet__cta" href="#puppies">See all available puppies</a>
          </header>
          <div ref={hall} className="tp-meet__hall">
            <ol ref={track} className="tp-meet__track" data-treadmill="true" aria-label="Puppies looking for a family">
              {doors.map((p, i) => (
                <li key={i} className="tp-door" data-open="false">
                  <a className="tp-door__link" style={{ '--door': p.door }} href="#puppies">
                    <span className="tp-door__plate">
                      <span className="font-plush tp-door__name">{p.name}</span>
                      <span className="tp-door__meta">{p.meta}</span>
                    </span>
                    <span className="tp-door__frame">
                      <span className="tp-door__room"><Photo src={photos[i] || p.img} label={p.name} /></span>
                      <span aria-hidden className="tp-door__way">
                        <span className="tp-door__leaf"><Peephole /><span className="tp-door__knob" /></span>
                      </span>
                      <span className="tp-door__tag font-scrawl">Available</span>
                    </span>
                  </a>
                </li>
              ))}
              <li className="tp-door tp-door--all" data-open="true">
                <a className="tp-door__link" href="#puppies">
                  <span className="tp-door__frame tp-door__frame--all">
                    <span className="font-plush tp-door__all">Meet them all</span>
                  </span>
                </a>
              </li>
            </ol>
            <div aria-hidden className="tp-meet__floor" />
            <Stop pose={pinned ? 'walk' : 'sit'} act={pinned ? 'treadmill' : ''} facing="right" className="tp-meet__teddy" />
          </div>
        </div>
      </div>
    </Scene>
  )
}
