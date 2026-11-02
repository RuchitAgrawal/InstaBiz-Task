import { useState } from 'react'
import { brand, stepsInDubai, stepsImported, passportStamps, deliveryPoints, whyChoosePoints } from '../data'
import { Mascot, Skyline } from '../Art'
import './pages.css'

export default function HowItWorks() {
  const [activeWay, setActiveWay] = useState('dubai')

  const scrollTo = (id) => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const currentSteps = activeWay === 'dubai' ? stepsInDubai : stepsImported

  return (
    <div className="tp-subpage tp-subpage--guide">
      {/* Top Header */}
      <div className="gutter tp-guide-head">
        <div>
          <h1 className="font-plush tp-guide-title">How it works</h1>
        </div>
        <div>
          <p className="tp-guide-lede">
            Whether you choose to visit us locally or order a premium breed from overseas, TeddyPups is here to make the experience unforgettable.
          </p>
        </div>
      </div>

      {/* 4 Quick Jump Buttons */}
      <div className="gutter">
        <nav className="tp-jump-nav" aria-label="Page navigation">
          <button type="button" className="tp-jump-pill" onClick={() => scrollTo('ways')}>
            1 Two ways home
          </button>
          <button type="button" className="tp-jump-pill" onClick={() => scrollTo('promise')}>
            2 Our premium puppy promise
          </button>
          <button type="button" className="tp-jump-pill" onClick={() => scrollTo('delivery')}>
            3 Delivery &amp; collection
          </button>
          <button type="button" className="tp-jump-pill" onClick={() => scrollTo('why')}>
            4 Why choose us
          </button>
        </nav>
      </div>

      {/* Section 1: Two Ways Home */}
      <section id="ways" className="gutter tp-ways-section" aria-label="Two ways to adopt">
        <div className="tp-ways-top">
          <div>
            <span className="font-scrawl tp-ways-kicker">choose your way</span>
            <h2 className="font-plush tp-ways-title">Two ways home</h2>
          </div>

          {/* Toggle Switcher */}
          <div className="tp-switch-wrap">
            <div className="tp-switch-pill" role="tablist">
              <button
                type="button"
                className="tp-switch-btn"
                data-active={activeWay === 'dubai'}
                onClick={() => setActiveWay('dubai')}
              >
                <span>In Dubai</span>
                <span>meet in person</span>
              </button>
              <button
                type="button"
                className="tp-switch-btn"
                data-active={activeWay === 'imported'}
                onClick={() => setActiveWay('imported')}
              >
                <span>Imported</span>
                <span>order upon request</span>
              </button>
            </div>
            <div className="tp-switch-mascot">
              <Mascot pose="sit" />
            </div>
          </div>
        </div>

        {/* Container Card */}
        <div className="tp-way-container">
          <div className="tp-way-banner">
            <div>
              <span className="font-scrawl" style={{ color: '#8d5733', fontSize: '1.25rem', marginBottom: '0.4rem', display: 'block' }}>
                {activeWay === 'dubai' ? 'Downtown Dubai' : 'Korea & Worldwide'}
              </span>
              <h3 className="font-plush tp-way-banner-h">
                {activeWay === 'dubai' ? 'Meet your puppy in person' : 'Order your dream teacup breed'}
              </h3>
              <p className="tp-way-banner-p">
                {activeWay === 'dubai'
                  ? "Step into our Downtown Dubai showroom and experience the joy of choosing your puppy face-to-face. We source healthy, well-socialized puppies from trusted local breeders, ensuring they're raised with care, proper nutrition, and veterinary checks."
                  : 'Specializing in authentic teacup Maltipoo, Pomeranian, and Toy Poodle puppies from premier Korean bloodlines. We handle live video calls, health certifications, and gentle temperature-controlled flight accompaniment straight to Dubai.'}
              </p>
            </div>

            {/* Skyline & Sun Card */}
            <div className="tp-skyline-sun-box">
              <div className="tp-sun-disc" />
              <Skyline color="#8d5733" style={{ height: '70px', width: '100%', opacity: 0.85 }} />
            </div>
          </div>

          {/* 4 Step Cards Grid */}
          <div className="tp-steps-grid">
            {currentSteps.map((s) => (
              <div key={s.num} className="tp-step-card">
                <div className="tp-step-icon" style={{ backgroundColor: s.color }}>
                  {s.icon === 'search' && (
                    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#2a170e" strokeWidth="2.5" strokeLinecap="round">
                      <circle cx="10" cy="10" r="7" />
                      <line x1="21" y1="21" x2="15" y2="15" />
                    </svg>
                  )}
                  {s.icon === 'heart' && (
                    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#2a170e" strokeWidth="2.5" strokeLinecap="round">
                      <path d="M12 21 C 4 14, 2 9, 2 5.5 A 4.5 4.5 0 0 1 11 2.5 L 12 4 L 13 2.5 A 4.5 4.5 0 0 1 22 5.5 C 22 9, 20 14, 12 21 Z" />
                    </svg>
                  )}
                  {s.icon === 'bear' && (
                    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#2a170e" strokeWidth="2.5" strokeLinecap="round">
                      <circle cx="12" cy="13" r="7" />
                      <circle cx="7" cy="7" r="3" />
                      <circle cx="17" cy="7" r="3" />
                      <circle cx="10" cy="12" r="1" fill="#2a170e" />
                      <circle cx="14" cy="12" r="1" fill="#2a170e" />
                    </svg>
                  )}
                  {s.icon === 'truck' && (
                    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#2a170e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="1" y="4" width="15" height="13" />
                      <polygon points="16 8 20 8 23 11 23 17 16 17 16 8" />
                      <circle cx="5.5" cy="18.5" r="2.5" />
                      <circle cx="18.5" cy="18.5" r="2.5" />
                    </svg>
                  )}
                  {s.icon === 'plane' && (
                    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#2a170e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
                    </svg>
                  )}
                </div>
                <span className="font-scrawl tp-step-num">Step {s.num}</span>
                <h4 className="font-plush tp-step-title">{s.t}</h4>
                <p className="tp-step-desc">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 2: Our Premium Puppy Promise */}
      <section id="promise" className="gutter tp-passport-box" aria-label="Our promise and certifications">
        <span className="font-scrawl tp-passport-kicker">puppy passport</span>
        <h2 className="font-plush tp-passport-title">Our premium puppy promise</h2>

        <div className="tp-stamps-row">
          {passportStamps.map((st) => (
            <div key={st.title} className="tp-stamp-item">
              <div className={`tp-stamp-badge tp-stamp-badge--${st.shape}`}>
                {st.icon === 'pulse' && (
                  <svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                  </svg>
                )}
                {st.icon === 'plane' && (
                  <svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
                  </svg>
                )}
                {st.icon === 'chat' && (
                  <svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                )}
                <span className="tp-stamp-text font-plush">{st.title}</span>
              </div>
              <p className="tp-stamp-desc">{st.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Section 3: Delivery & Collection */}
      <section id="delivery" className="gutter tp-delivery-section" aria-label="Delivery and travel details">
        <div>
          <h2 className="font-plush tp-delivery-title">Delivery &amp; collection</h2>
          <p className="tp-delivery-sub">
            From a same-day visit in Downtown Dubai to a flight from Korea, every puppy travels comfortably and arrives safely.
          </p>

          <div className="tp-delivery-2x2">
            {deliveryPoints.map((pt) => (
              <div key={pt.title}>
                <h4 className="font-plush tp-delivery-item-h">{pt.title}</h4>
                <p className="tp-delivery-item-p">{pt.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right illustration: Korea to Dubai Flight Arc */}
        <div className="tp-flight-arc-box">
          <svg viewBox="0 0 540 320" className="tp-flight-svg" aria-label="Flight trajectory from Korea to Dubai">
            {/* Skyline outlines */}
            <g stroke="#9d7e5d" strokeWidth="1.5" fill="none">
              {/* Korea buildings */}
              <rect x="20" y="220" width="16" height="70" />
              <rect x="40" y="200" width="22" height="90" />
              <rect x="66" y="230" width="18" height="60" />
              {/* Dubai Burj Khalifa & skyscrapers */}
              <rect x="350" y="200" width="20" height="90" />
              <polygon points="395 140 405 140 402 100 398 100" />
              <rect x="390" y="140" width="20" height="150" />
              <rect x="420" y="180" width="24" height="110" />
              <rect x="454" y="210" width="20" height="80" />
              <line x1="10" y1="290" x2="520" y2="290" strokeWidth="2" />
            </g>

            {/* Flight Arc */}
            <path
              d="M50 240 Q 230 40 460 210"
              fill="none"
              stroke="#b5552b"
              strokeWidth="2.5"
              strokeDasharray="6 6"
            />
            {/* Korea Dot */}
            <circle cx="50" cy="240" r="6" fill="#b5552b" />
            <text x="50" y="265" textAnchor="middle" fill="#5a3a28" className="font-scrawl" fontSize="15">
              Korea
            </text>

            {/* Dubai Dot */}
            <circle cx="460" cy="210" r="6" fill="#8e3f15" />
            <text x="460" y="235" textAnchor="middle" fill="#5a3a28" className="font-scrawl" fontSize="15">
              Dubai
            </text>

            {/* Airplane along arc */}
            <g transform="translate(250, 95) rotate(14)">
              <ellipse cx="40" cy="20" rx="36" ry="14" fill="#e8ded2" stroke="#2a170e" strokeWidth="2.5" />
              <polygon points="35 6 48 6 36 -12 28 -12" fill="#8d4320" stroke="#2a170e" strokeWidth="2" />
              <polygon points="35 34 48 34 36 50 28 50" fill="#8d4320" stroke="#2a170e" strokeWidth="2" />
              <polygon points="8 12 16 20 8 28" fill="#8d4320" stroke="#2a170e" strokeWidth="2" />
              <circle cx="60" cy="20" r="3" fill="#2a170e" />
            </g>
          </svg>
        </div>
      </section>

      {/* Section 4: Why Choose Us */}
      <section id="why" className="gutter tp-why-section" aria-label="Why choose TeddyPups">
        <div>
          <h2 className="font-plush tp-why-title">Why choose us</h2>
          <p className="tp-why-p">
            We're here to help you find a new family member. From the moment you visit our site to the joyful day your puppy arrives at your door, we're with you every step of the way. Our mission is to make the entire adoption process smooth, transparent, and full of love.
          </p>
        </div>

        <div className="tp-why-list">
          {whyChoosePoints.map((item) => (
            <div key={item.title} className="tp-why-row">
              <div style={{ color: '#b5552b', paddingTop: '4px' }}>
                {item.icon === 'plane' && (
                  <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
                  </svg>
                )}
                {item.icon === 'chat' && (
                  <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                )}
                {item.icon === 'heart-pulse' && (
                  <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                  </svg>
                )}
              </div>
              <div>
                <h4 className="font-plush tp-why-row-h">{item.title}</h4>
                <p className="tp-why-row-p">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom Container: Unique and high quality puppies */}
      <div className="gutter">
        <div className="tp-unique-card">
          <h3 className="font-plush tp-unique-h">Unique and high quality puppies</h3>
          <p style={{ color: '#5a3a28', marginTop: '1rem', lineHeight: 1.6, fontSize: '1.05rem', maxWidth: '75ch' }}>
            Each teacup puppy represents the pinnacle of ethical breeding: carefully socialized, raised in hygienic environments, fed optimal nutrition, and checked by veterinary professionals before leaving for Dubai. We take pride in transparent lineage verification and lifetime support for every adoptive family.
          </p>
        </div>
      </div>
    </div>
  )
}
