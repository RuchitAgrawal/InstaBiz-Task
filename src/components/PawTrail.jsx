import { useEffect, useRef } from 'react'
import './paw-trail.css'

export default function PawTrail() {
  const containerRef = useRef(null)

  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const container = containerRef.current
    if (!container) return

    let lastX = 0
    let lastY = 0
    let stepCount = 0

    const onPointerMove = (e) => {
      const x = e.clientX
      const y = e.clientY
      const dx = x - lastX
      const dy = y - lastY
      const dist = Math.hypot(dx, dy)

      if (dist < 32) return

      lastX = x
      lastY = y
      stepCount++

      const angle = Math.atan2(dy, dx) + Math.PI / 2
      const side = (stepCount % 2 === 0 ? 1 : -1) * 6
      const perpAngle = angle + Math.PI / 2
      const spawnX = x + Math.cos(perpAngle) * side
      const spawnY = y + Math.sin(perpAngle) * side

      const print = document.createElement('span')
      print.className = 'tp-cursor-paw'
      print.style.left = `${spawnX}px`
      print.style.top = `${spawnY}px`
      print.style.transform = `translate(-50%, -50%) rotate(${angle.toFixed(2)}rad)`

      print.innerHTML = `
        <svg viewBox="0 0 40 40" width="14" height="14" fill="#6d391f" aria-hidden="true">
          <ellipse cx="20" cy="27" rx="9" ry="7.5" />
          <circle cx="9" cy="17" r="4" />
          <circle cx="16" cy="10" r="4" />
          <circle cx="24" cy="10" r="4" />
          <circle cx="31" cy="17" r="4" />
        </svg>
      `

      container.appendChild(print)

      setTimeout(() => {
        print.remove()
      }, 1400)
    }

    window.addEventListener('pointermove', onPointerMove, { passive: true })
    return () => window.removeEventListener('pointermove', onPointerMove)
  }, [])

  return <div ref={containerRef} className="tp-paw-trail" aria-hidden="true" />
}
