import { Link } from 'react-router-dom'
import { Activity, ShieldCheck, Zap } from 'lucide-react'

export default function CTA() {
  return (
    <section className="py-24 relative overflow-hidden bg-slate-950">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-t from-blue-900/20 to-slate-950 pointer-events-none" />

      <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
        {/* Floating Icons */}
        <div className="mb-8">
          <div className="flex justify-center -space-x-4 mb-6">
            <div className="w-16 h-16 bg-slate-900 border border-white/10 rounded-2xl shadow-xl flex items-center justify-center transform -rotate-6 z-10">
              <Activity className="w-8 h-8 text-blue-500" />
            </div>
            <div className="w-16 h-16 bg-slate-900 border border-white/10 rounded-2xl shadow-xl flex items-center justify-center transform rotate-6 z-20">
              <Zap className="w-8 h-8 text-indigo-500" />
            </div>
            <div className="w-16 h-16 bg-slate-900 border border-white/10 rounded-2xl shadow-xl flex items-center justify-center transform -rotate-3 z-0">
              <ShieldCheck className="w-8 h-8 text-teal-500" />
            </div>
          </div>
        </div>

        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
          Ready to Take Control of Your Revenue Cycle?
        </h2>
        <p className="text-lg text-slate-400 mb-10 max-w-2xl mx-auto">
          Join hundreds of healthcare providers who are reducing denials and saving hours of administrative time.
        </p>

        <Link
          to="/login"
          className="inline-flex items-center justify-center rounded-full text-lg font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-white text-slate-950 hover:bg-slate-200 h-14 px-8 shadow-lg shadow-white/10"
        >
          Try it Free for 14 Days
        </Link>
      </div>
    </section>
  )
}