import { Button } from '../ui/button'

export default function CTA() {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-t from-blue-100 to-white" />
      
      <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
        {/* Floating Icons */}
        <div className="mb-8">
          <div className="flex justify-center -space-x-4 mb-6">
            <div className="w-16 h-16 bg-white rounded-2xl shadow-lg flex items-center justify-center transform -rotate-6 z-10">
              <span className="material-icons-round text-3xl text-blue-500">health_and_safety</span>
            </div>
            <div className="w-16 h-16 bg-white rounded-2xl shadow-lg flex items-center justify-center transform rotate-6 z-20">
              <span className="material-icons-round text-3xl text-indigo-500">analytics</span>
            </div>
            <div className="w-16 h-16 bg-white rounded-2xl shadow-lg flex items-center justify-center transform -rotate-3 z-0">
              <span className="material-icons-round text-3xl text-teal-500">verified</span>
            </div>
          </div>
        </div>

        <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6">
          Ready to Take Control of Your Revenue Cycle?
        </h2>
        <p className="text-lg text-slate-600 mb-10 max-w-2xl mx-auto">
          Join hundreds of healthcare providers who are reducing denials and saving hours of administrative time.
        </p>
        
        <Button to="/login" size="lg">Try it Free for 14 Days</Button>
      </div>
    </section>
  )
}