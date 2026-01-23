import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

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

    if (submitted) {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4">
                <div className="max-w-md w-full text-center">
                    <div className="mb-6">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500/20 rounded-full">
                            <svg className="w-8 h-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                    </div>
                    <h1 className="text-2xl font-bold text-white mb-3">Check your email</h1>
                    <p className="text-slate-400 mb-8">
                        If an account exists with that email, we've sent a password reset link.
                    </p>
                    <Link
                        to="/login"
                        className="block w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition"
                    >
                        Back to Login
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4">
            <div className="max-w-md w-full">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-white">PriClaim AI</h1>
                    <p className="text-slate-400 mt-2">Reset your password</p>
                </div>

                <div className="bg-slate-800 rounded-2xl p-8 shadow-xl">
                    <h2 className="text-xl font-semibold text-white mb-2">
                        Forgot your password?
                    </h2>
                    <p className="text-slate-400 text-sm mb-6">
                        Enter your email and we'll send you a reset link.
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm text-slate-400 mb-1">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
                                placeholder="you@example.com"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition disabled:opacity-50"
                        >
                            {loading ? 'Sending...' : 'Send Reset Link'}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <Link to="/login" className="text-blue-400 hover:text-blue-300 text-sm">
                            Back to Login
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
