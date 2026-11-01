import Scene from '../components/Scene'
import { Stop } from '../PupJourney'
import './passport.css'

const SW = { fill: 'none', stroke: 'currentColor', strokeWidth: 3, strokeLinecap: 'round', strokeLinejoin: 'round' }

const ENTRIES = [
  { shape: 'round', ink: '#a24a1a', tilt: -8, title: 'Vet-checked & healthy', text: 'Every puppy is vaccinated, dewormed and sent home with a signed health record.',
    icon: <><path d="M32 52S12 40 12 25a10 10 0 0 1 20-3 10 10 0 0 1 20 3c0 15-20 27-20 27z" {...SW} /><path d="M22 30h7l3-7 4 13 3-6h7" {...SW} /></> },
  { shape: 'ticket', ink: '#1f6b45', tilt: 5, title: 'Door to door, safely', text: 'Careful breeders, calm and safe travel, and gentle care the whole way to your home.',
    icon: <><path d="M8 34l40-16 6 4-30 18-8-2z M24 40l4 8 5-3-2-9" {...SW} /><path d="M8 50c10 4 20 4 30 0" {...SW} strokeDasharray="2 7" /></> },
  { shape: 'oval', ink: '#5a3a28', tilt: -4, title: 'Help any hour', text: 'Real people on hand any hour, from your first questions to the first vet visit.',
    icon: <><path d="M10 14h44v28H30l-12 10v-10h-8z" {...SW} /><path d="M22 28h0M32 28h0M42 28h0" {...SW} strokeWidth={5} /></> },
  { shape: 'scallop', ink: '#c2622b', tilt: 7, title: 'Loved in many countries', text: 'Pawhaven puppies have settled into happy homes on several continents.',
    icon: <><circle cx="32" cy="32" r="22" {...SW} /><path d="M10 32h44M32 10c-8 8-8 36 0 44M32 10c8 8 8 36 0 44" {...SW} /></> },
]

// skyline silhouette with a center tower
const CITY = 'M0 160V120h40v-18h26v-24h34v40h22V92h30v34h26v-22h20V70h36v56h24V84h30v42h22V96h28v-50h18l8-10 8 10v80h30V80h26v46h22V60h34v66h20V104h28V56h22v70h30V90h18V40l8-8v-26l4-6 4 6v26l8 8v86h26V88h30v38h22V72h34v54h20V96h28v-36h24v66h22V84h30v42h26V100h30v-32h22v58h24V92h34v34h20V78h28v48h26V106h30v20h38v34z'

export default function Passport() {
  return (
    <Scene name="passport" tone="light" aria-labelledby="trust-title">
      <div className="gutter mx-auto max-w-[96rem]">
        <div className="tp-book">
          <div className="tp-book__page tp-book__page--left">
            <p aria-hidden="true" className="tp-book__kicker font-scrawl">pup passport</p>
            <h2 id="trust-title" className="font-plush tp-book__title">Why so many families trust Pawhaven</h2>
            <Stop pose="sit" facing="right" className="tp-book__teddy" />
          </div>
          <ul className="tp-book__page tp-book__page--right">
            {ENTRIES.map((e, i) => (
              <li key={e.title} className="tp-entry" style={{ '--ink-stamp': e.ink, '--tilt': `${e.tilt}deg`, '--i': i }}>
                <span className={`tp-stamp tp-stamp--${e.shape}`}>
                  <svg viewBox="0 0 64 64" className="tp-stamp__icon" aria-hidden="true">{e.icon}</svg>
                  <span className="tp-stamp__title font-plush">{e.title}</span>
                </span>
                <p className="tp-entry__text">{e.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div aria-hidden="true" className="tp-horizon">
        <span className="tp-horizon__sun" />
        <svg viewBox="0 0 1440 160" preserveAspectRatio="none" className="tp-horizon__city"><path d={CITY} /></svg>
      </div>
    </Scene>
  )
}
