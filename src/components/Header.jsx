import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { brand, nav } from '../data'
import './header.css'

export default function Header() {
  const ref = useRef(null)
  const [open, setOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const el = ref.current
    if (!el) return
    let last = scrollY
    let queued = false
    const update = () => {
      const y = scrollY
      el.dataset.scrolled = String(y > 8)
      if (Math.abs(y - last) > 6) {
        el.dataset.hidden = String(y > last && y > 220)
        last = y
      }
      queued = false
    }
    const onScroll = () => { if (!queued) { queued = true; requestAnimationFrame(update) } }
    const show = () => { el.dataset.hidden = 'false' }
    update()
    addEventListener('scroll', onScroll, { passive: true })
    el.addEventListener('focusin', show)
    return () => { removeEventListener('scroll', onScroll); el.removeEventListener('focusin', show) }
  }, [])

  useEffect(() => {
    const onResize = () => { if (innerWidth >= 1024) setOpen(false) }
    addEventListener('resize', onResize)
    return () => removeEventListener('resize', onResize)
  }, [])

  // close drawer when route changes
  useEffect(() => {
    setOpen(false)
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [location.pathname])

  return (
    <header ref={ref} id="site-header" className="tp-header" data-scrolled="false" data-hidden="false">
      <div className="tp-header__bar gutter">
        <Link to="/" className="tp-header__brand">
          <span className="tp-header__logo-wrap">
            <img src="/brand/logo.png" alt="TeddyPups logo" className="tp-header__logo-img" />
          </span>
          <span className="tp-header__name font-plush">{brand.name}</span>
        </Link>
        <nav className="tp-header__nav" aria-label="Main">
          <ul>
            {nav.map((item) => {
              const active = location.pathname === item.path
              return (
                <li key={item.path}>
                  <Link to={item.path} className="tp-nav-link" data-active={active}>
                    <span>{item.name}</span>
                    <svg className="tp-nav-link__paw" viewBox="0 0 40 40" fill="currentColor" aria-hidden="true">
                      <ellipse cx="20" cy="27" rx="9" ry="7.5" /><circle cx="9" cy="17" r="4" /><circle cx="16" cy="10" r="4" /><circle cx="24" cy="10" r="4" /><circle cx="31" cy="17" r="4" />
                    </svg>
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>
        <div className="tp-header__end">
          <a href={brand.waLink} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp tp-header__wa">WhatsApp us</a>
          <button
            className="tp-header__burger"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <span /><span /><span />
          </button>
        </div>
      </div>
      <svg aria-hidden className="tp-header__hem" width="100%" height="14" preserveAspectRatio="none">
        <defs>
          <pattern id="tp-hem" width="44" height="14" patternUnits="userSpaceOnUse">
            <path d="M0 0H44V2A22 11 0 0 1 0 2Z" className="tp-header__hem-fill" />
            <path d="M0 2A22 11 0 0 0 44 2" className="tp-header__hem-line" />
          </pattern>
        </defs>
        <rect width="100%" height="14" fill="url(#tp-hem)" />
      </svg>

      <div className="tp-drawer" data-open={open} aria-hidden={!open}>
        <nav aria-label="Mobile navigation">
          <ul>
            {nav.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className="tp-drawer__link font-plush"
                  data-active={location.pathname === item.path}
                  onClick={() => setOpen(false)}
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <a href={brand.waLink} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp tp-drawer__wa" onClick={() => setOpen(false)}>WhatsApp us</a>
      </div>
      {open && <div className="tp-drawer__backdrop" onClick={() => setOpen(false)} />}
    </header>
  )
}
