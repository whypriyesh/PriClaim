import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { StarsBackground } from '../components/ui/stars-background'
import { ShootingStars } from '../components/ui/shooting-stars'
import { Mail } from 'lucide-react'

export default function CheckEmail() {
    return (
        <div className="min-h-screen bg-slate-950 relative overflow-hidden flex items-center justify-center px-4">
            {/* Background Decor */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <StarsBackground />
                <ShootingStars />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md w-full text-center relative z-10 glass-card p-8 rounded-3xl border border-white/10 bg-slate-900/50 shadow-2xl backdrop-blur-xl"
            >
                {/* Icon */}
                <div className="mb-6">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-500/10 border border-blue-500/20 rounded-full shadow-lg shadow-blue-500/10">
                        <Mail className="w-10 h-10 text-blue-400" />
                    </div>
                </div>

                {/* Content */}
                <h1 className="text-3xl font-bold text-white mb-3">Check your email</h1>
                <p className="text-slate-400 mb-8 text-lg">
                    We've sent you a verification link. Please check your email and click the link to verify your account.
                </p>

                {/* Actions */}
                <div className="space-y-4">
                    <Link
                        to="/login"
                        className="block w-full py-3.5 bg-white text-slate-950 font-bold rounded-xl hover:bg-slate-200 transition-all shadow-lg shadow-white/5 active:scale-[0.98]"
                    >
                        Back to Login
                    </Link>
                    <p className="text-slate-500 text-sm">
                        Didn't receive the email? Check your spam folder.
                    </p>
                </div>
            </motion.div>
        </div>
    )
}
