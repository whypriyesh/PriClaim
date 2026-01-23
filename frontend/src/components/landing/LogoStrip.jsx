export default function LogoStrip() {
  const logos = [
    { icon: 'medical_services', name: 'MedCare', color: 'text-blue-500' },
    { icon: 'local_hospital', name: 'HealthPlus', color: 'text-green-500' },
    { icon: 'monitor_heart', name: 'CardioNet', color: 'text-indigo-500' },
    { icon: 'emergency', name: 'RapidResponse', color: 'text-red-500' },
    { icon: 'science', name: 'BioLabs', color: 'text-teal-500' },
  ]

  return (
    <section className="py-12 bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-6">
        <p className="text-center text-sm font-semibold text-slate-500 mb-8 uppercase tracking-wider">
          Trusted by Innovative Healthcare Providers
        </p>
        <div className="flex flex-wrap justify-center items-center gap-12 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
          {logos.map((logo, i) => (
            <div key={i} className="flex items-center gap-2 font-bold text-xl text-slate-900">
              <span className={`material-icons-round ${logo.color}`}>{logo.icon}</span>
              {logo.name}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}