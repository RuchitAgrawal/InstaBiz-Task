import { useState } from 'react'
import { brand } from '../data'
import { Mascot, Paw } from '../Art'
import './pages.css'

export default function Contact() {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [location, setLocation] = useState('')
  const [curiousAbout, setCuriousAbout] = useState('any puppy (not sure yet)')
  const [notes, setNotes] = useState('')
  const [sent, setSent] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    const text = `Dear TeddyPups,\nMy name is ${name || 'a puppy lover'}, and you can reach me on ${phone || 'WhatsApp'}${email ? ` or email ${email}` : ''}.\nI live in ${location || 'Dubai'}, and I'm curious about ${curiousAbout}.\n${notes ? `Note: ${notes}\n` : ''}With love, a future puppy parent`
    const waUrl = `https://wa.me/971541676733?text=${encodeURIComponent(text)}`
    setSent(true)
    window.open(waUrl, '_blank')
  }

  return (
    <div className="tp-subpage tp-subpage--contact">
      {/* Header */}
      <div className="gutter tp-contact-head">
        <div>
          <h1 className="font-plush tp-contact-title">Get in touch with us</h1>
          <div className="tp-contact-top-links">
            <a
              href={brand.waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="tp-btn-wa-pill"
            >
              <Paw size={18} color="#fff" />
              WhatsApp {brand.phone}
            </a>
            <a href="tel:+971541676733" className="tp-contact-link-item">
              call us: {brand.phone}
            </a>
            <a href={`mailto:${brand.email}`} className="tp-contact-link-item">
              email: {brand.email}
            </a>
          </div>
        </div>

        <div>
          <p className="tp-contact-lede">
            Have questions about our puppies or adoption process? Fill out the form, and our team will get back to you promptly. Whether ready to adopt or just seeking info, we'd love to hear from you!
          </p>
        </div>
      </div>

      {/* Main Grid: Showroom Card & Letter Form */}
      <div className="gutter tp-contact-main-grid">
        {/* Left Card: Downtown Dubai Showroom */}
        <article className="tp-showroom-card">
          {/* Striped Canopy Awning */}
          <div className="tp-canopy-awning">
            <div className="tp-canopy-scallop" aria-hidden="true" />
          </div>

          <div className="tp-showroom-content">
            <h2 className="font-plush tp-showroom-title">Visit us in Downtown Dubai</h2>
            <p className="tp-showroom-desc">
              Step into our Downtown Dubai showroom and experience the joy of choosing your puppy face-to-face.
            </p>

            {/* Arched Doorway Photo Frame */}
            <div className="tp-arched-photo-frame">
              <img
                src="https://images.unsplash.com/photo-1591769225440-811ad7d6eab2?w=500&auto=format&fit=crop&q=80"
                alt="Puppy in Downtown Dubai showroom"
                loading="lazy"
              />
            </div>

            <p className="tp-showroom-address">
              <Paw size={16} color="#8d5733" />
              Downtown Dubai, United Arab Emirates
            </p>

            <a
              href="https://maps.google.com/?q=Downtown+Dubai+UAE"
              target="_blank"
              rel="noopener noreferrer"
              className="tp-btn-maps"
            >
              Open in Google Maps
            </a>
          </div>
        </article>

        {/* Right Card: Interactive Letter / Postcard Form */}
        <article className="tp-letter-form-card">
          {/* Stitched Kraft Paw Postage Stamp */}
          <div className="tp-postage-stamp" title="TeddyPups Official Stamp">
            <Paw size={24} color="#b45a2a" />
          </div>

          <form onSubmit={handleSubmit}>
            <h2 className="font-scrawl tp-letter-salutation">Dear TeddyPups,</h2>

            <p className="font-sans tp-letter-fill-row">
              my name is{' '}
              <input
                type="text"
                className="tp-letter-input"
                placeholder="your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              {' '}, and you can reach me on{' '}
              <input
                type="tel"
                className="tp-letter-input"
                placeholder="+971 50 123 4567"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
              {' '}or by email at{' '}
              <input
                type="email"
                className="tp-letter-input"
                placeholder="optional"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              .
            </p>

            <p className="font-sans tp-letter-fill-row" style={{ marginTop: '0.5rem' }}>
              I live in{' '}
              <input
                type="text"
                className="tp-letter-input"
                placeholder="e.g. Dubai Marina"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
              {' '}, and I'm curious about{' '}
              <select
                className="tp-letter-select"
                value={curiousAbout}
                onChange={(e) => setCuriousAbout(e.target.value)}
              >
                <option value="any puppy (not sure yet)">any puppy (not sure yet)</option>
                <option value="Maltipoo">Maltipoo</option>
                <option value="Pomeranian">Pomeranian</option>
                <option value="Poodle">Poodle</option>
                <option value="Cavapoo">Cavapoo</option>
                <option value="Shih Tzu">Shih Tzu</option>
                <option value="Korean Teacup lines">Korean Teacup lines</option>
              </select>
              .
            </p>

            <textarea
              className="tp-letter-textarea"
              placeholder="Anything else you'd like to tell us..."
              rows={4}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />

            <div className="tp-letter-bottom-row">
              <span className="font-scrawl tp-letter-signoff">
                with love, a future puppy parent
              </span>
              <button type="submit" className="tp-btn-post-letter">
                Post my letter
              </button>
            </div>
          </form>

          {/* Sitting Mascot in Bottom Right Corner */}
          <div className="tp-letter-mascot-corner">
            <Mascot pose="sit" />
          </div>

          {sent && (
            <div style={{ marginTop: '1.25rem', padding: '0.75rem', background: '#eaf5ee', border: '1.5px solid #2f8a5a', borderRadius: '0.75rem', color: '#1f7a4d', fontWeight: 650, textAlign: 'center' }}>
              Opening WhatsApp with your letter... Thank you for reaching out!
            </div>
          )}
        </article>
      </div>
    </div>
  )
}
