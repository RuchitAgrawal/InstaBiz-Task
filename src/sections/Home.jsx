import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Scene from '../components/Scene'
import { Stop } from '../PupJourney'
import { Photo } from '../Art'
import { brand } from '../data'
import './home.css'

export default function Home() {
  const [dog, setDog] = useState('')
  useEffect(() => {
    let live = true
    fetch('https://dog.ceo/api/breed/poodle/toy/images/random')
      .then((r) => r.json())
      .then((d) => live && d.status === 'success' && setDog(d.message))
      .catch(() => {})
    return () => { live = false }
  }, [])

  return (
    <Scene name="home" tone="dark" aria-labelledby="cta-title">
      <div className="tp-home__copy gutter">
        <h2 id="cta-title" className="font-plush text-huge">Ready to meet your new best friend?</h2>
        <p className="tp-home__lede">
          Bring home a healthy, happy teacup or designer puppy with expert guidance every step of the way. We help you find the right match and ensure a smooth, safe delivery across the UAE.
        </p>
      </div>
      <div className="tp-house">
        <span aria-hidden="true" className="tp-house__plant tp-house__plant--left" />
        <span aria-hidden="true" className="tp-house__lamp" />
        <div className="tp-house__doorway">
          <span className="tp-house__inside"><Photo src={dog} label="A puppy waiting inside" /></span>
          <span aria-hidden="true" className="tp-house__door">
            <span className="tp-house__peep" />
            <span className="tp-house__knob" />
          </span>
        </div>
        <span aria-hidden="true" className="tp-house__plant tp-house__plant--right" />
        <span aria-hidden="true" className="tp-house__mat font-scrawl">welcome home</span>
        <Stop pose="bow" facing="right" className="tp-house__teddy" />
      </div>
      <div className="tp-home__actions gutter">
        <a href={brand.waLink} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp">Enquire on WhatsApp</a>
        <Link className="btn btn-ghost tp-home__ghost" to="/contact">Visit &amp; contact</Link>
      </div>
    </Scene>
  )
}
