import { useEffect, useRef, useState } from 'react'
import Scene from '../components/Scene'
import { Stop } from '../PupJourney'
import { Photo } from '../Art'
import { polaroids } from '../data'
import './dusk.css'

const TILT = [-2.2, 1.6, -0.9, 2.4, -1.5, 0.8, -2.6, 1.2]
const TAPE = ['#f6d79a', '#f9cdbf', '#cfe5f6', '#f6d79a', '#e9dcc4', '#f6d79a', '#f9cdbf', '#cfe5f6']
const TAPES = [['center'], ['left'], ['right'], ['tl', 'tr'], ['center'], ['right'], ['left'], ['center']]
const ORDER = [3, 0, 5, 1, 6, 2, 7, 4]
const BREEDS = ['poodle/toy', 'maltese', 'pomeranian', 'shihtzu', 'havanese', 'spaniel/cocker']

function useDogPhotos(n) {
  const [urls, setUrls] = useState([])
  useEffect(() => {
    let live = true
    Promise.all([...Array(n)].map((_, i) =>
      fetch(`https://dog.ceo/api/breed/${BREEDS[i % BREEDS.length]}/images/random`)
        .then((r) => r.json()).then((j) => (j.status === 'success' ? j.message : '')).catch(() => ''),
    )).then((u) => live && setUrls(u))
    return () => { live = false }
  }, [n])
  return urls
}

// Items already on screen show at once; the rest arm (hidden) and drop in when they scroll into view
function useReveal(ref) {
  useEffect(() => {
    const root = ref.current
    const items = root.querySelectorAll('[data-reveal]:not([data-revealed])')
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      items.forEach((el) => (el.dataset.revealed = 'true'))
      return
    }
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) if (e.isIntersecting) { e.target.dataset.revealed = 'true'; io.unobserve(e.target) }
    }, { rootMargin: '0px 0px -6% 0px', threshold: 0.08 })
    items.forEach((el) => {
      const r = el.getBoundingClientRect()
      if (r.top < innerHeight && r.bottom > 0) el.dataset.revealed = 'true'
      else { el.dataset.armed = 'true'; io.observe(el) }
    })
    return () => io.disconnect()
  }, [ref])
}

export default function Dusk() {
  const wall = useRef(null)
  useReveal(wall)
  const photos = useDogPhotos(polaroids.length)
  return (
    <Scene name="dusk" tone="dark" aria-labelledby="dusk-title">
      <div className="tp-dusk__sky gutter">
        <div className="tp-dusk__head">
          <h2 id="dusk-title" className="font-plush text-huge">Happy families &amp; puppies</h2>
          <p className="text-lede tp-dusk__lede">Every week a Pawhaven pup settles into a brand new home. We love seeing them grow, and these heartwarming snapshots were shared by the families who welcomed one of our puppies into their homes and their hearts.</p>
        </div>
        <figure className="tp-dusk__note">
          <blockquote className="font-plush-text">“Pawhaven walked us through every step. Our pup arrived calm, healthy and very ready for cuddles, and someone always answered whenever we had a question, day or night. Bringing her home felt easy, we could not have asked for more.”</blockquote>
          <figcaption className="font-scrawl">Sam R., Lisbon</figcaption>
        </figure>
      </div>
      <div className="tp-photowall">
        <div ref={wall} className="tp-photowall__wall">
          <ul className="tp-photowall__prints" aria-label="Photos from Pawhaven families">
            {polaroids.map((cap, i) => (
              <li key={cap} data-reveal="true" data-pup-look={i === 1 || i === 4 ? '' : undefined} style={{ '--d': `${ORDER[i] * 110}ms` }}>
                <button type="button" className="tp-photowall__print" aria-label={`Photo ${i + 1}: ${cap}`}>
                  <span className="tp-polaroid" style={{ '--tilt': `${TILT[i]}deg`, '--tape': TAPE[i], '--i': i }}>
                    {TAPES[i].map((t) => <span key={t} aria-hidden="true" className={`tp-tape tp-tape--${t}`} />)}
                    <span className="tp-polaroid__photo"><Photo src={photos[i]} label={cap} /></span>
                    <span className="tp-polaroid__caption font-scrawl">{cap}</span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
          <div className="tp-facade__ground">
            <span aria-hidden="true" className="tp-facade__door" />
            <span aria-hidden="true" className="tp-lamp"><span className="tp-lamp__light" /></span>
            <a className="btn btn-primary tp-facade__cta" href="#families">See every happy family</a>
            <Stop pose="sit" facing="right" className="tp-dusk__teddy" />
          </div>
        </div>
        <div aria-hidden="true" className="tp-street__pavement" />
      </div>
    </Scene>
  )
}
