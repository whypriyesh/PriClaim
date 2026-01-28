import { Link } from 'react-router-dom'
import { Button } from '../ui/button'

export default function Navbar() {
    return (
        <nav className="fixed w-full z-50 top-0 bg-slate-950/80 backdrop-blur-md border-b border-white/10">
            <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2 group">
                    <div className="w-10 h-10 flex items-center justify-center group-hover:scale-105 transition-transform overflow-hidden rounded-lg">
                        <img src="/PriClaim.png" alt="PriClaim" className="w-full h-full object-contain mix-blend-screen scale-150" />
                    </div>
                    <span className="text-xl font-bold tracking-tight text-white">PriClaim</span>
                </Link>

                {/* Nav Links */}
                <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
                    <a href="#features" className="hover:text-white transition-colors">Features</a>
                    <a href="#how-it-works" className="hover:text-white transition-colors">How it works</a>
                    <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
                    <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
                </div>

                {/* CTA */}
                <div className="flex items-center gap-4">
                    <Link to="/login" className="hidden md:block text-sm font-semibold text-slate-300 hover:text-white transition-colors">
                        Sign in
                    </Link>
                    <Link to="/login" className="inline-flex items-center justify-center rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-white text-slate-950 hover:bg-slate-200 h-9 px-4 py-2">
                        Get Started
                    </Link>
                </div>
            </div>
        </nav>
    )
}