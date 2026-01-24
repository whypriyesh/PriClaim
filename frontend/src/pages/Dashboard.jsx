import { useState, useEffect, useMemo } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import FileUpload from '../components/upload/FileUpload'

export default function Dashboard() {
    const { user, signOut } = useAuth()
    const navigate = useNavigate()
    const [showUpload, setShowUpload] = useState(false)
    const [claims, setClaims] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    const [statusFilter, setStatusFilter] = useState('all')
    const [toast, setToast] = useState(null)

    const handleSignOut = async () => {
        await signOut()
        navigate('/login')
    }

    // Smart polling: Only poll frequently if there are processing claims
    const hasProcessingClaims = useMemo(() => {
        return claims.some(c => ['queued', 'text_extraction'].includes(c.status))
    }, [claims])

    // Fetch claims with auth
    const fetchClaims = async () => {
        try {
            const headers = {}

            if (user?.id) {
                const { data: { session } } = await supabase.auth.getSession()
                if (session?.access_token) {
                    headers['Authorization'] = `Bearer ${session.access_token}`
                }
            }

            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/claims`, { headers })
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

    // Smart polling effect
    useEffect(() => {
        fetchClaims()

        // Dynamic interval: 5s if processing, 30s if idle
        const interval = setInterval(fetchClaims, hasProcessingClaims ? 5000 : 30000)

        return () => clearInterval(interval)
    }, [user, hasProcessingClaims])

    // Filter and search claims
    const filteredClaims = useMemo(() => {
        return claims.filter(claim => {
            const matchesSearch = claim.file_name.toLowerCase().includes(searchQuery.toLowerCase())
            const matchesStatus = statusFilter === 'all' || claim.status === statusFilter
            return matchesSearch && matchesStatus
        })
    }, [claims, searchQuery, statusFilter])

    // Calculate stats
    const stats = useMemo(() => ({
        total: claims.length,
        processing: claims.filter(c => ['queued', 'text_extraction'].includes(c.status)).length,
        completed: claims.filter(c => c.status === 'completed').length,
        failed: claims.filter(c => c.status === 'failed').length,
    }), [claims])

    const handleUploadSuccess = (data) => {
        showToast('Claim uploaded successfully!', 'success')
        setShowUpload(false)
        fetchClaims() // Immediate refresh after upload
    }

    const handleUploadError = () => {
        showToast('Upload failed. Please try again.', 'error')
    }

    const showToast = (message, type) => {
        setToast({ message, type })
        setTimeout(() => setToast(null), 3000)
    }

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Toast Notification */}
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

            {/* Navbar */}
            <nav className="bg-white border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                                <span className="material-icons-round text-white">receipt_long</span>
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-slate-900">PriClaim</h1>
                                <p className="text-xs text-slate-500">Claims Dashboard</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="text-right">
                                <p className="text-sm font-medium text-slate-900">{user?.email}</p>
                                <p className="text-xs text-slate-500">Signed in</p>
                            </div>
                            <button
                                onClick={handleSignOut}
                                className="text-slate-600 hover:text-slate-900 transition"
                            >
                                <span className="material-icons-round">logout</span>
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-6 py-8">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <StatsCard icon="receipt_long" label="Total Claims" value={stats.total} color="blue" />
                    <StatsCard icon="hourglass_empty" label="Processing" value={stats.processing} color="yellow" />
                    <StatsCard icon="check_circle" label="Completed" value={stats.completed} color="green" />
                    <StatsCard icon="error" label="Failed" value={stats.failed} color="red" />
                </div>

                {/* Actions Bar */}
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-6">
                    <div className="flex flex-col sm:flex-row gap-3 flex-1 w-full sm:w-auto">
                        {/* Search */}
                        <div className="relative flex-1">
                            <span className="material-icons-round absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
                                search
                            </span>
                            <input
                                type="text"
                                placeholder="Search by filename..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                            />
                        </div>

                        {/* Filter */}
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        >
                            <option value="all">All Status</option>
                            <option value="queued">Queued</option>
                            <option value="text_extraction">Extracting</option>
                            <option value="completed">Completed</option>
                            <option value="failed">Failed</option>
                        </select>
                    </div>

                    {/* Upload Button */}
                    <button
                        onClick={() => setShowUpload(true)}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 bg-primary text-white font-medium rounded-xl hover:bg-primary-hover transition"
                    >
                        <span className="material-icons-round">add</span>
                        Upload Claim
                    </button>
                </div>

                {/* Claims List */}
                {loading ? (
                    <LoadingState />
                ) : filteredClaims.length === 0 ? (
                    <EmptyState
                        hasSearch={searchQuery || statusFilter !== 'all'}
                        onUpload={() => setShowUpload(true)}
                    />
                ) : (
                    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-slate-50 border-b border-slate-200">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                                            File Name
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                                            Uploaded
                                        </th>
                                        <th className="px-6 py-4 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {filteredClaims.map(claim => (
                                        <tr key={claim.id} className="hover:bg-slate-50 transition">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                                                        <span className="material-icons-round text-blue-600">description</span>
                                                    </div>
                                                    <span className="font-medium text-slate-900">{claim.file_name}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <StatusBadge status={claim.status} />
                                            </td>
                                            <td className="px-6 py-4 text-slate-600">
                                                {new Date(claim.created_at).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button
                                                    onClick={() => navigate(`/claims/${claim.id}`)}
                                                    className="text-primary hover:text-primary-hover font-medium transition"
                                                >
                                                    View Details
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </main>

            {/* Upload Modal */}
            {showUpload && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl p-8 max-w-lg w-full relative">
                        <button
                            onClick={() => setShowUpload(false)}
                            className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition"
                        >
                            <span className="material-icons-round">close</span>
                        </button>

                        <h2 className="text-2xl font-bold text-slate-900 mb-2">Upload Claim</h2>
                        <p className="text-slate-600 mb-6">Upload a PDF claim document for processing</p>

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

// Stats Card Component
function StatsCard({ icon, label, value, color }) {
    const colors = {
        blue: 'bg-blue-50 text-blue-600',
        yellow: 'bg-yellow-50 text-yellow-600',
        green: 'bg-green-50 text-green-600',
        red: 'bg-red-50 text-red-600',
    }

    return (
        <div className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex items-center gap-4">
                <div className={`w-12 h-12 ${colors[color]} rounded-xl flex items-center justify-center`}>
                    <span className="material-icons-round">{icon}</span>
                </div>
                <div>
                    <p className="text-2xl font-bold text-slate-900">{value}</p>
                    <p className="text-sm text-slate-500">{label}</p>
                </div>
            </div>
        </div>
    )
}

// Status Badge Component
function StatusBadge({ status }) {
    const statusConfig = {
        queued: { style: 'bg-yellow-100 text-yellow-700', icon: 'schedule', label: 'Queued' },
        text_extraction: { style: 'bg-blue-100 text-blue-700', icon: 'description', label: 'Extracting' },
        completed: { style: 'bg-green-100 text-green-700', icon: 'check_circle', label: 'Completed' },
        failed: { style: 'bg-red-100 text-red-700', icon: 'error', label: 'Failed' },
    }

    const config = statusConfig[status] || { style: 'bg-slate-100 text-slate-600', icon: 'help', label: status }

    return (
        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${config.style}`}>
            <span className="material-icons-round text-xs">{config.icon}</span>
            {config.label}
        </span>
    )
}

