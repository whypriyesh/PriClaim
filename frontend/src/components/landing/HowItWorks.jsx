export default function HowItWorks() {
  const steps = [
    { icon: 'upload_file', title: '1. Upload Claims', desc: 'Drag & drop PDFs or integrate directly with your EHR system via API.', color: 'text-blue-500' },
    { icon: 'psychology', title: '2. AI Analysis', desc: 'Our NLP engine extracts data and compares it against payer policies.', color: 'text-indigo-500' },
    { icon: 'assessment', title: '3. Risk Report', desc: 'Receive a detailed audit report flagging high-risk items for review.', color: 'text-purple-500' },
    { icon: 'check_circle', title: '4. Optimized Submit', desc: 'Submit clean claims with confidence and watch denial rates drop.', color: 'text-green-500' },
  ]

  return (
    <section id="how-it-works" className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-primary font-semibold uppercase tracking-wider text-sm">Workflow</span>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mt-2">
            From PDF to Audited in Seconds
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {/* Connecting Line */}
          <div className="hidden lg:block absolute top-12 left-0 w-full h-0.5 bg-slate-100 -z-10" />

          {steps.map((step, i) => (
            <div key={i} className="relative text-center">
              <div className="bg-white w-24 h-24 mx-auto rounded-full border-4 border-white shadow-lg flex items-center justify-center mb-6 z-10 relative">
                <span className={`material-icons-round text-4xl ${step.color}`}>{step.icon}</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">{step.title}</h3>
              <p className="text-sm text-slate-500">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}