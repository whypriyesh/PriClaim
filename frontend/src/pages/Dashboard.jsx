import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function Dashboard() {
    const { user, signOut } = useAuth()
    const navigate = useNavigate()

    const handleSignOut = async () => {
        await signOut()
        navigate('/login')
    }

    return (
        <div className="min-h-screen bg-slate-900 p-8">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-2xl font-bold text-white">PriClaim Dashboard</h1>
                    <button
                        onClick={handleSignOut}
                        className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition"
                    >
                        Sign Out
                    </button>
                </div>

                <div className="bg-slate-800 rounded-xl p-6">
                    <p className="text-slate-300">
                        Welcome, <span className="text-white font-medium">{user?.email}</span>
                    </p>
                    <div className="mt-4 flex gap-3">
                        <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm">🟢 Low Risk</span>
                        <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-sm">🟡 Medium</span>
                        <span className="px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-sm">🔴 High Risk</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
