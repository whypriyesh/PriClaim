import { Button } from '../ui/button'

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
        <section id="pricing" className="py-24 bg-gradient-to-b from-slate-50 to-white">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Transparent Pricing</h2>
                    <p className="text-slate-600">Scale your audits as your facility grows. No hidden fees.</p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {plans.map((plan, i) => (
                        <div
                            key={i}
                            className={`bg-white rounded-3xl p-8 transition-shadow relative
                ${plan.featured
                                    ? 'shadow-xl border-2 border-primary transform scale-105 z-10'
                                    : 'shadow-sm hover:shadow-xl border border-slate-100'
                                }`}
                        >
                            {plan.featured && (
                                <div className="absolute top-0 right-0 bg-primary text-white text-xs font-bold px-3 py-1 rounded-bl-xl rounded-tr-2xl">
                                    POPULAR
                                </div>
                            )}

                            <h3 className="text-xl font-bold text-slate-900 mb-2">{plan.name}</h3>
                            <p className="text-sm text-slate-500 mb-6">{plan.subtitle}</p>

                            <div className="flex items-baseline mb-6">
                                <span className="text-4xl font-bold text-slate-900">{plan.price}</span>
                                {plan.price !== 'Custom' && <span className="text-slate-500 ml-2">/mo</span>}
                            </div>

                            <Button
                                to="/login"
                                variant={plan.featured ? 'primary' : 'ghost'}
                                className="w-full mb-8"
                            >
                                {plan.price === 'Custom' ? 'Contact Sales' : 'Get Started'}
                            </Button>

                            <ul className="space-y-4 text-sm text-slate-600">
                                {plan.features.map((feature, j) => (
                                    <li key={j} className="flex items-center gap-3">
                                        <span className={`material-icons-round text-base ${plan.featured ? 'text-primary' : 'text-green-500'}`}>
                                            check_circle
                                        </span>
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