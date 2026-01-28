import { Activity, Heart, Shield, Zap, Beaker } from 'lucide-react'

export default function LogoStrip() {
  const logos = [
    { icon: Activity, name: 'MedCare' },
    { icon: Heart, name: 'HealthPlus' },
    { icon: Shield, name: 'CardioNet' },
    { icon: Zap, name: 'RapidResponse' },
    { icon: Beaker, name: 'BioLabs' },
  ]

  return (
    <section className="py-12 bg-slate-950 border-b border-white/5">
      <div className="max-w-7xl mx-auto px-6">
        <p className="text-center text-sm font-semibold text-slate-500 mb-8 uppercase tracking-wider">
          Trusted by Innovative Healthcare Providers
        </p>
        <div className="flex flex-wrap justify-center items-center gap-12 opacity-50 hover:opacity-100 transition-opacity duration-500">
          {logos.map((logo, i) => {
            const Icon = logo.icon
            return (
              <div key={i} className="flex items-center gap-2 font-bold text-xl text-white">
                <Icon className="w-6 h-6" />
                {logo.name}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}