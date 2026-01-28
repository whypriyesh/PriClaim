import { Brain, Zap, ShieldCheck, TrendingUp } from 'lucide-react'
import { StaggerContainer, StaggerItem } from '../ui/motion-wrapper'

export default function Features() {
  const features = [
    {
      icon: Brain,
      title: 'AI Policy Matching',
      description: 'Automatically cross-reference claims against thousands of payer policy documents instantly.',
      color: 'text-blue-400',
    },
    {
      icon: Zap,
      title: 'Real-time Risk Scoring',
      description: 'Get immediate risk assessments with color-coded indicators for every single claim line item.',
      color: 'text-amber-400',
    },
    {
      icon: ShieldCheck,
      title: 'Automated Compliance',
      description: 'Stay compliant with ever-changing regulations without manual intervention or oversight.',
      color: 'text-emerald-400',
    },
    {
      icon: TrendingUp,
      title: 'Loss Prevention',
      description: 'Identify patterns that lead to denials and correct them upstream to maximize revenue capture.',
      color: 'text-indigo-400',
    },
  ]

  return (
    <section id="features" className="py-24 bg-transparent relative">


      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Everything You Need for Total Audit Control
          </h2>
          <p className="text-slate-400 text-lg">
            Our AI engine works tirelessly to protect your revenue, flagging inconsistencies before they become denials.
          </p>
        </div>

        <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, i) => {
            const Icon = feature.icon
            return (
              <StaggerItem key={i} className="bg-white/5 border border-white/5 p-6 rounded-2xl hover:bg-white/10 hover:border-blue-500/30 hover:shadow-[0_0_30px_-5px_rgba(59,130,246,0.15)] transition-all duration-300 group">
                <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-blue-500/20 transition-all duration-300">
                  <Icon className={`w-6 h-6 ${feature.color} group-hover:text-white transition-colors`} />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-slate-400 leading-relaxed text-sm group-hover:text-slate-300 transition-colors">
                  {feature.description}
                </p>
              </StaggerItem>
            )
          })}
        </StaggerContainer>
      </div>
    </section>
  )
}