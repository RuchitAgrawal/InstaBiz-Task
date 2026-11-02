import { polaroidMoments } from '../data'
import { Mascot } from '../Art'
import './pages.css'

export default function HappyFamilies() {
  return (
    <div className="tp-subpage tp-subpage--families">
      <div className="gutter tp-families-head">
        <div>
          <span className="font-scrawl tp-families-kicker">our wall of happy endings</span>
          <h1 className="font-plush tp-families-title">
            Happy families
            <svg aria-hidden="true" viewBox="0 0 32 30" className="tp-heart-outline">
              <path
                d="M16 27 C 6 18, 2 12, 2 7 A 6 6 0 0 1 14 3 L 16 5 L 18 3 A 6 6 0 0 1 30 7 C 30 12, 26 18, 16 27 Z"
                strokeWidth="2.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </h1>
          <p className="tp-families-lede">
            Nothing makes us happier than seeing our puppies in loving homes! Here are some beautiful moments shared by our amazing clients after welcoming their furry friends.
          </p>
          <p className="font-scrawl tp-families-stat">64 moments and counting</p>
        </div>

        {/* Taped Lined Note on Right */}
        <div className="tp-taped-note">
          <span className="tp-note-tape" aria-hidden="true" />
          <p className="tp-note-text">
            "TeddyPups truly made our dream a reality. They supported us at every step of the import journey. Our Maltipoo arrived healthy, cheerful, and absolutely perfect. Having 24/7 support throughout the process gave us complete peace of mind."
          </p>
          <p className="font-scrawl tp-note-sign">Sarah M., Dubai, UAE</p>
        </div>
      </div>

      {/* Polaroid Wall Grid */}
      <div className="gutter">
        <div className="tp-polaroid-wall">
          {polaroidMoments.map((item, idx) => (
            <article
              key={item.caption}
              className="tp-polaroid-card"
              style={{ transform: `rotate(${item.tilt}deg)` }}
            >
              <span
                className="tp-washi-tape"
                style={{ backgroundColor: item.tape }}
                aria-hidden="true"
              />
              <div className="tp-polaroid-frame">
                <img src={item.img} alt={item.caption} loading="lazy" />
              </div>
              <span className="font-scrawl tp-polaroid-caption">
                {item.caption} {item.emoji}
              </span>
            </article>
          ))}
        </div>

        {/* Bottom Mascot Transition */}
        <div className="tp-families-mascot-row">
          <div className="tp-families-mascot-pup">
            <Mascot pose="sit" />
          </div>
          <p className="font-scrawl tp-families-bottom-quote">
            every one of them was a Teddy Pup once
          </p>
        </div>
      </div>
    </div>
  )
}
