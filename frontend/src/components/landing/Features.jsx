import { FeatureCard } from '../ui/Card'

export default function Features() {
  const features = [
    {
      icon: 'psychology',
      title: 'AI Policy Matching',
      description: 'Automatically cross-reference claims against thousands of payer policy documents instantly.',
      iconBg: 'bg-blue-50',
      iconColor: 'text-blue-600',
    },
    {
      icon: 'speed',
      title: 'Real-time Risk Scoring',
      description: 'Get immediate risk assessments with color-coded indicators for every single claim line item.',
      iconBg: 'bg-indigo-50',
      iconColor: 'text-indigo-600',
    },
    {
      icon: 'verified_user',
      title: 'Automated Compliance',
      description: 'Stay compliant with ever-changing regulations without manual intervention or oversight.',
      iconBg: 'bg-teal-50',
      iconColor: 'text-teal-600',
    },
    {
      icon: 'trending_up',
      title: 'Loss Prevention',
      description: 'Identify patterns that lead to denials and correct them upstream to maximize revenue capture.',
      iconBg: 'bg-amber-50',
      iconColor: 'text-amber-600',
    },
  ]

  return (
    <section id="features" className="py-24 bg-slate-50 relative">
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-white to-transparent" />
      
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Everything You Need for Total Audit Control
          </h2>
          <p className="text-slate-600 text-lg">
            Our AI engine works tirelessly to protect your revenue, flagging inconsistencies before they become denials.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, i) => (
            <FeatureCard key={i} {...feature} />
          ))}
        </div>
      </div>
    </section>
  )
}