import { faqs, brand } from '../data'
import { SPARK } from '../sections/Night'
import './pages.css'

export default function FAQ() {
  return (
    <div className="tp-subpage">
      <div className="gutter tp-subpage__head">
        <h1 className="font-plush text-huge tp-subpage__title">
          Questions &amp; answers
          <svg aria-hidden="true" viewBox="0 0 400 24" preserveAspectRatio="none" className="tp-subpage__underline">
            <path d="M4 15c40-9 70 5 112-2s70-9 112 0 74 8 116-1 38-4 52 1" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
          </svg>
        </h1>
        <p className="text-lede tp-subpage__lede">
          Everything you need to know about adopting, health checks, vaccinations, showroom visits, and delivery across the UAE.
        </p>
      </div>

      <div className="gutter" style={{ maxWidth: '64rem', margin: '3.5rem auto 0' }}>
        <dl style={{ display: 'grid', gap: '2rem' }}>
          {faqs.map((f) => (
            <div key={f.q} style={{ border: '3px solid var(--color-cocoa)', background: 'var(--color-milk)', borderRadius: '1.25rem', padding: '1.75rem', boxShadow: '6px 8px #2a170e1a' }}>
              <dt className="font-plush" style={{ fontSize: '1.35rem', display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--color-cocoa)' }}>
                <svg viewBox="0 0 40 40" width="18" height="18" fill="var(--color-toffee)" aria-hidden="true">
                  <path d={SPARK} />
                </svg>
                {f.q}
              </dt>
              <dd style={{ marginTop: '0.75rem', color: 'var(--color-cocoa-soft)', lineHeight: 1.6, paddingLeft: '2.1rem' }}>
                {f.a}
              </dd>
            </div>
          ))}
        </dl>

        <div style={{ marginTop: '4rem', textAlign: 'center', padding: '2.5rem', border: '3px solid var(--color-cocoa)', background: 'var(--color-honey-soft)', borderRadius: '1.5rem', boxShadow: '8px 10px #2a170e22' }}>
          <h2 className="font-plush text-big" style={{ fontSize: '2rem' }}>Have another question?</h2>
          <p style={{ marginTop: '0.6rem', color: 'var(--color-cocoa-soft)' }}>
            Our team is available round the clock on WhatsApp to assist you with breed advice, videos, and appointments.
          </p>
          <a href={brand.waLink} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp" style={{ marginTop: '1.5rem' }}>
            Ask us on WhatsApp
          </a>
        </div>
      </div>
    </div>
  )
}
