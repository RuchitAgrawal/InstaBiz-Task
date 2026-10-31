import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Mascot } from '../Art'
import './curtain.css'

export default function CurtainLoader() {
  const location = useLocation()
  const [state, setState] = useState('intro')

  useEffect(() => {
    // on initial load, hold briefly and then lift
    setState('intro')
    const timer = setTimeout(() => {
      setState('lifting')
      const doneTimer = setTimeout(() => setState('idle'), 480)
      return () => clearTimeout(doneTimer)
    }, 950)
    return () => clearTimeout(timer)
  }, [])

  // on route change (after initial mount)
  useEffect(() => {
    setState('covering')
    const holdTimer = setTimeout(() => {
      setState('lifting')
      const clearTimer = setTimeout(() => setState('idle'), 460)
      return () => clearTimeout(clearTimer)
    }, 450)
    return () => {
      clearTimeout(holdTimer)
    }
  }, [location.pathname])

  if (state === 'idle') return null

  return (
    <div className="tp-curtain" data-state={state} aria-hidden="true">
      <div className="tp-curtain__blanket">
        <svg className="tp-curtain__edge tp-curtain__edge--top" width="100%" height="40" preserveAspectRatio="none">
          <defs>
            <pattern id="tp-curtain-scallop-top" width="76" height="40" patternUnits="userSpaceOnUse">
              <path d="M0 40V27A38 25 0 0 1 76 27V40Z" fill="var(--color-honey-soft)" />
              <path d="M0 27A38 25 0 0 1 76 27" fill="none" stroke="#2a170e" strokeWidth="3" />
              <path d="M11 33A27 19 0 0 1 65 33" fill="none" stroke="#2a170e" strokeWidth="1.6" strokeDasharray="3.5 5.5" strokeLinecap="round" opacity=".42" />
            </pattern>
          </defs>
          <rect width="100%" height="40" fill="url(#tp-curtain-scallop-top)" />
        </svg>

        <div className="tp-curtain__stage">
          <div className="tp-curtain__runner">
            <Mascot pose="walk" facing="right" />
          </div>
          <div className="tp-curtain__prints">
            {[...Array(6)].map((_, i) => (
              <span key={i} className="tp-curtain__print" style={{ left: `${i * 18 + 10}%`, animationDelay: `${i * 0.16}s` }}>
                <svg viewBox="0 0 40 40" width="16" height="16" fill="currentColor">
                  <ellipse cx="20" cy="27" rx="9" ry="7.5" />
                  <circle cx="9" cy="17" r="4" /><circle cx="16" cy="10" r="4" /><circle cx="24" cy="10" r="4" /><circle cx="31" cy="17" r="4" />
                </svg>
              </span>
            ))}
          </div>
          <p className="tp-curtain__note font-scrawl">every puppy is family</p>
        </div>

        <svg className="tp-curtain__edge tp-curtain__edge--bottom" width="100%" height="40" preserveAspectRatio="none">
          <defs>
            <pattern id="tp-curtain-scallop-bot" width="76" height="40" patternUnits="userSpaceOnUse">
              <path d="M0 40V27A38 25 0 0 1 76 27V40Z" fill="var(--color-honey-soft)" />
              <path d="M0 27A38 25 0 0 1 76 27" fill="none" stroke="#2a170e" strokeWidth="3" />
              <path d="M11 33A27 19 0 0 1 65 33" fill="none" stroke="#2a170e" strokeWidth="1.6" strokeDasharray="3.5 5.5" strokeLinecap="round" opacity=".42" />
            </pattern>
          </defs>
          <rect width="100%" height="40" fill="url(#tp-curtain-scallop-bot)" />
        </svg>
      </div>
    </div>
  )
}
