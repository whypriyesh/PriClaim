import Navbar from '../components/landing/Navbar'
import Hero from '../components/landing/Hero'
import LogoStrip from '../components/landing/LogoStrip'
import Features from '../components/landing/Features'
import HowItWorks from '../components/landing/HowItWorks'
import Pricing from '../components/landing/Pricing'
import FAQ from '../components/landing/FAQ'
import CTA from '../components/landing/CTA'
import Footer from '../components/landing/Footer'

export default function Landing() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <LogoStrip />
      <Features />
      <HowItWorks />
      <Pricing />
      <FAQ />
      <CTA />
      <Footer />
    </div>
  )
}