import { useState } from 'react'
import { pups, brand } from '../data'
import { Photo } from '../Art'
import { useDogPhotos } from '../sections/Paths'
import './pages.css'

const FILTERS = ['All', 'Maltipoo', 'Pomeranian', 'Poodle', 'Cavapoo', 'Shih Tzu', 'Local', 'Imported']

const DOG_BREEDS = [
  'poodle/toy', 'maltese', 'pomeranian', 'maltese', 'poodle/toy',
  'shihtzu', 'poodle/toy', 'maltese', 'pomeranian', 'pomeranian',
  'havanese', 'spaniel/cocker',
]

export default function Puppies() {
  const [filter, setFilter] = useState('All')
  const photos = useDogPhotos(DOG_BREEDS)

  const filteredPups = pups.filter((p) => {
    if (filter === 'All') return true
    if (filter === 'Local' || filter === 'Imported') return p.origin === filter
    return p.breed.toLowerCase() === filter.toLowerCase()
  })

  return (
    <div className="tp-subpage">
      <div className="gutter tp-subpage__head">
        <h1 className="font-plush text-huge tp-subpage__title">
          Available puppies
          <svg aria-hidden="true" viewBox="0 0 400 24" preserveAspectRatio="none" className="tp-subpage__underline">
            <path d="M4 15c40-9 70 5 112-2s70-9 112 0 74 8 116-1 38-4 52 1" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
          </svg>
        </h1>
        <p className="text-lede tp-subpage__lede">
          Meet our healthy, vet-certified teacup and miniature puppies in Dubai. Each puppy arrives microchipped, fully vaccinated, and backed by a complete health guarantee.
        </p>

        <div className="tp-filters" role="tablist" aria-label="Puppy breed and origin filters">
          {FILTERS.map((f) => (
            <button
              key={f}
              type="button"
              className="tp-filter-pill"
              data-active={filter === f}
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="gutter tp-catalog-grid">
        {filteredPups.map((p, i) => {
          const waText = encodeURIComponent(`Hi TeddyPups! I'm interested in ${p.name} (${p.meta}). Could you share videos and details?`)
          const waUrl = `https://wa.me/971541676733?text=${waText}`

          return (
            <article key={p.id} className="tp-pup-card">
              <div className="tp-pup-card__stage">
                <span className="tp-pup-card__origin">{p.origin}</span>
                <Photo src={photos[i % photos.length]} label={p.name} />
              </div>
              <div className="tp-pup-card__body">
                <div className="tp-pup-card__top">
                  <h2 className="font-plush tp-pup-card__name">{p.name}</h2>
                  <span className="tp-pup-card__price">{p.price}</span>
                </div>
                <p className="tp-pup-card__meta">{p.meta}</p>
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-whatsapp tp-pup-card__btn"
                >
                  Enquire on WhatsApp
                </a>
              </div>
            </article>
          )
        })}
      </div>
    </div>
  )
}
