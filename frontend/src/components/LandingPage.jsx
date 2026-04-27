import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Home, Users, IndianRupee, Monitor, CheckSquare,
  Wheat, ArrowRight, Phone, Mail
} from 'lucide-react'
import InstallButton from './IntallButton'

const FEATURES = [
  {
    icon: Users,
    color: 'bg-success/15 border-success/25',
    iconColor: 'text-success',
    title: 'Farmer registry',
    desc: 'Register and manage all farmers with their contact and address details.',
    image: '/4.jpeg'
  },
  {
    icon: IndianRupee,
    color: 'bg-warning/15 border-warning/25',
    iconColor: 'text-warning',
    title: 'Deal management',
    desc: 'Log deals with weight, rate, bags and auto-calculate totals instantly.',
    image: '/5.jpeg'
  },
  {
    icon: Monitor,
    color: 'bg-info/15 border-info/25',
    iconColor: 'text-info',
    title: 'Admin dashboard',
    desc: 'Monitor all trades, payments and farmers from a single control panel.',
    image: '/3.jpeg'
  },
  {
    icon: CheckSquare,
    color: 'bg-teal/15 border-teal/25',
    iconColor: 'text-teal-600',
    title: 'Payment tracking',
    desc: 'Track pending and paid status on every deal — no missed payments.',
    image: '/4.jpeg'
  },
]

const STEPS = [
  { n: '1', title: 'Register farmer', desc: "Add farmer's name, mobile and address to the registry." },
  { n: '2', title: 'Create deal', desc: 'Select farmer, add product, weight and rate for the deal.' },
  { n: '3', title: 'Review total', desc: 'System auto-calculates estimated total from weight × rate.' },
  { n: '4', title: 'Settle payment', desc: 'Mark the deal as paid once settlement is complete.' },
]

const MATERIALS = [
  { name: 'Haldi', desc: 'Corn / Maize', color: 'bg-warning/10 border-warning/20', icon: 'text-warning', image: '/4.jpeg' },
  { name: 'Makka', desc: 'Wheat', color: 'bg-success/10 border-success/20', icon: 'text-success', image: '/5.jpeg' },
  { name: 'Dhan', desc: 'Paddy / Rice', color: 'bg-teal-50 border-teal-200', icon: 'text-teal-600', image: '/1.jpeg' },
  { name: 'Gehu', desc: 'Turmeric', color: 'bg-warning/10 border-warning/20', icon: 'text-amber-600', image: '/gehu.webp' },
]

const HERO_IMAGES = ['/1.jpeg', '/2.jpeg', '/3.jpeg']

