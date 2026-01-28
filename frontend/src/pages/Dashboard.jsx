import { useState, useEffect, useMemo } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import FileUpload from '../components/upload/FileUpload'
import {
    PieChart, Pie, Cell, ResponsiveContainer,
    BarChart, Bar, XAxis, YAxis, Tooltip, Legend
} from 'recharts'
import {
    LayoutDashboard, FileText, CheckCircle, AlertCircle,
    Clock, Search, Filter, Plus, LogOut, ChevronRight
} from 'lucide-react'
import { toast } from 'sonner'
import { motion } from 'framer-motion'
import { StarsBackground } from '../components/ui/stars-background'
import { ShootingStars } from '../components/ui/shooting-stars'

export default function Dashboard() {
    const { user, signOut } = useAuth()
    const navigate = useNavigate()
    const [showUpload, setShowUpload] = useState(false)
    const [claims, setClaims] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    const [statusFilter, setStatusFilter] = useState('all')

    const handleSignOut = async () => {
        await signOut()
        navigate('/login')
    }

    // Smart polling
    const hasProcessingClaims = useMemo(() => {
        return claims.some(c => ['queued', 'text_extraction'].includes(c.status))
    }, [claims])

    const fetchClaims = async () => {
        try {
            const { data: { session } } = await supabase.auth.getSession()
            if (!session) return

            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/claims`, {
                headers: { 'Authorization': `Bearer ${session.access_token}` }
            })
            const data = await response.json()

            if (response.ok && data.claims) {
                setClaims(data.claims)
            }
        } catch (err) {
            console.error('Failed to fetch claims:', err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchClaims()
        const interval = setInterval(fetchClaims, hasProcessingClaims ? 5000 : 30000)
        return () => clearInterval(interval)
    }, [user, hasProcessingClaims])

    // Derived State
    const filteredClaims = useMemo(() => {
        return claims.filter(claim => {
            const matchesSearch = claim.file_name.toLowerCase().includes(searchQuery.toLowerCase())
            const matchesStatus = statusFilter === 'all' || claim.status === statusFilter
            return matchesSearch && matchesStatus
        })
    }, [claims, searchQuery, statusFilter])

    const stats = useMemo(() => ({
        total: claims.length,
        processing: claims.filter(c => ['queued', 'text_extraction'].includes(c.status)).length,
        completed: claims.filter(c => c.status === 'completed').length,
        failed: claims.filter(c => c.status === 'failed').length,
    }), [claims])

    // Chart Data
    const statusData = [
        { name: 'Completed', value: stats.completed, color: '#10B981' },
        { name: 'Processing', value: stats.processing, color: '#F59E0B' },
        { name: 'Failed', value: stats.failed, color: '#EF4444' },
    ].filter(d => d.value > 0)

    const handleUploadSuccess = () => {
        toast.success('Claim uploaded successfully!')
        setShowUpload(false)
        fetchClaims()
    }

    const handleUploadError = (err) => {
        toast.error(err.message || 'Upload failed')
    }

    return (
        <div className="min-h-screen bg-slate-950 text-white relative overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <StarsBackground />
                <ShootingStars />
            </div>

            {/* Navbar */}
            <nav className="sticky top-0 z-30 bg-slate-950/80 backdrop-blur-xl border-b border-white/10 relative z-40">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center shadow-sm border border-white/10 p-1.5 backdrop-blur-md">
                            <img src="/PriClaim.png" alt="PriClaim" className="w-full h-full object-contain mix-blend-screen scale-150" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-white">
                                PriClaim
                            </h1>
                            <p className="text-xs text-slate-400 font-medium">Dashboard</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        {user?.user_metadata?.role === 'admin' && (
                            <button
                                onClick={() => navigate('/admin/policies')}
                                className="text-sm font-medium text-slate-400 hover:text-blue-400 transition-colors"
                            >
                                Manage Policies
                            </button>
                        )}
                        <div className="h-4 w-px bg-white/10" />
                        <div className="flex items-center gap-3">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-semibold text-slate-200">{user?.email}</p>
                            </div>
                            <button
                                onClick={handleSignOut}
                                className="p-2 hover:bg-white/10 rounded-lg transition-colors text-slate-400 hover:text-red-400"
                                title="Sign out"
                            >
                                <LogOut className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-6 py-8 space-y-8 relative z-10">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatsCard
                        title="Total Claims"
                        value={stats.total}
                        icon={FileText}
                        color="blue"
                    />
                    <StatsCard
                        title="Processing"
                        value={stats.processing}
                        icon={Clock}
                        color="yellow"
                        animate={stats.processing > 0}
                    />
                    <StatsCard
                        title="Completed"
                        value={stats.completed}
                        icon={CheckCircle}
                        color="green"
                    />
                    <StatsCard
                        title="Failed"
                        value={stats.failed}
                        icon={AlertCircle}
                        color="red"
                    />
                </div>

                {/* Main Content Area */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Charts & Analytics */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-slate-900/50 backdrop-blur-md border border-white/10 p-6 rounded-2xl">
                            <h3 className="text-lg font-semibold text-white mb-6">Claim Status</h3>
                            <div className="h-[250px] w-full">
                                {statusData.length > 0 ? (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={statusData}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={60}
                                                outerRadius={80}
                                                paddingAngle={5}
                                                dataKey="value"
                                                stroke="none"
                                            >
                                                {statusData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))}
                                            </Pie>
                                            <Tooltip
                                                contentStyle={{
                                                    backgroundColor: '#1e293b',
                                                    borderRadius: '12px',
                                                    border: '1px solid rgba(255,255,255,0.1)',
                                                    color: '#fff',
                                                    boxShadow: '0 4px 12px rgba(0,0,0,0.5)'
                                                }}
                                                itemStyle={{ color: '#cbd5e1' }}
                                            />
                                            <Legend verticalAlign="bottom" height={36} iconType="circle" />
                                        </PieChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="h-full flex items-center justify-center text-slate-500 text-sm">
                                        No data available
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-blue-900/40 to-indigo-900/40 border border-blue-500/20 p-6 rounded-2xl text-white overflow-hidden relative backdrop-blur-md">
                            <div className="relative z-10">
                                <h3 className="text-lg font-semibold mb-2">Pro Tip</h3>
                                <p className="text-blue-200 text-sm leading-relaxed">
                                    Upload claims with policy documents linked for 40% more accurate AI audit results.
                                </p>
                            </div>
                            <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 bg-blue-500/20 rounded-full blur-2xl" />
                        </div>
                    </div>

                    {/* Right Column: Recent Claims */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                            <div className="relative flex-1 w-full">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
                                <input
                                    type="text"
                                    placeholder="Search claims..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all shadow-sm text-white placeholder:text-slate-500"
                                />
                            </div>
                            <div className="flex gap-3 w-full sm:w-auto">
                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm font-medium shadow-sm text-slate-200 [&>option]:bg-slate-900"
                                >
                                    <option value="all">All Status</option>
                                    <option value="queued">Queued</option>
                                    <option value="text_extraction">Processing</option>
                                    <option value="completed">Completed</option>
                                    <option value="failed">Failed</option>
                                </select>
                                <button
                                    onClick={() => setShowUpload(true)}
                                    className="flex items-center gap-2 px-5 py-2.5 bg-white text-slate-950 font-medium rounded-xl hover:bg-slate-200 transition-all shadow-lg shadow-white/5 active:scale-95 whitespace-nowrap"
                                >
                                    <Plus className="w-4 h-4" />
                                    New Claim
                                </button>
                            </div>
                        </div>

                        {/* Claims List */}
                        <div className="space-y-3">
                            {loading ? (
                                <div className="space-y-3">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="h-20 bg-white/5 rounded-xl animate-pulse" />
                                    ))}
                                </div>
                            ) : filteredClaims.length === 0 ? (
                                <EmptyState hasSearch={searchQuery || statusFilter !== 'all'} />
                            ) : (
                                filteredClaims.map(claim => (
                                    <ClaimRow
                                        key={claim.id}
                                        claim={claim}
                                        onClick={() => navigate(`/claims/${claim.id}`)}
                                    />
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </main>

            {/* Upload Modal */}
            {showUpload && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity">
                    <div className="bg-white rounded-2xl p-8 max-w-lg w-full relative shadow-2xl animate-in fade-in zoom-in duration-200">
                        <button
                            onClick={() => setShowUpload(false)}
                            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
                        >
                            <LogOut className="w-5 h-5 rotate-45" />
                        </button>
                        <h2 className="text-2xl font-bold text-slate-900 mb-2">Upload Claim</h2>
                        <p className="text-slate-500 mb-6">Upload a PDF document for AI analysis.</p>
                        <FileUpload
                            onUploadSuccess={handleUploadSuccess}
                            onUploadError={handleUploadError}
                        />
                    </div>
                </div>
            )}
        </div>
    )
}

function statsColor(color) {
    const map = {
        blue: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
        yellow: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
        green: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
        red: 'bg-red-500/10 text-red-500 border-red-500/20',
    }
    return map[color]
}

function StatsCard({ title, value, icon: Icon, color, animate }) {
    return (
        <div className="bg-slate-900/50 backdrop-blur-md border border-white/10 p-5 rounded-2xl hover:bg-slate-800/50 transition-colors duration-300">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-slate-400 mb-1">{title}</p>
                    <p className="text-2xl font-bold text-white">{value}</p>
                </div>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${statsColor(color)}`}>
                    <Icon className={`w-6 h-6 ${animate ? 'animate-spin-slow' : ''}`} />
                </div>
            </div>
        </div>
    )
}

