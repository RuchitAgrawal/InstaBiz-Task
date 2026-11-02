import { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import Lenis from 'lenis'
import Header from './components/Header'
import CurtainLoader from './components/CurtainLoader'
import PawTrail from './components/PawTrail'
import Footer from './sections/Footer'
import HomePage from './pages/HomePage'
import Puppies from './pages/Puppies'
import HappyFamilies from './pages/HappyFamilies'
import HowItWorks from './pages/HowItWorks'
import FAQ from './pages/FAQ'
import Contact from './pages/Contact'
import GoneHome from './pages/GoneHome'

export default function App() {
  useEffect(() => {
    const lenis = new Lenis({ autoRaf: true })
    window.__lenis = lenis
    return () => lenis.destroy()
  }, [])

  return (
    <>
      <CurtainLoader />
      <PawTrail />
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/puppies" element={<Puppies />} />
        <Route path="/happy-families" element={<HappyFamilies />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/gone-home" element={<GoneHome />} />
      </Routes>
      <Footer />
    </>
  )
}
