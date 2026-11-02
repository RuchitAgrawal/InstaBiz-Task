import { steps, stamps, brand } from '../data'
import './pages.css'

export default function HowItWorks() {
  return (
    <div className="tp-subpage">
      <div className="gutter tp-subpage__head">
        <h1 className="font-plush text-huge tp-subpage__title">
          How it works
          <svg aria-hidden="true" viewBox="0 0 400 24" preserveAspectRatio="none" className="tp-subpage__underline">
            <path d="M4 15c40-9 70 5 112-2s70-9 112 0 74 8 116-1 38-4 52 1" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
          </svg>
        </h1>
        <p className="text-lede tp-subpage__lede">
          From your very first enquiry to welcome home day, we guide you step by step to ensure your puppy arrives healthy, confident, and joyful.
        </p>
      </div>

      <div className="gutter tp-guide-timeline">
        {steps.map((s, i) => (
          <article key={s.t} className="tp-guide-card">
            <span className="tp-guide-card__num font-plush">{i + 1}</span>
            <div>
              <h2 className="font-plush tp-guide-card__title">{s.t}</h2>
              <p className="tp-guide-card__text">{s.d}</p>
              {s.chips && (
                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginTop: '0.8rem' }}>
                  {s.chips.map((c) => (
                    <span key={c} style={{ border: '1.5px solid var(--color-cocoa)', background: 'var(--color-honey-soft)', borderRadius: '999px', padding: '0.15rem 0.65rem', fontSize: '0.85rem', fontWeight: 650 }}>
                      {c}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </article>
        ))}
      </div>

      <div className="gutter" style={{ maxWidth: '72rem', margin: '4rem auto 0', textAlign: 'center' }}>
        <h2 className="font-plush text-big" style={{ marginBottom: '2rem' }}>Every TeddyPups delivery includes</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(15rem, 1fr))', gap: '1.5rem', textAlign: 'left' }}>
          {stamps.map((st) => (
            <div key={st.t} style={{ border: '2.5px solid var(--color-cocoa)', background: 'var(--color-milk)', borderRadius: '1rem', padding: '1.5rem', boxShadow: '4px 6px #2a170e1a' }}>
              <h3 className="font-plush" style={{ fontSize: '1.25rem', color: st.c }}>{st.t}</h3>
              <p style={{ marginTop: '0.4rem', color: 'var(--color-cocoa-soft)', fontSize: '0.92rem', lineHeight: 1.5 }}>{st.d}</p>
            </div>
          ))}
        </div>

        <div style={{ marginTop: '3.5rem' }}>
          <a href={brand.waLink} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp" style={{ fontSize: '1.1rem', padding: '0.9rem 2.2rem' }}>
            Message us on WhatsApp to get started
          </a>
        </div>
      </div>
    </div>
  )
}
