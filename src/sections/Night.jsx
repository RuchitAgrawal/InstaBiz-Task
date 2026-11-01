import Scene from '../components/Scene'
import { Stop } from '../PupJourney'
import { faqs } from '../data'
import './night.css'

export const SPARK = 'M20 0C21.6 13 27 18.4 40 20C27 21.6 21.6 27 20 40C18.4 27 13 21.6 0 20C13 18.4 18.4 13 20 0Z'

export function Twinkle({ style }) {
  return (
    <svg viewBox="0 0 40 40" className="tp-twinkle" style={style} aria-hidden="true">
      <path d={SPARK} fill="currentColor" />
    </svg>
  )
}

const STARS = [
  [8, 12, 16.2], [22, 30, 9], [41, 8, 12.6], [57, 22, 8.1], [72, 6, 14.4], [88, 18, 10.8],
  [95, 42, 9], [4, 58, 10.8], [34, 70, 7.2], [63, 84, 9.9], [83, 66, 12.6],
]

export default function Night() {
  return (
    <Scene name="night" tone="dark" aria-labelledby="questions-title">
      <div aria-hidden="true" className="tp-night__stars">
        {STARS.map(([l, t, w], i) => (
          <Twinkle key={i} style={{ left: `${l}%`, top: `${t}%`, width: w, animationDelay: `${(i * 0.4).toFixed(2)}s` }} />
        ))}
      </div>
      <div className="tp-night__grid gutter">
        <div className="tp-night__intro">
          <h2 id="questions-title" className="font-plush text-huge">Questions, answered</h2>
          <a className="btn btn-ghost tp-night__cta" href="#faq">Read all questions</a>
          <div className="tp-night__pup">
            <span aria-hidden="true" className="tp-night__wonder font-plush">?</span>
            <Stop pose="sit" act="tilt" facing="right" className="tp-night__teddy" />
          </div>
        </div>
        <dl className="tp-night__list">
          {faqs.map((f, i) => (
            <div className="tp-qa" key={f.q} {...(i < 2 ? { 'data-pup-look': '' } : {})}>
              <dt className="font-plush tp-qa__q">
                <svg viewBox="0 0 40 40" className="tp-qa__star" aria-hidden="true"><path d={SPARK} fill="currentColor" /></svg>
                {f.q}
              </dt>
              <dd className="tp-qa__a">{f.a}</dd>
            </div>
          ))}
        </dl>
      </div>
    </Scene>
  )
}