function ClaimRow({ claim, onClick }) {
    const statusIdx = {
        queued: { label: 'Queued', color: 'bg-slate-800 text-slate-300' },
        text_extraction: { label: 'Processing', color: 'bg-amber-500/10 text-amber-400 border border-amber-500/20' },
        completed: { label: 'Completed', color: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' },
        failed: { label: 'Failed', color: 'bg-red-500/10 text-red-400 border border-red-500/20' }
    }
    const st = statusIdx[claim.status] || { label: claim.status, color: 'bg-slate-800' }

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.01 }}
            onClick={onClick}
            className="group bg-slate-900/50 backdrop-blur-sm border border-white/5 p-4 rounded-xl cursor-pointer hover:bg-slate-800/60 hover:border-white/10 transition-all flex items-center justify-between"
        >
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center text-slate-400 group-hover:bg-blue-500/10 group-hover:text-blue-400 transition-colors">
                    <FileText className="w-5 h-5" />
                </div>
                <div>
                    <p className="font-semibold text-slate-200 group-hover:text-white transition-colors">{claim.file_name}</p>
                    <p className="text-xs text-slate-500 mt-0.5">
                        {new Date(claim.created_at).toLocaleDateString(undefined, {
                            month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                        })}
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-4">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${st.color}`}>
                    {st.label}
                </span>
                <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-slate-400 transition-colors" />
            </div>
        </motion.div>
    )
}

function EmptyState({ hasSearch }) {
    return (
        <div className="text-center py-12 px-4 border-2 border-dashed border-white/10 rounded-2xl bg-white/5">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/5">
                <Search className="w-8 h-8 text-slate-500" />
            </div>
            <h3 className="text-lg font-semibold text-white">
                {hasSearch ? 'No claims found' : 'No claims yet'}
            </h3>
            <p className="text-slate-500 max-w-xs mx-auto mt-2">
                {hasSearch ? 'Try adjusting your filters.' : 'Upload your first document to get started.'}
            </p>
        </div>
    )
}
