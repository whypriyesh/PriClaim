import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

export default function FAQ() {
  const faqs = [
    {
      question: 'Is PriClaim HIPAA Compliant?',
      answer: 'Yes, absolutely. PriClaim is SOC2 Type II certified and fully HIPAA compliant. All data is encrypted at rest and in transit, ensuring maximum security for PHI.',
    },
    {
      question: 'Does it integrate with Epic or Cerner?',
      answer: 'Yes, our Pro and Enterprise plans offer seamless API integration with major EHR platforms including Epic, Cerner, Allscripts, and MEDITECH.',
    },
    {
      question: 'How accurate is the AI audit?',
      answer: 'Our AI models are trained on millions of historical claims and achieve a 99.9% accuracy rate in flagging potential policy violations and coding errors.',
    },
    {
      question: 'Can I customize the audit rules?',
      answer: 'Yes, Pro and Enterprise users can define custom rule sets specific to their hospital\'s internal guidelines or specific payer contracts.',
    },
  ]

  return (
    <section id="faq" className="py-24 bg-slate-950 border-t border-white/5">
      <div className="max-w-3xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-center text-white mb-12">
          Frequently Asked Questions
        </h2>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <FAQItem key={i} question={faq.question} answer={faq.answer} />
          ))}
        </div>
      </div>
    </section>
  )
}

function FAQItem({ question, answer }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div
      className={`rounded-2xl p-6 transition-all duration-300 cursor-pointer border border-transparent
        ${isOpen ? 'bg-white/10 border-white/10' : 'bg-white/5 hover:bg-white/[0.07] hover:border-white/5'}`}
      onClick={() => setIsOpen(!isOpen)}
    >
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-white">{question}</h3>
        <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </div>

      <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-40 mt-4' : 'max-h-0'}`}>
        <p className="text-slate-400 leading-relaxed">{answer}</p>
      </div>
    </div>
  )
}