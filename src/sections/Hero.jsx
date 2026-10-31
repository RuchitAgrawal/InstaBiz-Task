import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import Scene from '../components/Scene'
import { Photo } from '../Art'
import { Stop } from '../PupJourney'
import './hero.css'

const SEATS = [[9, 8.6, 0.62, -5], [22.5, 10.4, 0.8, 3], [35, 9.2, 0.7, -2], [65, 9.4, 0.74, 3], [77.5, 10.6, 0.82, -3], [91, 8.4, 0.6, 4]]
const FRIENDS = ['Biscuit', 'Clover', 'Mochi', 'Pip', 'Waffles', 'Juniper']
const BREEDS = ['poodle/toy', 'maltese', 'pomeranian', 'shihtzu', 'havanese', 'spaniel/cocker']
const GAPS = [1900, 2500, 1700, 2300, 2000, 2800, 1800]
const shuffle = (a) => {
  const t = [...a]
  for (let i = t.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [t[i], t[j]] = [t[j], t[i]] }
  return t
}
const seatStyle = (i) => {
  const [x, w, peek, tilt] = SEATS[i]
  return { '--x': `${x}%`, '--w': `${w}rem`, '--peek': peek, '--tilt': `${tilt}deg`, '--i': i }
}

// pups take turns ducking below the quilt and popping back up with their name tag
function Lineup() {
  const ref = useRef(null)
  const [state, setState] = useState({})
  const [shown, setShown] = useState(null)
  const [hover, setHover] = useState(null)
  const [photos, setPhotos] = useState([])

  useEffect(() => {
    let alive = true
    Promise.all(BREEDS.map((b) => fetch(`https://dog.ceo/api/breed/${b}/images/random`).then((r) => r.json()).then((d) => d.message).catch(() => null)))
      .then((urls) => alive && setPhotos(urls))
    return () => { alive = false }
  }, [])

  useEffect(() => {
    const ul = ref.current
    if (!ul || matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const scene = ul.closest('[data-pup-scene]')
    let visible = true, quietUntil = 0, alive = true, queue = [], last = -1, n = 0, timers = []
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting), { threshold: 0.35 })
    io.observe(ul)
    const hush = () => (quietUntil = performance.now() + 1200)
    addEventListener('scroll', hush, { passive: true })
    addEventListener('pointerdown', hush, { passive: true })
    ul.addEventListener('pointerover', hush, { passive: true })
    const later = (fn, ms) => timers.push(setTimeout(fn, ms))
    const tick = () => {
      if (document.hidden || !visible || performance.now() < quietUntil || scene?.dataset.here === 'false') return later(tick, 900)
      if (!queue.length) queue = shuffle([...ul.children].map((c, i) => (c.getClientRects().length ? i : -1)).filter((i) => i >= 0))
        .filter((e, k, a) => !(k === 0 && e === last && a.length > 1))
      const i = queue.shift()
      if (i === undefined) return later(tick, 2000)
      last = i
      setState((s) => ({ ...s, [i]: 'duck' }))
      later(() => {
        setState((s) => ({ ...s, [i]: 'pop' }))
        setShown(i)
        later(() => setShown((t) => (t === i ? null : t)), 1800)
        later(() => setState((s) => ({ ...s, [i]: undefined })), 700)
      }, 360)
      later(tick, GAPS[n++ % GAPS.length])
    }
    const peeks = [...ul.querySelectorAll('.tp-lineup__pup')].flatMap((el) => el.getAnimations()).filter((a) => a.animationName === 'tp-peek')
    const start = () => alive && later(tick, 250)
    Promise.all(peeks.map((a) => a.finished)).then(start, start)
    return () => {
      alive = false
      timers.forEach(clearTimeout)
      io.disconnect()
      removeEventListener('scroll', hush)
      removeEventListener('pointerdown', hush)
      ul.removeEventListener('pointerover', hush)
    }
  }, [])

  const leave = (i) => () => setHover((h) => (h === i ? null : h))
  return (
    <>
      <ul ref={ref} className="tp-lineup" aria-label="A few of the puppies at TeddyPups">
        {FRIENDS.map((name, i) => (
          <li key={i} className="tp-lineup__seat" style={seatStyle(i)}>
            <Link to="/puppies" className="tp-lineup__pup" data-pup-friend data-state={state[i]} aria-label={`Meet ${name}`}
              onPointerEnter={() => setHover(i)} onPointerLeave={leave(i)} onFocus={() => setHover(i)} onBlur={leave(i)}>
              <span className="tp-lineup__photo"><Photo src={photos[i]} label={name} /></span>
            </Link>
          </li>
        ))}
      </ul>
      <ul aria-hidden className="tp-lineup tp-lineup--tags">
        {FRIENDS.map((name, i) => (
          <li key={i} className="tp-lineup__seat" style={seatStyle(i)}>
            <span className="tp-lineup__ghost" data-state={state[i]} data-tag={shown === i || hover === i ? 'show' : undefined}>
              <span className="tp-lineup__name font-scrawl">{name}</span>
            </span>
          </li>
        ))}
      </ul>
    </>
  )
}

export default function Hero() {
  return (
    <Scene name="hero" tone="light" aria-labelledby="hero-title" style={{ '--quilt': '#fff1d8' }}>
      <span aria-hidden className="tp-hero__sun" />
      <div className="tp-hero__copy gutter">
        <p className="tp-hero__note font-scrawl">
          a home before a home
          <svg viewBox="0 0 220 24" preserveAspectRatio="none" className="tp-hero__underline" aria-hidden="true">
            <path d="M4 16 C 60 6, 140 6, 216 14" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
          </svg>
        </p>
        <h1 id="hero-title" className="tp-hero__title font-plush">
          <span className="tp-hero__line">Little dogs with</span>
          <span className="tp-hero__line tp-hero__line--2">very big hearts</span>
        </h1>
        <p className="tp-hero__lede">Visit our sunny puppy room to say hello, or reserve a small breed from caring breeders we know well.</p>
        <div className="tp-hero__actions">
          <Link className="btn btn-primary" to="/puppies">View available puppies</Link>
          <Link className="btn btn-ghost" to="/contact">Enquire about a puppy</Link>
        </div>
      </div>
      <div className="tp-hero__stage">
        <Lineup />
        <Stop pose="peek" act="peekaboo" facing="right" behind lane className="tp-hero__teddy" />
        <div aria-hidden className="tp-quilt">
          <svg className="tp-quilt__edge" width="100%" height="40" preserveAspectRatio="none">
            <defs>
              <pattern id="tp-scallop" width="76" height="40" patternUnits="userSpaceOnUse">
                <path d="M0 40V27A38 25 0 0 1 76 27V40Z" style={{ fill: 'var(--quilt)' }} />
                <path d="M0 27A38 25 0 0 1 76 27" fill="none" stroke="#2a170e" strokeWidth="3" />
                <path d="M11 33A27 19 0 0 1 65 33" fill="none" stroke="#2a170e" strokeWidth="1.6" strokeDasharray="3.5 5.5" strokeLinecap="round" opacity=".42" />
              </pattern>
            </defs>
            <rect width="100%" height="40" fill="url(#tp-scallop)" />
          </svg>
        </div>
      </div>
    </Scene>
  )
}