// Loading State Component
function LoadingState() {
    return (
        <div className="bg-white rounded-2xl border border-slate-200 p-12">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                <p className="text-slate-600">Loading claims...</p>
            </div>
        </div>
    )
}

// Empty State Component  
function EmptyState({ hasSearch, onUpload }) {
    if (hasSearch) {
        return (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
                <span className="material-icons-round text-5xl text-slate-300 mb-4">search_off</span>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">No claims found</h3>
                <p className="text-slate-600">Try adjusting your search or filters</p>
            </div>
        )
    }

    return (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
            <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="material-icons-round text-4xl text-blue-600">receipt_long</span>
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">No claims yet</h3>
            <p className="text-slate-600 mb-6">Upload your first claim document to get started</p>
            <button
                onClick={onUpload}
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-medium rounded-xl hover:bg-primary-hover transition"
            >
                <span className="material-icons-round">add</span>
                Upload Your First Claim
            </button>
        </div>
    )
}

// Toast Component
function Toast({ message, type, onClose }) {
    const styles = {
        success: 'bg-green-500',
        error: 'bg-red-500',
        info: 'bg-blue-500',
    }

    return (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top">
            <div className={`${styles[type]} text-white px-6 py-4 rounded-xl shadow-lg flex items-center gap-3`}>
                <span className="material-icons-round">
                    {type === 'success' ? 'check_circle' : type === 'error' ? 'error' : 'info'}
                </span>
                <p className="font-medium">{message}</p>
                <button onClick={onClose} className="ml-2 hover:opacity-80">
                    <span className="material-icons-round text-sm">close</span>
                </button>
            </div>
        </div>
    )
}
