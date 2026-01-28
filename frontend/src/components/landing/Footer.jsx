import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-transparent pt-16 pb-8 border-t border-white/10 relative z-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 mb-16">
          {/* Brand */}
          <div className="col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4 group">
              <div className="w-6 h-6 bg-white rounded flex items-center justify-center text-slate-950 font-bold text-sm group-hover:bg-slate-200 transition-colors">P</div>
              <span className="text-xl font-bold text-white">PriClaim</span>
            </Link>
            <p className="text-sm text-slate-400 mb-6 max-w-xs">
              AI-powered medical claim auditing for the modern healthcare facility. Secure, fast, and accurate.
            </p>

            {/* Newsletter */}
            <div className="bg-white/5 border border-white/5 p-4 rounded-xl inline-block">
              <p className="text-xs font-semibold text-white mb-2">Join Our Newsletter</p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Enter Email"
                  className="bg-transparent border border-white/10 text-xs rounded-lg px-3 py-2 w-40 focus:outline-none focus:border-white/30 text-white placeholder-slate-600 transition-colors"
                />
                <button className="bg-white text-slate-950 text-xs px-3 py-2 rounded-lg font-bold hover:bg-slate-200 transition-colors">
                  Join
                </button>
              </div>
            </div>
          </div>

          {/* Links */}
          <FooterColumn title="Company" links={['About', 'Careers', 'Blog', 'Contact']} />
          <FooterColumn title="Product" links={['Features', 'Pricing', 'Integrations', 'API Docs']} />
          <FooterColumn title="Legal" links={['Privacy Policy', 'Terms of Service', 'Security', 'HIPAA']} />
          <FooterColumn title="Social" links={['LinkedIn', 'Twitter', 'Facebook']} />
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500">
          <p>© 2026 PriClaim Inc. All rights reserved.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <a href="#" className="hover:text-slate-300 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-slate-300 transition-colors">Terms & Conditions</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

function FooterColumn({ title, links }) {
  return (
    <div>
      <h4 className="font-bold text-white mb-4">{title}</h4>
      <ul className="space-y-2 text-sm text-slate-500">
        {links.map((link, i) => (
          <li key={i}>
            <a href="#" className="hover:text-white transition-colors">{link}</a>
          </li>
        ))}
      </ul>
    </div>
  )
}