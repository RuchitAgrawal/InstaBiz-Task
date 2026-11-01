import { useEffect, useRef, useState } from 'react'
import Scene from '../components/Scene'
import { Photo } from '../Art'
import { Stop, cuePup } from '../PupJourney'
import { useDogPhotos } from './Paths'
import './chat.css'

const STEPS = [
  { title: 'Pick your breed', text: "Tell us the breed you love or what you need. We'll match you on availability and lifestyle." },
  { title: 'See photos & details', text: 'We send real photos, health records and every detail you need, right in the chat.' },
  { title: 'Safe delivery home', text: 'Once you confirm, we handle the rest with care so your puppy arrives calm and happy.' },
]
const BREEDS = ['Maltipoo', 'Pomeranian', 'Poodle', 'Cavapoo', 'Shih Tzu']
const SNAPS = ['poodle/toy', 'maltese', 'pomeranian', 'poodle/toy', 'maltese']
const PAW = 'M32 30c-8 0-16 8-16 16 0 5 4 8 9 8 3 0 5-1 7-1s4 1 7 1c5 0 9-3 9-8 0-8-8-16-16-16zM15 22c-3 0-6 3-6 7s3 7 6 7 5-3 5-7-2-7-5-7zM24 9c-3 0-6 3-6 7s3 7 6 7 5-3 5-7-2-7-5-7zM40 9c-3 0-5 3-5 7s2 7 5 7 6-3 6-7-3-7-6-7zM49 22c-3 0-5 3-5 7s2 7 5 7 6-3 6-7-3-7-6-7z'

