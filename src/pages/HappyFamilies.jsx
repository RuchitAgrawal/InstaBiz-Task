import { polaroids, quotes } from '../data'
import { Photo } from '../Art'
import { useDogPhotos } from '../sections/Paths'
import './pages.css'
import '../sections/dusk.css'

const BREEDS = ['poodle/toy', 'maltese', 'pomeranian', 'shihtzu', 'havanese', 'spaniel/cocker', 'maltese', 'poodle/toy']
const TILT = [-2.2, 1.6, -0.9, 2.4, -1.5, 0.8, -2.6, 1.2]
const TAPE = ['#f6d79a', '#f9cdbf', '#cfe5f6', '#f6d79a', '#e9dcc4', '#f6d79a', '#f9cdbf', '#cfe5f6']
const TAPES = [['center'], ['left'], ['right'], ['tl', 'tr'], ['center'], ['right'], ['left'], ['center']]

export default function HappyFamilies() {
  const photos = useDogPhotos(BREEDS)

  return (
    <div className="tp-subpage">
      <div className="gutter tp-subpage__head">
        <h1 className="font-plush text-huge tp-subpage__title">
          Happy families
          <svg viewBox="0 0 48 44" width="36" height="36" style={{ display: 'inline-block', marginLeft: '0.6rem', verticalAlign: '-0.15em', color: 'var(--color-toffee)' }} aria-hidden="true">
            <path d="M24 40C10 30 4 22 4 14.5 4 8.7 8.6 4 14.3 4c4.1 0 7.6 2.4 9.7 6 2.1-3.6 5.6-6 9.7-6C39.4 4 44 8.7 44 14.5 44 22 38 30 24 40z" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </h1>
        <p className="text-lede tp-subpage__lede">
          Over 500+ miniature puppies have joined loving families across Dubai, Abu Dhabi, and worldwide. Here are a few favorite moments shared by their happy owners.
        </p>
      </div>

      <div className="gutter" style={{ maxWidth: '64rem', margin: '3rem auto 0', display: 'grid', gap: '1.5rem' }}>
        {quotes.map((q) => (
          <blockquote key={q.who} className="tp-dusk__note" style={{ maxWidth: 'none', rotate: '0deg' }}>
            <p className="font-plush-text" style={{ fontSize: '1.2rem', lineHeight: 1.5 }}>"{q.q}"</p>
            <footer className="font-scrawl" style={{ marginTop: '0.6rem', color: 'var(--color-toffee-ink)' }}>{q.who}</footer>
          </blockquote>
        ))}
      </div>

      <div className="gutter" style={{ maxWidth: '104rem', margin: '4rem auto 0' }}>
        <ul className="tp-photowall__prints" style={{ display: 'grid', gap: '2rem 1.5rem' }}>
          {polaroids.map((cap, i) => (
            <li key={cap}>
              <div className="tp-polaroid" style={{ '--tilt': `${TILT[i]}deg`, '--tape': TAPE[i] }}>
                {TAPES[i].map((t) => <span key={t} aria-hidden="true" className={`tp-tape tp-tape--${t}`} />)}
                <span className="tp-polaroid__photo">
                  <Photo src={photos[i % photos.length]} label={cap} />
                </span>
                <span className="tp-polaroid__caption font-scrawl">{cap}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
