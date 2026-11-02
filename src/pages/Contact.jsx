import { brand } from '../data'
import './pages.css'

export default function Contact() {
  return (
    <div className="tp-subpage">
      <div className="gutter tp-subpage__head">
        <h1 className="font-plush text-huge tp-subpage__title">
          Get in touch with us
          <svg aria-hidden="true" viewBox="0 0 400 24" preserveAspectRatio="none" className="tp-subpage__underline">
            <path d="M4 15c40-9 70 5 112-2s70-9 112 0 74 8 116-1 38-4 52 1" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
          </svg>
        </h1>
        <p className="text-lede tp-subpage__lede">
          Come cuddle our puppies at our Downtown Dubai showroom, or reach out to our team online to reserve your miniature companion.
        </p>
      </div>

      <div className="gutter tp-contact-grid">
        <article className="tp-contact-card">
          <h2 className="font-plush">WhatsApp Direct</h2>
          <p>
            Connect instantly with our team for live puppy videos, pricing, health records, and adoption queries.
          </p>
          <a
            href={brand.waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-whatsapp"
            style={{ marginTop: 'auto' }}
          >
            Chat {brand.phone}
          </a>
        </article>

        <article className="tp-contact-card">
          <h2 className="font-plush">Showroom Visit</h2>
          <p>
            <strong>Downtown Dubai, UAE</strong><br />
            Open 7 days a week from 11:00 AM – 9:00 PM.<br />
            Appointments are recommended for private playtime in our puppy room.
          </p>
          <a
            href={brand.waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary"
            style={{ marginTop: 'auto' }}
          >
            Book Showroom Visit
          </a>
        </article>

        <article className="tp-contact-card">
          <h2 className="font-plush">Email Enquiry</h2>
          <p>
            For corporate enquiries, international travel inquiries, or documentation requests:
          </p>
          <a
            href={`mailto:${brand.email}`}
            className="btn btn-ghost"
            style={{ marginTop: 'auto' }}
          >
            {brand.email}
          </a>
        </article>
      </div>
    </div>
  )
}
