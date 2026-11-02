import PupJourney from '../PupJourney'
import Hero from '../sections/Hero'
import Meet from '../sections/Meet'
import Paths from '../sections/Paths'
import Journey from '../sections/Journey'
import Passport from '../sections/Passport'
import Dusk from '../sections/Dusk'
import Night from '../sections/Night'
import Home from '../sections/Home'

export default function HomePage() {
  return (
    <main id="main">
      <div className="tp-page" data-page="home">
        <Hero />
        <Meet />
        <Paths />
        <Journey />
        <Passport />
        <Dusk />
        <Night />
        <Home />
      </div>
      <PupJourney />
    </main>
  )
}
