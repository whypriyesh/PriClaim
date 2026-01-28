import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { motion } from 'framer-motion'
import { StarsBackground } from '../components/ui/stars-background'
import { ShootingStars } from '../components/ui/shooting-stars'
import { Mail, CheckCircle, ArrowRight, Loader } from 'lucide-react'

export default function ForgotPassword() {
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)
    const [submitted, setSubmitted] = useState(false)

    const { resetPassword } = useAuth()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        try {
            await resetPassword(email)
            setSubmitted(true)
        } catch (err) {
            // Don't show specific errors for security
            setSubmitted(true)
        } finally {
            setLoading(false)
        }
    }

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
                className="max-w-md w-full relative z-10"
            >
                {submitted ? (
                    <div className="text-center glass-card p-8 rounded-3xl border border-white/10 bg-slate-900/50 shadow-2xl backdrop-blur-xl">
                        <div className="mb-6">
                            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500/10 border border-green-500/20 rounded-full shadow-lg shadow-green-500/10">
                                <CheckCircle className="w-10 h-10 text-green-400" />
                            </div>
                        </div>
                        <h1 className="text-2xl font-bold text-white mb-3">Check your email</h1>
                        <p className="text-slate-400 mb-8">
                            If an account exists with that email, we've sent a password reset link.
                        </p>
                        <Link
                            to="/login"
                            className="block w-full py-3.5 bg-white text-slate-950 font-bold rounded-xl hover:bg-slate-200 transition-all shadow-lg shadow-white/5 active:scale-[0.98]"
                        >
                            Back to Login
                        </Link>
                    </div>
                ) : (
                    <>
                        <div className="text-center mb-8">
                            <h1 className="text-3xl font-bold text-white">PriClaim AI</h1>
                            <p className="text-slate-400 mt-2">Reset your password</p>
                        </div>

                        <div className="glass-card p-8 rounded-3xl border border-white/10 bg-slate-900/50 shadow-2xl backdrop-blur-xl">
                            <h2 className="text-xl font-semibold text-white mb-2">
                                Forgot your password?
                            </h2>
                            <p className="text-slate-400 text-sm mb-6">
                                Enter your email and we'll send you a reset link.
                            </p>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-1.5">Email Address</label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-3.5 w-5 h-5 text-slate-500" />
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all text-white placeholder:text-slate-600"
                                            placeholder="name@company.com"
                                            required
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-500/20 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {loading ? (
                                        <>Sending... <Loader className="w-4 h-4 animate-spin ml-2" /></>
                                    ) : (
                                        <>Send Reset Link <ArrowRight className="w-4 h-4 ml-1" /></>
                                    )}
                                </button>
                            </form>

                            <div className="mt-8 text-center bg-white/5 rounded-xl py-4 border border-white/5">
                                <Link to="/login" className="text-blue-400 hover:text-blue-300 text-sm font-semibold flex items-center justify-center gap-1 group">
                                    <ArrowRight className="w-4 h-4 rotate-180 group-hover:-translate-x-1 transition-transform" /> Back to Login
                                </Link>
                            </div>
                        </div>
                    </>
                )}
            </motion.div>
        </div>
    )
}
