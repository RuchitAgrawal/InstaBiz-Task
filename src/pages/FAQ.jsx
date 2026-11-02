import { useState } from 'react'
import { brand, corkboardFaqs } from '../data'
import { Mascot } from '../Art'
import './pages.css'

export default function FAQ() {
  const [search, setSearch] = useState('')
  const [openId, setOpenId] = useState(1) // first question open by default

  const filteredFaqs = corkboardFaqs.filter((f) => {
    if (!search.trim()) return true
    const s = search.toLowerCase()
    return f.q.toLowerCase().includes(s) || f.a.toLowerCase().includes(s)
  })

  const toggle = (id) => {
    setOpenId((prev) => (prev === id ? null : id))
  }

  // slight tilt angles for notes
  const tilts = [-0.5, 0.7, -0.4, 0.6, -0.6, 0.5, -0.3, 0.8, -0.5]

  return (
    <div className="tp-subpage tp-subpage--faq">
      <div className="gutter tp-faq-header">
        <h1 className="font-plush tp-faq-title">Questions &amp; answers</h1>
        <p className="tp-faq-sub">
          Can't find what you're looking for? Message us on WhatsApp - our team is available 24/7.
        </p>
      </div>

      <div className="gutter tp-faq-board-layout">
        {/* Left Side: Search & Sniff Mascot */}
        <div className="tp-faq-sidebar">
          <span className="font-scrawl tp-faq-sniff-label">sniff out a question</span>
          <div className="tp-faq-search-box">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#2a170e" strokeWidth="2.5" strokeLinecap="round">
              <circle cx="10" cy="10" r="7" />
              <line x1="21" y1="21" x2="15" y2="15" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="delivery, Korea, vaccinated..."
              aria-label="Search questions"
            />
          </div>

          <span className="font-scrawl tp-faq-notes-count">
            {filteredFaqs.length} {filteredFaqs.length === 1 ? 'note' : 'notes'} on the board
          </span>

          <div className="tp-faq-mascot-box">
            <div className="tp-faq-bubble font-scrawl">?</div>
            <Mascot pose="sit" />
          </div>

          <a
            href={brand.waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="tp-btn-faq-ask"
          >
            Ask your own question
          </a>
        </div>

        {/* Right Side: Corkboard Bulletin Board */}
        <div className="tp-corkboard-frame" role="region" aria-label="FAQ Corkboard">
          <div className="tp-corkboard-inner">
            {filteredFaqs.length === 0 ? (
              <div style={{ background: '#faf5eb', padding: '2rem', borderRadius: '8px', textAlign: 'center', color: '#5a3a28' }}>
                <p className="font-plush" style={{ fontSize: '1.4rem' }}>No matching notes found</p>
                <p style={{ marginTop: '0.5rem' }}>Feel free to message us directly on WhatsApp with your question!</p>
              </div>
            ) : (
              filteredFaqs.map((f, i) => {
                const isOpen = openId === f.id
                const tilt = tilts[i % tilts.length]
                return (
                  <article
                    key={f.id}
                    className="tp-faq-note"
                    data-open={isOpen}
                    style={{ transform: `rotate(${tilt}deg)` }}
                    onClick={() => toggle(f.id)}
                    tabIndex={0}
                    role="button"
                    aria-expanded={isOpen}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') toggle(f.id) }}
                  >
                    {/* 3D Pushpin at Top Center */}
                    <span
                      className="tp-pushpin"
                      style={{ backgroundColor: f.pin }}
                      aria-hidden="true"
                    />

                    {/* Dog-ear corner fold */}
                    <span className="tp-dogear" aria-hidden="true" />

                    <div className="tp-faq-note-head">
                      <h2 className="font-plush tp-faq-note-q">{f.q}</h2>
                      <svg viewBox="0 0 24 24" className="tp-faq-chevron" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </div>

                    {isOpen && (
                      <p className="tp-faq-note-answer">{f.a}</p>
                    )}
                  </article>
                )
              })
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
