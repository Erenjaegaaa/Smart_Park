import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Camera, Zap, Shield, BarChart3, Car, Clock, Github, Twitter } from 'lucide-react'

// Animation variants
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08
    }
  }
}

// Noise texture SVG filter
function NoiseOverlay() {
  return (
    <svg className="fixed inset-0 w-full h-full pointer-events-none z-50 opacity-[0.015]">
      <filter id="noise">
        <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" stitchTiles="stitch" />
      </filter>
      <rect width="100%" height="100%" filter="url(#noise)" />
    </svg>
  )
}

// Navbar Component
function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-40 h-16 bg-[#0A0A0A] border-b border-[#262626]">
      <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <span className="w-2 h-2 bg-[#FF3D00]" />
          <span className="font-inter-tight font-bold text-[#FAFAFA] text-lg">SmartPark</span>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-8">
          {['Dashboard', 'Features', 'How It Works'].map((link) => (
            <Link
              key={link}
              to={`#${link.toLowerCase().replace(/\s/g, '-')}`}
              className="font-jetbrains text-[13px] uppercase tracking-wider text-[#FAFAFA] hover:underline underline-offset-4 transition-all"
            >
              {link}
            </Link>
          ))}
        </div>

        {/* Desktop CTA Buttons */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            to="/login"
            className="font-jetbrains text-[13px] uppercase tracking-wider text-[#FAFAFA] hover:underline underline-offset-4"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="font-jetbrains text-[13px] uppercase tracking-wider text-[#FAFAFA] border border-[#FAFAFA] px-4 py-2 hover:bg-[#FAFAFA] hover:text-[#0A0A0A] transition-colors"
          >
            Get Started
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden text-[#FAFAFA] p-2"
        >
          <div className="w-6 h-0.5 bg-[#FAFAFA] mb-1.5" />
          <div className="w-6 h-0.5 bg-[#FAFAFA] mb-1.5" />
          <div className="w-6 h-0.5 bg-[#FAFAFA]" />
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0A0A0A] border-b border-[#262626] px-6 py-4">
          {['Dashboard', 'Features', 'How It Works'].map((link) => (
            <Link
              key={link}
              to={`#${link.toLowerCase().replace(/\s/g, '-')}`}
              className="block font-jetbrains text-[13px] uppercase tracking-wider text-[#FAFAFA] py-2 hover:underline"
            >
              {link}
            </Link>
          ))}
          <div className="flex flex-col gap-2 mt-4">
            <Link to="/login" className="font-jetbrains text-[13px] uppercase tracking-wider text-[#FAFAFA]">
              Login
            </Link>
            <Link
              to="/register"
              className="font-jetbrains text-[13px] uppercase tracking-wider text-[#FAFAFA] border border-[#FAFAFA] px-4 py-2 text-center"
            >
              Get Started
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}

// Hero Section
function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden" style={{ background: 'radial-gradient(ellipse at center, #1a0a00 0%, #0A0A0A 70%)' }}>
      {/* Decorative Background Text */}
      <div className="absolute inset-0 hidden lg:flex items-center justify-center pointer-events-none overflow-hidden">
        <span className="font-inter-tight font-black text-[20vw] text-[#1A1A1A] opacity-15 select-none">
          PARK
        </span>
      </div>

      <motion.div
        className="relative z-10 max-w-7xl mx-auto px-6 py-24"
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
      >
        {/* Top Label */}
        <motion.span
          variants={fadeUp}
          transition={{ duration: 0.5 }}
          className="font-jetbrains text-[12px] uppercase tracking-widest text-[#FF3D00] mb-6 block"
        >
          AI-Powered Parking
        </motion.span>

        {/* Main Headline */}
        <motion.h1
          variants={fadeUp}
          transition={{ duration: 0.5 }}
          className="font-inter-tight font-extrabold text-6xl md:text-7xl lg:text-8xl text-[#FAFAFA] leading-[1.05] tracking-[-0.04em] mb-8"
        >
          Find Your
          <br />
          Spot.
          <br />
          <span className="text-[#FF3D00]">Instantly.</span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          variants={fadeUp}
          transition={{ duration: 0.5 }}
          className="font-inter text-lg text-[#737373] max-w-lg mb-10"
        >
          Real-time AI camera detection. Zero guessing. Book your parking slot before you leave home.
        </motion.p>

        {/* CTAs */}
        <motion.div
          variants={fadeUp}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <Link
            to="/dashboard"
            className="group font-inter text-[#FF3D00] text-lg inline-flex items-center gap-2"
          >
            <span className="relative">
              Book a Slot
              <span className="absolute bottom-0 left-0 w-0 h-px bg-[#FF3D00] group-hover:w-full transition-all duration-300" />
            </span>
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>
          <Link
            to="#how-it-works"
            className="font-inter text-[#FAFAFA] text-lg border border-[#FAFAFA] px-6 py-3 text-center hover:bg-[#FAFAFA] hover:text-[#0A0A0A] transition-colors"
          >
            See How It Works
          </Link>
        </motion.div>
      </motion.div>
    </section>
  )
}

