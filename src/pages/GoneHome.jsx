import { goneHomePups } from '../data'
import { Photo } from '../Art'
import { useDogPhotos } from '../sections/Paths'
import './pages.css'

const BREEDS = ['poodle/toy', 'pomeranian', 'maltese', 'havanese', 'shihtzu', 'poodle/toy']

export default function GoneHome() {
  const photos = useDogPhotos(BREEDS)

  return (
    <div className="tp-subpage">
      <div className="gutter tp-subpage__head">
        <h1 className="font-plush text-huge tp-subpage__title">
          Gone home
          <svg viewBox="0 0 48 44" width="36" height="36" style={{ display: 'inline-block', marginLeft: '0.6rem', verticalAlign: '-0.15em', color: 'var(--color-toffee)' }} aria-hidden="true">
            <path d="M24 40C10 30 4 22 4 14.5 4 8.7 8.6 4 14.3 4c4.1 0 7.6 2.4 9.7 6 2.1-3.6 5.6-6 9.7-6C39.4 4 44 8.7 44 14.5 44 22 38 30 24 40z" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </h1>
        <p className="text-lede tp-subpage__lede">
          A celebratory gallery of TeddyPups companions that have safely graduated to their forever homes across the UAE and internationally.
        </p>
      </div>

      <div className="gutter tp-gone-grid">
        {goneHomePups.map((p, i) => (
          <article key={p.name} className="tp-gone-card">
            <div className="tp-gone-card__stage">
              <Photo src={photos[i % photos.length]} label={p.name} />
            </div>
            <div className="tp-gone-card__body">
              <h2 className="font-plush tp-gone-card__name">{p.name}</h2>
              <p className="tp-gone-card__family">{p.family}</p>
              <p className="tp-gone-card__date">{p.breed} • Adopted {p.date}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