const LandingPage = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % HERO_IMAGES.length)
    }, 5000) // Change image every 5 seconds

    return () => clearInterval(interval)
  }, [])
  return (
    <div className="min-h-screen bg-base-100">

      {/* ── Navbar ── */}
      <nav className="flex items-center justify-between px-4 py-3.5 border-b border-base-300 bg-base-100 sticky top-0 z-50">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-success/15 border border-success/25 flex items-center justify-center">
            <Home size={18} className="text-success" />
          </div>
          <div className="leading-tight">
            <p className="text-sm font-semibold">AgroTrade</p>
            <p className="text-xs text-base-content/50">Farmer Trading System</p>
          </div>
        </div>
        <InstallButton />

        <Link to="/login" className="btn  btn-success">
           Login
          </Link>
      </nav>

      {/* Hero */}
      <section className="relative min-h-[600px] flex items-center justify-center overflow-hidden">
        {/* Background Image Slider */}
        <div className="absolute inset-0">
          {HERO_IMAGES.map((image, index) => (
            <div
              key={image}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                index === currentImageIndex ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <img
                src={image}
                alt={`Hero image ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/50"></div>
            </div>
          ))}
        </div>

        {/* Content */}
        <div className="relative z-10 text-center px-6 py-20">
         

          <h1 className="text-4xl md:text-6xl font-bold text-white max-w-2xl mx-auto leading-tight mb-6">
            Welcome to Fulchand Mandal Malpur
          </h1>
        
          <p className="text-base text-white/80 max-w-md mx-auto mb-10 leading-relaxed">
            Manage deals, track payments, and grow your agricultural business - all in one clean, easy-to-use portal.
          </p>

          <div className="flex items-center justify-center gap-4 mb-16">
           
            <button className="btn btn-outline bg-white lg:btn-lg btn-sm text-sm shadow-lg">
              <Mail size={16} />
              rkm913597@gmail.com
            </button>
          </div>

         

          {/* Image Indicators */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2">
            {HERO_IMAGES.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentImageIndex 
                    ? 'bg-white w-8' 
                    : 'bg-white/50 hover:bg-white/70'
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="py-16 px-6 bg-base-100">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-2 text-xs font-semibold text-success uppercase tracking-widest mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-success" /> Features
          </div>
          <h2 className="text-2xl font-bold mb-2">Everything you need to run your trading operation</h2>
          <p className="text-sm text-base-content/50 mb-8">From registering farmers to settling payments — AgroTrade handles it all.</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {FEATURES.map(({ icon: Icon, color, iconColor, title, desc, image }) => (
              <div key={title} className="border border-base-300 rounded-2xl overflow-hidden hover:border-success/30 transition-all duration-300 group">
                {image && (
                  <div className="h-32 overflow-hidden">
                    <img
                      src={image}
                      alt={title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                )}
                <div className="p-5">
                  <div className={`w-10 h-10 rounded-xl border flex items-center justify-center mb-3 ${color}`}>
                    <Icon size={18} className={iconColor} />
                  </div>
                  <p className="font-semibold text-sm mb-1">{title}</p>
                  <p className="text-xs text-base-content/50 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section id="how" className="py-16 px-6 bg-base-200 border-y border-base-300">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-2 text-xs font-semibold text-success uppercase tracking-widest mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-success" /> How it works
          </div>
          <h2 className="text-2xl font-bold mb-2">Up and running in minutes</h2>
          <p className="text-sm text-base-content/50 mb-8">Four simple steps from registration to payment.</p>

          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-base-300 border border-base-300 rounded-2xl bg-base-100 overflow-hidden">
            {STEPS.map(({ n, title, desc }) => (
              <div key={n} className="p-5 text-center">
                <div className="w-9 h-9 rounded-full bg-success/15 border border-success/25 text-success font-semibold text-sm flex items-center justify-center mx-auto mb-3">
                  {n}
                </div>
                <p className="text-xs font-semibold mb-1">{title}</p>
                <p className="text-xs text-base-content/50 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Materials ── */}
      <section id="materials" className="py-16 px-6 bg-base-100">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-2 text-xs font-semibold text-success uppercase tracking-widest mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-success" /> Materials
          </div>
          <h2 className="text-2xl font-bold mb-2">Supported agricultural products</h2>
          <p className="text-sm text-base-content/50 mb-8">Trade the most common crops with built-in material categories.</p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {MATERIALS.map(({ name, desc, color, icon, image }) => (
              <div key={name} className="border border-base-300 rounded-2xl overflow-hidden text-center hover:border-success/30 transition-all duration-300 group">
                {image ? (
                  <div className="h-24 overflow-hidden">
                    <img
                      src={image}
                      alt={name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                ) : (
                  <div className="p-4">
                    <div className={`w-12 h-12 rounded-full border flex items-center justify-center mx-auto mb-3 ${color}`}>
                      <Wheat size={20} className={icon} />
                    </div>
                  </div>
                )}
                <div className="p-3">
                  <p className="text-sm font-semibold">{name}</p>
                  <p className="text-xs text-base-content/50 mt-1">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-success/10 border-y border-success/20 py-16 px-6 text-center">
        <h2 className="text-2xl font-bold text-success-content mb-3">
          Ready to manage your trades smarter?
        </h2>
        <p className="text-sm text-base-content/60 max-w-sm mx-auto mb-8 leading-relaxed">
          Join hundreds of traders already using AgroTrade to simplify their agricultural business.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link to="/login" className="btn btn-success">
            Go to admin portal
            <ArrowRight size={15} />
          </Link>
          <a href="#features" className="btn btn-outline btn-success">Learn more</a>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="flex items-center justify-center px-6 py-4 border-t border-base-300">
        <p>© 2026 AgroTrade · RamKrishna Kumar</p>
      </footer>

    </div>
  )
}

export default LandingPage