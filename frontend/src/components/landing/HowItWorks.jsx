import { Upload, Brain, FileText, CheckCircle } from 'lucide-react'

export default function HowItWorks() {
  const steps = [
    { icon: Upload, title: '1. Upload Claims', desc: 'Drag & drop PDFs or integrate directly with your EHR system via API.', color: 'text-blue-400' },
    { icon: Brain, title: '2. AI Analysis', desc: 'Our NLP engine extracts data and compares it against payer policies.', color: 'text-indigo-400' },
    { icon: FileText, title: '3. Risk Report', desc: 'Receive a detailed audit report flagging high-risk items for review.', color: 'text-purple-400' },
    { icon: CheckCircle, title: '4. Optimized Submit', desc: 'Submit clean claims with confidence and watch denial rates drop.', color: 'text-emerald-400' },
  ]

  return (
    <section id="how-it-works" className="py-24 bg-transparent overflow-hidden border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-blue-400 font-semibold uppercase tracking-wider text-sm">Workflow</span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mt-2">
            From PDF to Audited in Seconds
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {/* Connecting Line */}
          <div className="hidden lg:block absolute top-12 left-0 w-full h-px bg-white/10 -z-10" />

          {steps.map((step, i) => {
            const Icon = step.icon
            return (
              <div key={i} className="relative text-center group">
                <div className="bg-slate-900 w-24 h-24 mx-auto rounded-full border-4 border-slate-950 shadow-xl flex items-center justify-center mb-6 z-10 relative group-hover:scale-110 transition-transform duration-300">
                  <Icon className={`w-10 h-10 ${step.color}`} />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{step.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{step.desc}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}