// Stats Bar
function StatsBar() {
  const stats = [
    { value: '10+', label: 'Lots Available' },
    { value: '< 10s', label: 'Update' },
    { value: '₹50', label: '/ Booking' },
    { value: '100%', label: 'Uptime' }
  ]

  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={staggerContainer}
      className="bg-[#0F0F0F] border-y border-[#262626] py-8"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, idx) => (
            <motion.div
              key={stat.label}
              variants={fadeUp}
              transition={{ duration: 0.5 }}
              className={`text-center ${idx !== stats.length - 1 ? 'md:border-r md:border-[#262626]' : ''}`}
            >
              <div className="font-inter-tight font-bold text-3xl text-[#FAFAFA]">{stat.value}</div>
              <div className="font-jetbrains text-xs uppercase tracking-wider text-[#737373] mt-1">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  )
}

// Features Section
function FeaturesSection() {
  const features = [
    { icon: Camera, title: 'Live Slot Detection', description: 'AI cameras detect available slots in real-time with 99.9% accuracy.' },
    { icon: Zap, title: 'Instant Booking', description: 'Reserve your spot in seconds, from anywhere in the city.' },
    { icon: Shield, title: 'Secure Payments', description: 'End-to-end encrypted transactions with multiple payment options.' },
    { icon: BarChart3, title: 'Real-time Updates', description: 'Live availability data pushed to your device every 10 seconds.' },
    { icon: Car, title: 'Vehicle Tracking', description: 'Know exactly where your car is parked with GPS precision.' },
    { icon: Clock, title: '24/7 Access', description: 'Park anytime, day or night. Our lots never close.' }
  ]

  return (
    <section className="bg-[#0A0A0A] py-24">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={staggerContainer}
        className="max-w-7xl mx-auto px-6"
      >
        <motion.span
          variants={fadeUp}
          transition={{ duration: 0.5 }}
          className="font-jetbrains text-[12px] uppercase tracking-widest text-[#FF3D00] mb-4 block"
        >
          What We Do
        </motion.span>
        <motion.h2
          variants={fadeUp}
          transition={{ duration: 0.5 }}
          className="font-inter-tight font-extrabold text-5xl lg:text-6xl text-[#FAFAFA] tracking-tight mb-16"
        >
          Parking, Solved.
        </motion.h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={fadeUp}
              transition={{ duration: 0.5 }}
              className="border border-[#262626] p-8 hover:border-[#3d3d3d] transition-colors group"
            >
              <feature.icon className="w-6 h-6 text-[#FF3D00] stroke-[1.5] mb-4" />
              <h3 className="font-inter-tight font-semibold text-xl text-[#FAFAFA] mb-2">{feature.title}</h3>
              <p className="font-inter text-base text-[#737373]">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}

// How It Works Section
function HowItWorksSection() {
  const steps = [
    { number: '01', title: 'Arrive & Scan', description: 'AI cameras detect your slot in real-time' },
    { number: '02', title: 'Book Online', description: 'Reserve your slot from anywhere before you drive' },
    { number: '03', title: 'Park & Pay', description: 'Pull in, park, pay ₹50. Done.' }
  ]

  return (
    <section id="how-it-works" className="bg-[#0F0F0F] border-y border-[#262626] py-24">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={staggerContainer}
        className="max-w-7xl mx-auto px-6"
      >
        <motion.span
          variants={fadeUp}
          transition={{ duration: 0.5 }}
          className="font-jetbrains text-[12px] uppercase tracking-widest text-[#FF3D00] mb-4 block"
        >
          The Process
        </motion.span>
        <motion.h2
          variants={fadeUp}
          transition={{ duration: 0.5 }}
          className="font-inter-tight font-extrabold text-5xl text-[#FAFAFA] tracking-tight mb-16"
        >
          Three Steps to Parked.
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {steps.map((step) => (
            <motion.div
              key={step.number}
              variants={fadeUp}
              transition={{ duration: 0.5 }}
              className="group"
            >
              <span className="font-jetbrains text-6xl text-[#262626] group-hover:text-[#FF3D00] transition-colors duration-150">
                {step.number}
              </span>
              <div className="h-px w-12 bg-[#FF3D00] my-4" />
              <h3 className="font-inter-tight font-semibold text-2xl text-[#FAFAFA] mb-2">{step.title}</h3>
              <p className="font-inter text-[#737373]">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}

// CTA Section
function CTASection() {
  return (
    <section className="bg-[#FF3D00] py-32">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={staggerContainer}
        className="max-w-7xl mx-auto px-6 text-center"
      >
        <motion.h2
          variants={fadeUp}
          transition={{ duration: 0.5 }}
          className="font-inter-tight font-black text-6xl lg:text-7xl text-[#0A0A0A] tracking-tight mb-4"
        >
          Your Spot is Waiting.
        </motion.h2>
        <motion.p
          variants={fadeUp}
          transition={{ duration: 0.5 }}
          className="font-inter text-lg text-[#0A0A0A]/70 mb-10 max-w-xl mx-auto"
        >
          Join SmartPark. No waiting. No circling. Just park.
        </motion.p>
        <motion.div
          variants={fadeUp}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link
            to="/register"
            className="font-inter text-[#0A0A0A] text-lg border border-[#0A0A0A] px-8 py-3 hover:bg-[#0A0A0A] hover:text-[#FF3D00] transition-colors"
          >
            Join Us
          </Link>
          <Link
            to="/login"
            className="font-inter text-[#0A0A0A] text-lg px-8 py-3 underline underline-offset-4 hover:opacity-70 transition-opacity"
          >
            Login
          </Link>
        </motion.div>
      </motion.div>
    </section>
  )
}

// Footer
function Footer() {
  return (
    <footer className="bg-[#0A0A0A] border-t border-[#262626]">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 bg-[#FF3D00]" />
              <span className="font-inter-tight font-bold text-xl text-[#FAFAFA]">SmartPark</span>
            </div>
            <p className="font-inter text-sm text-[#737373] mb-4">Intelligent parking for modern cities</p>
            <p className="font-jetbrains text-xs text-[#737373]">Built with AI camera detection</p>
          </div>

          <div className="flex flex-col md:items-end gap-4">
            <div className="flex flex-wrap gap-6">
              {[
                { label: 'Features', to: '#features' },
                { label: 'How It Works', to: '#how-it-works' },
                { label: 'Login', to: '/login' },
                { label: 'Register', to: '/register' },
              ].map((link) => (
                <Link
                  key={link.label}
                  to={link.to}
                  className="font-jetbrains text-[13px] uppercase tracking-wider text-[#FAFAFA] hover:underline underline-offset-4"
                >
                  {link.label}
                </Link>
              ))}
            </div>
            <div className="flex gap-4">
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-[#FAFAFA] hover:text-[#FF3D00] transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-[#FAFAFA] hover:text-[#FF3D00] transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-[#262626] py-6">
        <p className="font-jetbrains text-xs text-[#737373] text-center">
          © 2025 SmartPark. All rights reserved.
        </p>
      </div>
    </footer>
  )
}

// Main Export
export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#FAFAFA]">
      <NoiseOverlay />
      <Navbar />
      <main>
        <HeroSection />
        <StatsBar />
        <FeaturesSection />
        <HowItWorksSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  )
}