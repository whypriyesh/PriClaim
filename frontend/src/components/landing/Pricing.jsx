import { Link } from 'react-router-dom'
import { Check, CheckCircle } from 'lucide-react'

export default function Pricing() {
    const plans = [
        {
            name: 'Starter',
            subtitle: 'For small clinics',
            price: '$499',
            features: ['Up to 500 Claims/mo', 'Basic Policy Matching', 'PDF Upload Only', 'Email Support'],
            featured: false,
        },
        {
            name: 'Pro',
            subtitle: 'For growing hospitals',
            price: '$1,299',
            features: ['Up to 5,000 Claims/mo', 'Advanced AI Risk Scoring', 'EHR Integration (API)', 'Priority Support', 'Custom Audit Rules'],
            featured: true,
        },
        {
            name: 'Enterprise',
            subtitle: 'For large networks',
            price: 'Custom',
            features: ['Unlimited Claims', 'Dedicated Account Manager', 'On-Premise Deployment', '24/7 SLA Support', 'Custom AI Model Training'],
            featured: false,
        },
    ]

    return (
        <section id="pricing" className="py-24 bg-transparent">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Transparent Pricing</h2>
                    <p className="text-slate-400">Scale your audits as your facility grows. No hidden fees.</p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {plans.map((plan, i) => (
                        <div
                            key={i}
                            className={`rounded-3xl p-8 transition-all relative
                ${plan.featured
                                    ? 'bg-white/10 border border-white/20 shadow-2xl shadow-indigo-500/10 transform scale-105 z-10'
                                    : 'bg-white/5 border border-white/5 hover:bg-white/10'
                                }`}
                        >
                            {plan.featured && (
                                <div className="absolute top-0 right-0 bg-white text-slate-900 text-xs font-bold px-3 py-1 rounded-bl-xl rounded-tr-2xl">
                                    POPULAR
                                </div>
                            )}

                            <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                            <p className="text-sm text-slate-400 mb-6">{plan.subtitle}</p>

                            <div className="flex items-baseline mb-6">
                                <span className="text-4xl font-bold text-white">{plan.price}</span>
                                {plan.price !== 'Custom' && <span className="text-slate-500 ml-2">/mo</span>}
                            </div>

                            <Link
                                to="/login"
                                className={`w-full mb-8 py-3 rounded-xl font-semibold flex items-center justify-center transition-colors ${plan.featured
                                    ? 'bg-white text-slate-950 hover:bg-slate-200'
                                    : 'bg-white/10 text-white hover:bg-white/20'
                                    }`}
                            >
                                {plan.price === 'Custom' ? 'Contact Sales' : 'Get Started'}
                            </Link>

                            <ul className="space-y-4 text-sm text-slate-300">
                                {plan.features.map((feature, j) => (
                                    <li key={j} className="flex items-center gap-3">
                                        <CheckCircle className={`w-5 h-5 ${plan.featured ? 'text-white' : 'text-slate-500'}`} />
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}