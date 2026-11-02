import { useState } from 'react'
import { Link } from 'react-router-dom'
import { brand, pups, goneHomeTeaser } from '../data'
import { Mascot } from '../Art'
import './pages.css'

export default function Puppies() {
  const [whereFilter, setWhereFilter] = useState('Everywhere')
  const [breedFilter, setBreedFilter] = useState('All')
  const [genderFilter, setGenderFilter] = useState('All')
  const [activePup, setActivePup] = useState(null)

  const filteredPups = pups.filter((p) => {
    if (whereFilter !== 'Everywhere' && p.origin !== whereFilter) return false
    if (breedFilter !== 'All' && p.breed.toLowerCase() !== breedFilter.toLowerCase()) return false
    if (genderFilter !== 'All' && p.gender !== genderFilter && p.gender !== 'Both') return false
    return true
  })

  return (
    <div className="tp-subpage tp-subpage--sketch">
      <div className="gutter tp-sketch-header">
        <div>
          <span className="font-scrawl tp-sketch-kicker">from Teddy's sketchbook</span>
          <h1 className="font-plush tp-sketch-title">
            Available puppies
            <svg aria-hidden="true" viewBox="0 0 600 24" preserveAspectRatio="none" className="tp-sketch-underline">
              <path d="M4 16 C 140 6, 320 22, 592 10" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
            </svg>
          </h1>
          <p className="tp-sketch-lede">
            Every listing shows real photos of the actual puppy. Open a profile to see them all, then ask us about them on WhatsApp.
          </p>
        </div>

        <div className="tp-sketch-medallion">
          <div className="tp-medallion-circle">
            <Mascot pose="sit" />
          </div>
          <span className="font-scrawl tp-medallion-label">self-portrait</span>
        </div>
      </div>

      <div className="gutter">
        <div className="tp-filter-sheet" role="region" aria-label="Puppy filters">
          <span className="tp-filter-tape" aria-hidden="true" />

          {/* Row 1: Where */}
          <div className="tp-filter-row">
            <span className="tp-filter-row-label">where</span>
            <div className="tp-filter-pills">
              {['Everywhere', 'Imported', 'Korean Teacup'].map((loc) => (
                <button
                  key={loc}
                  type="button"
                  className="tp-pill-btn"
                  data-active={whereFilter === loc}
                  onClick={() => setWhereFilter(loc)}
                >
                  {loc}
                </button>
              ))}
            </div>
          </div>

          {/* Row 2: Breed */}
          <div className="tp-filter-row">
            <span className="tp-filter-row-label">breed</span>
            <div className="tp-filter-pills">
              {['Maltipoo', 'Pomeranian', 'Poodle', 'Cavapoo', 'Shih Tzu'].map((b) => {
                const active = breedFilter.toLowerCase() === b.toLowerCase()
                return (
                  <button
                    key={b}
                    type="button"
                    className="tp-pill-btn"
                    data-active={active}
                    onClick={() => setBreedFilter(active ? 'All' : b)}
                  >
                    {b}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Row 3: Boy or Girl */}
          <div className="tp-filter-row">
            <span className="tp-filter-row-label">boy or girl</span>
            <div className="tp-filter-pills">
              {['Boys', 'Girls'].map((g) => {
                const active = genderFilter === g
                return (
                  <button
                    key={g}
                    type="button"
                    className="tp-pill-btn"
                    data-active={active}
                    onClick={() => setGenderFilter(active ? 'All' : g)}
                  >
                    {g}
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Puppy Grid Section */}
        <section className="tp-puppies-section" aria-label="Available puppies grid">
          <p className="font-scrawl tp-puppies-count">
            {filteredPups.length} {filteredPups.length === 1 ? 'puppy' : 'puppies'} looking for a home
          </p>

          <div className="tp-puppies-grid">
            {filteredPups.map((p, i) => {
              const isEven = i % 2 === 0
              return (
                <article
                  key={p.id}
                  className="tp-pup-item"
                  onClick={() => setActivePup(p)}
                  tabIndex={0}
                  role="button"
                  aria-label={`View details for ${p.name}`}
                  onKeyDown={(e) => { if (e.key === 'Enter') setActivePup(p) }}
                >
                  {/* Decorative sketch doodle floating near card */}
                  {i % 3 === 0 && (
                    <svg className="tp-doodle" style={{ top: -16, left: 10, width: 22, height: 20 }} viewBox="0 0 24 22" fill="none" stroke="#2a170e" strokeWidth="2" strokeLinecap="round">
                      <path d="M12 20 C 4 14, 2 9, 2 5.5 A 4.5 4.5 0 0 1 11 2.5 L 12 4 L 13 2.5 A 4.5 4.5 0 0 1 22 5.5 C 22 9, 20 14, 12 20 Z" />
                    </svg>
                  )}
                  {i % 4 === 1 && (
                    <svg className="tp-doodle" style={{ top: -10, right: 12, width: 18, height: 18 }} viewBox="0 0 24 24" fill="#2a170e">
                      <path d="M12 0L14 9L23 11L14 13L12 22L10 13L1 11L10 9Z" />
                    </svg>
                  )}

                  <div className="tp-pup-avatar-wrap">
                    <span className={p.ring === 'blue' ? 'tp-crescent-blue' : 'tp-crescent-tan'} aria-hidden="true" />
                    <div className="tp-pup-photo-disc">
                      <img src={p.img} alt={p.name} loading="lazy" />
                    </div>
                    <span className="tp-badge-available">Available</span>
                    {p.video && (
                      <span className="tp-badge-video" title="Video available">
                        ▶ video
                      </span>
                    )}
                  </div>

                  <h2 className="font-plush tp-pup-name">{p.name}</h2>
                  <p className="tp-pup-subtitle">{p.meta}</p>
                </article>
              )
            })}
          </div>
        </section>
      </div>

      {/* Already Gone Home Teaser Band */}
      <section className="tp-gone-teaser-band" aria-label="Puppies who have found homes">
        <div className="gutter tp-gone-band-inner">
          <div>
            <h2 className="font-plush tp-gone-band-title">Already gone home</h2>
            <p className="tp-gone-band-sub">These puppies have found their families.</p>
            <Link to="/gone-home" className="tp-btn-gone">
              See the puppies who've gone home
            </Link>
          </div>

          <div className="tp-gone-row">
            {goneHomeTeaser.map((p) => (
              <div key={p.name} className="tp-gone-mini-pup">
                <div className="tp-gone-mini-disc">
                  <img src={p.img} alt={p.name} loading="lazy" />
                </div>
                <span className="tp-gone-pill">gone home ♥</span>
                <span className="font-plush tp-gone-name">{p.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Puppy Detail Modal */}
      {activePup && (
        <div className="tp-modal-backdrop" onClick={() => setActivePup(null)} role="dialog" aria-modal="true">
          <div className="tp-modal-card" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="tp-modal-close"
              onClick={() => setActivePup(null)}
              aria-label="Close modal"
            >
              ✕
            </button>
            <img src={activePup.img} alt={activePup.name} className="tp-modal-img" />
            <div className="tp-modal-body">
              <span className="tp-badge-available" style={{ alignSelf: 'flex-start', position: 'static', marginBottom: '0.75rem' }}>
                Available
              </span>
              <h2 className="font-plush" style={{ fontSize: '2rem', color: '#2a170e' }}>
                {activePup.name}
              </h2>
              <p style={{ color: '#8d5733', fontWeight: 650, marginTop: '0.2rem' }}>
                {activePup.meta} · {activePup.origin}
              </p>
              <p style={{ color: '#5a3a28', fontSize: '0.98rem', lineHeight: 1.6, marginTop: '1rem', flex: 1 }}>
                {activePup.description}
              </p>
              <div style={{ background: '#ebe3d5', borderRadius: '1rem', padding: '0.85rem 1rem', marginTop: '1.25rem', fontSize: '0.88rem', color: '#2a170e' }}>
                ✓ Age-appropriate vaccinations<br />
                ✓ Microchip registered<br />
                ✓ Official vet health certificate & passport
              </div>
              <a
                href={`https://wa.me/971541676733?text=${encodeURIComponent(`Hi TeddyPups! I'm interested in adopting ${activePup.name} (${activePup.meta}). Could you share videos and details?`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-whatsapp"
                style={{ marginTop: '1.5rem', width: '100%' }}
              >
                Enquire on WhatsApp
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
