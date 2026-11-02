import { Link } from 'react-router-dom'
import { goneHomePups } from '../data'
import { Mascot } from '../Art'
import './pages.css'

export default function GoneHome() {
  return (
    <div className="tp-subpage tp-subpage--sketch">
      <div className="gutter tp-sketch-header">
        <div>
          <span className="font-scrawl tp-sketch-kicker">happy beginnings</span>
          <h1 className="font-plush tp-sketch-title">
            Puppies who've gone home
            <svg aria-hidden="true" viewBox="0 0 600 24" preserveAspectRatio="none" className="tp-sketch-underline">
              <path d="M4 16 C 140 6, 320 22, 592 10" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
            </svg>
          </h1>
          <p className="tp-sketch-lede">
            A celebratory gallery of TeddyPups companions that have safely graduated to their forever homes across the UAE and internationally.
          </p>
        </div>

        <div className="tp-sketch-medallion">
          <div className="tp-medallion-circle">
            <Mascot pose="sit" />
          </div>
          <span className="font-scrawl tp-medallion-label">cherished alumni</span>
        </div>
      </div>

      <div className="gutter" style={{ maxWidth: '110rem', margin: '3.5rem auto 0' }}>
        <div className="tp-puppies-grid">
          {goneHomePups.map((p, i) => (
            <article key={p.name} className="tp-pup-item">
              <div className="tp-pup-avatar-wrap">
                <span className={i % 2 === 0 ? 'tp-crescent-tan' : 'tp-crescent-blue'} aria-hidden="true" />
                <div className="tp-pup-photo-disc">
                  <img src={p.img} alt={p.name} loading="lazy" />
                </div>
                <span className="tp-badge-available" style={{ background: '#fbf7ef', color: '#8e3f15' }}>
                  gone home ♥
                </span>
              </div>

              <h2 className="font-plush tp-pup-name">{p.name}</h2>
              <p className="tp-pup-subtitle" style={{ fontWeight: 650, color: '#8d5733' }}>
                {p.family}
              </p>
              <p style={{ fontSize: '0.85rem', color: '#5a3a28', marginTop: '0.2rem' }}>
                {p.breed} · {p.date}
              </p>
            </article>
          ))}
        </div>

        <div style={{ marginTop: '5rem', textAlign: 'center' }}>
          <p className="font-scrawl" style={{ fontSize: '1.5rem', color: '#5a3a28', marginBottom: '1.25rem' }}>
            Looking for your own teacup companion?
          </p>
          <Link to="/puppies" className="btn btn-primary" style={{ padding: '0.9rem 2.2rem', fontSize: '1.05rem' }}>
            Meet our available puppies
          </Link>
        </div>
      </div>
    </div>
  )
}
