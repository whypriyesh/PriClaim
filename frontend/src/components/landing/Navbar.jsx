import { Link } from 'react-router-dom'
import { Button } from '../ui/button'

export default function Navbar() {
    return (
        <nav className="fixed w-full z-50 top-0 bg-white/80 backdrop-blur-md border-b border-slate-100">
            <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-xl">P</div>
                    <span className="text-xl font-bold tracking-tight text-slate-900">PriClaim</span>
                </Link>

                {/* Nav Links */}
                <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
                    <a href="#features" className="hover:text-primary transition-colors">Features</a>
                    <a href="#how-it-works" className="hover:text-primary transition-colors">How it works</a>
                    <a href="#pricing" className="hover:text-primary transition-colors">Pricing</a>
                    <a href="#faq" className="hover:text-primary transition-colors">FAQ</a>
                </div>

                {/* CTA */}
                <div className="flex items-center gap-4">
                    <Link to="/login" className="hidden md:block text-sm font-semibold text-slate-600 hover:text-primary">
                        Sign in
                    </Link>
                    <Button to="/login" size="sm">Book a Demo</Button>
                </div>
            </div>
        </nav>
    )
}