import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-white pt-16 pb-8 border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 mb-16">
          {/* Brand */}
          <div className="col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 bg-primary rounded flex items-center justify-center text-white font-bold text-sm">P</div>
              <span className="text-xl font-bold text-slate-900">PriClaim</span>
            </Link>
            <p className="text-sm text-slate-500 mb-6 max-w-xs">
              AI-powered medical claim auditing for the modern healthcare facility. Secure, fast, and accurate.
            </p>
            
            {/* Newsletter */}
            <div className="bg-slate-50 p-4 rounded-xl inline-block">
              <p className="text-xs font-semibold text-slate-900 mb-2">Join Our Newsletter</p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Enter Email"
                  className="bg-white border-none text-xs rounded-lg px-3 py-2 w-40 focus:ring-1 focus:ring-primary text-slate-900 placeholder-slate-400"
                />
                <button className="bg-primary text-white text-xs px-3 py-2 rounded-lg font-medium">
                  Join now
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
        <div className="border-t border-slate-100 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-slate-400">
          <p>© 2026 PriClaim Inc. All rights reserved.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <a href="#" className="hover:text-slate-600">Privacy Policy</a>
            <a href="#" className="hover:text-slate-600">Terms & Conditions</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

function FooterColumn({ title, links }) {
  return (
    <div>
      <h4 className="font-bold text-slate-900 mb-4">{title}</h4>
      <ul className="space-y-2 text-sm text-slate-500">
        {links.map((link, i) => (
          <li key={i}>
            <a href="#" className="hover:text-primary transition-colors">{link}</a>
          </li>
        ))}
      </ul>
    </div>
  )
}