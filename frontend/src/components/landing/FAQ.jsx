import { useState } from 'react'

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
    <section id="faq" className="py-24 bg-white">
      <div className="max-w-3xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-center text-slate-900 mb-12">
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
      className={`rounded-2xl p-6 shadow-sm transition-all duration-300 cursor-pointer
        ${isOpen ? 'bg-white shadow-md' : 'bg-slate-50 hover:bg-slate-100'}`}
      onClick={() => setIsOpen(!isOpen)}
    >
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-slate-900">{question}</h3>
        <span className={`material-icons-round transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
          expand_more
        </span>
      </div>
      
      <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-40 mt-4' : 'max-h-0'}`}>
        <p className="text-slate-600 leading-relaxed">{answer}</p>
      </div>
    </div>
  )
}