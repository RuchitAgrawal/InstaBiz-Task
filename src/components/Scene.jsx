import { useEffect, useRef } from 'react'

export const SKIES = {
  hero: ['#fffdf8', '#fff1d8'],
  meet: ['#fff1d8', '#fbe3b4'],
  paths: ['#fbe3b4', '#f7d18d'],
  chat: ['#f7d18d', '#f0b866'],
  passport: ['#f0b866', '#a65a30'],
  dusk: ['#a65a30', '#4d2b19'],
  night: ['#4d2b19', '#2f1a10'],
  home: ['#2f1a10', '#24130b'],
}

// section shell -- sets sky gradient and toggles data-here/data-visited as it enters view
export default function Scene({ name, tone = 'light', style, className = '', children, ...rest }) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    const io = new IntersectionObserver(([e]) => {
      el.dataset.here = String(e.isIntersecting)
      if (e.isIntersecting) el.dataset.visited = 'true'
    }, { threshold: 0.15 })
    io.observe(el)
    return () => io.disconnect()
  }, [])
  const [top, bottom] = SKIES[name]
  return (
    <section
      ref={ref}
      className={`tp-scene tp-${name} ${className}`}
      data-tone={tone}
      data-here="false"
      data-pup-scene="true"
      style={{ '--sky-top': top, '--sky-bottom': bottom, ...style }}
      {...rest}
    >
      {children}
    </section>
  )
}
