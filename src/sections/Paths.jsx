import { useEffect, useRef, useState } from 'react'
import Scene from '../components/Scene'
import { Photo } from '../Art'
import { Stop } from '../PupJourney'
import './paths.css'

const SKYLINE = 'M4 118 H30 V84 H46 V96 H58 V60 H74 V96 H86 V74 L96 66 L106 74 V118 M106 96 H122 V40 L130 22 L138 40 V96 H150 V70 H170 V100 H184 V52 H196 V8 L202 2 L208 8 V52 H220 V100 H232 V78 H252 V92 H266 V66 H282 V118 H296'
const PLANE = 'M18 84 C14 70 22 60 40 58 L196 56 C214 56 226 66 228 80 C226 96 212 106 194 106 L64 108 C40 108 24 100 18 84 Z'

// fetch random dog images per breed from dog.ceo
export function useDogPhotos(breeds) {
  const [urls, setUrls] = useState(() => breeds.map(() => ''))
  const key = breeds.join()
  useEffect(() => {
    let live = true
    Promise.all(breeds.map((b) => fetch(`https://dog.ceo/api/breed/${b}/images/random`).then((r) => r.json()).then((j) => j.message).catch(() => '')))
      .then((list) => live && setUrls(list))
    return () => { live = false }
  }, [key])
  return urls
}

// plane follows the svg bezier path keyed to scroll progress
function Flight({ photo }) {
  const box = useRef(null)
  const route = useRef(null)
  const plane = useRef(null)
  useEffect(() => {
    const still = matchMedia('(prefers-reduced-motion: reduce)').matches
    const place = (p) => {
      const r = route.current
      const len = r.getTotalLength()
      const at = Math.min(len, Math.max(0, p * len))
      const pt = r.getPointAtLength(at)
      const a = r.getPointAtLength(Math.min(len, at + 1))
      const b = r.getPointAtLength(Math.max(0, at - 1))
      const deg = (Math.atan2(a.y - b.y, a.x - b.x) * 180) / Math.PI
      plane.current.setAttribute('transform', `translate(${pt.x.toFixed(1)} ${pt.y.toFixed(1)}) rotate(${deg.toFixed(1)})`)
      plane.current.style.opacity = String(Math.min(1, Math.max(0, (p - 0.11) / 0.06)))
    }
    if (still) return place(0.62)
    let raf = 0
    const update = () => {
      raf = 0
      const rect = box.current.getBoundingClientRect()
      const H = innerHeight
      place(Math.min(1, Math.max(0, (H * 0.95 - rect.top) / (rect.height + H * 0.7))))
    }
    const onScroll = () => { raf ||= requestAnimationFrame(update) }
    update()
    addEventListener('scroll', onScroll, { passive: true })
    addEventListener('resize', onScroll)
    return () => { removeEventListener('scroll', onScroll); removeEventListener('resize', onScroll); cancelAnimationFrame(raf) }
  }, [])
  return (
    <div ref={box} className="tp-flight">
      <svg viewBox="0 0 660 300" role="img" aria-label="A plane bringing a puppy from abroad to home">
        <defs><clipPath id="tp-flight-clip"><circle r="25" /></clipPath></defs>
        <path ref={route} d="M40 250 C 170 40, 470 20, 620 168" className="tp-flight__route" />
        <circle cx="40" cy="250" r="7" className="tp-flight__dot" />
        <circle cx="620" cy="168" r="7" className="tp-flight__dot" />
        <text x="40" y="284" textAnchor="middle" className="tp-flight__label">Abroad</text>
        <text x="620" y="202" textAnchor="middle" className="tp-flight__label">Home</text>
        <g ref={plane} transform="translate(410 70)">
          <g transform="translate(-126 -78)">
            <path d="M28 60 L8 26 L34 26 L60 54 Z" className="tp-flight__wing" />
            <path d="M108 112 L142 156 L172 156 L158 112 Z" className="tp-flight__wing tp-flight__wing--far" />
            <path d={PLANE} className="tp-flight__body" />
            <path d="M104 44 L138 2 L168 2 L154 44 Z" className="tp-flight__wing" />
            <path d="M206 64 C215 67 221 73 224 80" className="tp-flight__line" />
          </g>
          <g transform="translate(10 2)">
            <circle r="25" fill="#fbe3b4" />
            {photo && <image href={photo} x="-25" y="-25" width="50" height="50" clipPath="url(#tp-flight-clip)" preserveAspectRatio="xMidYMid slice" />}
            <circle r="25" className="tp-flight__porthole" />
          </g>
        </g>
      </svg>
    </div>
  )
}

export default function Paths() {
  const [shop, flyer] = useDogPhotos(['poodle/toy', 'maltese'])
  return (
    <Scene name="paths" aria-labelledby="paths-title">
      <div className="gutter tp-paths__wrap">
        <h2 id="paths-title" className="tp-paths__title font-plush text-huge">Two ways to meet your puppy</h2>
        <div className="tp-fork">
          <div aria-hidden="true" className="tp-fork__post" />
          <article className="tp-way tp-way--left" aria-labelledby="way-local">
            <h3 id="way-local" className="tp-sign tp-sign--left font-plush">Puppies near you</h3>
            <div className="tp-way__scene" data-pup-look="true">
              <svg viewBox="0 0 300 120" className="tp-way__skyline" aria-hidden="true">
                <path d={SKYLINE} fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <figure className="tp-window">
                <span className="tp-window__glass"><Photo src={shop} label="A puppy in the Pawhaven showroom" /></span>
                <figcaption className="font-scrawl">At our showroom</figcaption>
              </figure>
            </div>
            <p className="tp-way__text">Meet them, cuddle them, bring one home. Visit the puppies we have nearby before you choose.</p>
            <a className="btn btn-primary" href="#puppies">Meet nearby puppies</a>
          </article>
          <article className="tp-way tp-way--right" aria-labelledby="way-abroad">
            <h3 id="way-abroad" className="tp-sign tp-sign--right font-plush">Flown in for you</h3>
            <div className="tp-way__scene" data-pup-look="true">
              <Flight photo={flyer} />
            </div>
            <p className="tp-way__text">Rare teacup puppies from the most trusted breeders abroad. Pick the puppy you love and let us take care of all the travel and paperwork.</p>
            <a className="btn btn-primary" href="#puppies">See puppies from abroad</a>
          </article>
          <Stop pose="sit" facing="right" className="tp-fork__teddy" />
        </div>
      </div>
    </Scene>
  )
}