const useMedia = (q) => {
  const [m, setM] = useState(() => matchMedia(q).matches)
  useEffect(() => {
    const mq = matchMedia(q)
    const on = () => setM(mq.matches)
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [q])
  return m
}

function Clip({ src }) {
  const [on, setOn] = useState(false)
  return (
    <div className="tp-msg tp-msg--them tp-msg--media">
      <div className="tp-clip">
        <Photo src={src} label="A puppy at the Pawhaven showroom" />
        <button type="button" className="tp-clip__play" aria-pressed={on} aria-label={on ? 'Pause video' : 'Play video'} onClick={() => setOn(!on)}>
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d={on ? 'M7 5h3v14H7zM14 5h3v14h-3z' : 'M8 5v14l11-7z'} /></svg>
        </button>
      </div>
    </div>
  )
}

export default function Journey() {
  const wide = useMedia('(min-width: 1024px)')
  const still = useMedia('(prefers-reduced-motion: reduce)')
  const all = still || !wide
  const [step, setStep] = useState(-1)
  const [typing, setTyping] = useState(false)
  const list = useRef(null)
  const last = useRef(-1)
  const photos = useDogPhotos(SNAPS)
  const cur = all ? STEPS.length - 1 : step

  // Active step: the one crossing a thin band 28% to 38% down the viewport
  useEffect(() => {
    if (all) return
    const items = [...list.current.children]
    const io = new IntersectionObserver((es) => {
      for (const e of es) if (e.isIntersecting) setStep(items.indexOf(e.target))
    }, { rootMargin: '-28% 0px -62% 0px' })
    items.forEach((i) => io.observe(i))
    return () => io.disconnect()
  }, [all])

  // Moving forward shows "typing..." for 750ms before the new messages land
  useEffect(() => {
    if (all) return
    const fwd = step > last.current
    last.current = step
    if (!fwd || step < 0) return
    setTyping(true)
    const t = setTimeout(() => {
      setTyping(false)
      const look = document.querySelector(`.tp-chat [data-step="${step}"]`)
      const say = { 1: 'ooh, photos!', 2: 'home soon!' }[step]
      if (look) cuePup({ look, secs: 1.4, say })
    }, 750)
    return () => clearTimeout(t)
  }, [step, all])

  const show = (i) => (i < cur || (i === cur && !typing) ? 'true' : 'false')

  return (
    <Scene name="chat" aria-labelledby="journey-title">
      <div className="tp-chat__grid gutter" data-pin-range="true">
        <div className="tp-chat__story">
          <h2 id="journey-title" className="font-plush text-huge">Your puppy journey</h2>
          <p className="text-lede tp-chat__lede">A friendly, step-by-step service. We make bringing a puppy home simple, safe and fun.</p>
          <ol ref={list} className="tp-chat__steps">
            {STEPS.map((s, i) => (
              <li key={s.title} className="tp-chat__step" data-active={i === cur || undefined} data-done={i < cur || undefined}>
                <span className="tp-chat__num font-plush" aria-hidden="true">{i + 1}</span>
                <h3 className="font-plush tp-chat__title">{s.title}</h3>
                <p className="tp-chat__text">{s.text}</p>
              </li>
            ))}
          </ol>
          <a className="btn btn-ghost tp-chat__cta" href="#how-it-works">How it works</a>
        </div>
        <div className="tp-chat__side">
          <div className="tp-phone" role="group" aria-label="A chat with Pawhaven">
            <div className="tp-phone__bar">
              <span className="tp-phone__avatar" aria-hidden="true">P</span>
              <span>
                <span className="tp-phone__name">Pawhaven</span>
                <span className="tp-phone__status">{typing ? 'typing…' : 'online'}</span>
              </span>
            </div>
            <div className="tp-phone__screen">
              <p className="tp-msg tp-msg--me">Hi Pawhaven! Could you tell me about your puppies?</p>
              <div className="tp-msg-group" data-step="0" data-show={show(0)}>
                <div className="tp-msg tp-msg--them">
                  <p>{STEPS[0].text}</p>
                  <ul className="tp-chips" aria-label="Breeds we have now">
                    {BREEDS.map((b) => <li key={b}><a href="#puppies">{b}</a></li>)}
                  </ul>
                </div>
              </div>
              <div className="tp-msg-group" data-step="1" data-show={show(1)}>
                <div className="tp-msg tp-msg--them tp-msg--media">
                  <div className="tp-snaps">
                    {photos.slice(0, 4).map((src, i) => <span key={i} className="tp-snaps__one"><Photo src={src} label="A puppy photo" /></span>)}
                  </div>
                </div>
                <Clip src={photos[4]} />
                <p className="tp-msg tp-msg--them">{STEPS[1].text}</p>
              </div>
              <div className="tp-msg-group" data-step="2" data-show={show(2)}>
                <div className="tp-msg tp-msg--them">
                  <p>{STEPS[2].text}</p>
                  <svg viewBox="0 0 220 70" className="tp-route" aria-hidden="true">
                    <path d="M14 52 C 60 6, 120 70, 170 28" className="tp-route__line" />
                    <circle cx="14" cy="52" r="5" className="tp-route__dot" />
                    <path d="M164 32 l12 -12 l12 12 v14 h-24 z" className="tp-route__home" />
                    <path d="M176 42 c-2-3-7-2-6 2c1 3 6 5 6 5s5-2 6-5c1-4-4-5-6-2z" className="tp-route__heart" />
                    <path d={PAW} transform="translate(70 22) scale(.3) rotate(70 32 32)" className="tp-route__paw" />
                    <path d={PAW} transform="translate(104 38) scale(.3) rotate(100 32 32)" className="tp-route__paw" />
                  </svg>
                </div>
              </div>
              <p className="tp-typing" data-show={typing ? 'true' : 'false'} aria-hidden="true"><span /><span /><span /></p>
            </div>
            <a href="#contact" className="tp-phone__compose">
              <span>Say hello in the chat</span>
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 20l18-8L3 4v6l12 2-12 2z" /></svg>
            </a>
          </div>
          <Stop pose="sit" facing="right" className="tp-chat__teddy" />
        </div>
      </div>
    </Scene>
  )
}
