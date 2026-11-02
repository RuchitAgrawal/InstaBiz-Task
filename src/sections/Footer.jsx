import { Link } from 'react-router-dom'
import { Stop } from '../PupJourney'
import { Twinkle } from './Night'
import { brand } from '../data'
import './footer.css'

const STARS = [[6, 18, 12.6], [14, 42, 8.4], [23, 12, 9.8], [31, 30, 7], [44, 9, 11.2], [52, 36, 7.7], [63, 15, 10.5], [71, 40, 7], [92, 33, 8.4]]

const EXPLORE = [
  { label: 'Available puppies', path: '/puppies' },
  { label: 'Gone home', path: '/gone-home' },
  { label: 'Happy families', path: '/happy-families' },
  { label: 'How it works', path: '/how-it-works' },
  { label: 'Delivery & collection', path: '/how-it-works#delivery' },
  { label: 'FAQ', path: '/faq' },
  { label: 'Visit & contact', path: '/contact' },
]

const RIM = 'M116 145 A96 12 0 0 1 308 145'
const RIM_FRONT = 'M116 145 A96 12 0 0 0 308 145'

export default function Footer() {
  return (
    <footer className="tp-footer">
      <svg aria-hidden="true" viewBox="0 0 1440 80" preserveAspectRatio="none" className="tp-footer__hill">
        <path d="M0 80V46C160 18 330 8 520 26S880 70 1080 44 1340 6 1440 14V80Z" />
      </svg>
      <div aria-hidden="true" className="tp-footer__sky">
        {STARS.map(([l, t, w], i) => (
          <Twinkle key={i} style={{ left: `${l}%`, top: `${t}%`, width: w, animationDelay: `${(i * 0.4).toFixed(2)}s` }} />
        ))}
        <span className="tp-moon" />
      </div>
      <div className="tp-footer__grid gutter">
        <div className="tp-footer__hello">
          <p className="font-plush text-big tp-footer__title">Home, at last.</p>
          <p className="tp-footer__blurb">
            {brand.fullName} is a Dubai-based brand specializing in miniature puppies, offering premium services and worldwide shipping.
          </p>
        </div>
        <div className="tp-footer__basket">
          <div className="tp-basket">
            <div className="tp-basket__bubble font-scrawl" aria-hidden="true">hm?</div>
            <svg aria-hidden="true" viewBox="0 0 300 240" className="tp-basket__back">
              <ellipse cx="212" cy="145" rx="96" ry="12" className="tp-basket__hollow" />
              <path d={RIM} className="tp-basket__rim-line" />
              <path d={RIM} className="tp-basket__rim" />
            </svg>
            <Stop pose="snug" act="basket" facing="right" behind lane className="tp-basket__pup" />
            <svg aria-hidden="true" viewBox="0 0 300 240" className="tp-basket__front">
              <path d="M116 145 Q118 222 160 232 L264 232 Q306 222 308 145 Q212 170 116 145Z" className="tp-basket__body" />
              <path d="M121 172 Q212 196 303 172 M128 198 Q212 220 296 198" className="tp-basket__weave" />
              <path d="M150 158 L156 230 M182 163 L184 232 M212 164 V232 M242 163 L240 232 M274 158 L268 230" className="tp-basket__weave tp-basket__weave--stakes" />
              <path d={RIM_FRONT} className="tp-basket__rim-line" />
              <path d={RIM_FRONT} className="tp-basket__rim" />
            </svg>
          </div>
        </div>
        <nav aria-label="Footer" className="tp-footer__explore">
          <h2 className="font-scrawl tp-footer__h">Explore</h2>
          <ul className="tp-footer__links">
            {EXPLORE.map((item) => (
              <li key={item.path}>
                <Link className="tp-footer__link" to={item.path}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="tp-footer__contact">
          <h2 className="font-scrawl tp-footer__h">Say hello</h2>
          <ul className="tp-footer__links tp-footer__links--soft">
            <li>
              <a className="tp-footer__wa" href={brand.waLink} target="_blank" rel="noopener noreferrer">
                WhatsApp {brand.phone}
              </a>
            </li>
            <li><a className="tp-footer__mail" href={`mailto:${brand.email}`}>{brand.email}</a></li>
            <li>{brand.city}</li>
          </ul>
          <ul className="tp-footer__social" aria-label="Social media">
            <li><a href={brand.socials.instagram} target="_blank" rel="noopener noreferrer" className="tp-footer__pill">Instagram</a></li>
            <li><a href={brand.socials.tiktok} target="_blank" rel="noopener noreferrer" className="tp-footer__pill">TikTok</a></li>
            <li><a href={brand.socials.facebook} target="_blank" rel="noopener noreferrer" className="tp-footer__pill">Facebook</a></li>
          </ul>
        </div>
      </div>
      <div className="tp-footer__bar gutter">
        <span className="tp-footer__mark">
          <img src="/brand/logo.png" alt="TeddyPups logo" className="tp-footer__logo-img" />
          © {new Date().getFullYear()} {brand.fullName}
        </span>
        <span className="font-scrawl tp-footer__tag">{brand.tagline}</span>
      </div>
    </footer>
  )
}
