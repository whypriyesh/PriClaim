import { Link } from 'react-router-dom'

export default function CheckEmail() {
    return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4">
            <div className="max-w-md w-full text-center">
                {/* Icon */}
                <div className="mb-6">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-500/20 rounded-full">
                        <svg className="w-8 h-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                    </div>
                </div>

                {/* Content */}
                <h1 className="text-2xl font-bold text-white mb-3">Check your email</h1>
                <p className="text-slate-400 mb-8">
                    We've sent you a verification link. Please check your email and click the link to verify your account.
                </p>

                {/* Actions */}
                <div className="space-y-3">
                    <Link
                        to="/login"
                        className="block w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition"
                    >
                        Back to Login
                    </Link>
                    <p className="text-slate-500 text-sm">
                        Didn't receive the email? Check your spam folder.
                    </p>
                </div>
            </div>
        </div>
    )
}
