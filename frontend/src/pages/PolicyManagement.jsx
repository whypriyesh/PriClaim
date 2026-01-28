import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import {
    ArrowLeft, Upload, FileText, Trash2, Shield,
    Building, AlertCircle, CheckCircle, Plus, Search
} from 'lucide-react'
import { toast } from 'sonner'
import { motion } from 'framer-motion'
import { StarsBackground } from '../components/ui/stars-background'
import { ShootingStars } from '../components/ui/shooting-stars'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export default function PolicyManagement() {
    const navigate = useNavigate()
    const { user } = useAuth()
    const [policies, setPolicies] = useState([])
    const [loading, setLoading] = useState(true)
    const [uploading, setUploading] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        policy_text: '',
        company_name: '',
        policy_type: '',
        coverage_limit: ''
    })

    // Fetch policies on mount
    useEffect(() => {
        fetchPolicies()
    }, [])

    const fetchPolicies = async () => {
        try {
            setLoading(true)
            const { data: { session } } = await supabase.auth.getSession()
            if (!session) return

            const response = await fetch(`${API_URL}/api/v1/policies`, {
                headers: { 'Authorization': `Bearer ${session.access_token}` }
            })

            if (!response.ok) throw new Error('Failed to fetch policies')

            const data = await response.json()
            setPolicies(data)
        } catch (err) {
            toast.error(err.message)
        } finally {
            setLoading(false)
        }
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setUploading(true)

        try {
            const { data: { session } } = await supabase.auth.getSession()
            if (!session) throw new Error('Not authenticated')

            const payload = {
                name: formData.name,
                policy_text: formData.policy_text,
                company_name: formData.company_name || null,
                policy_type: formData.policy_type || null,
                coverage_limit: formData.coverage_limit ? parseFloat(formData.coverage_limit) : null
            }

            const response = await fetch(`${API_URL}/api/v1/policies`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${session.access_token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.detail || 'Failed to create policy')
            }

            const newPolicy = await response.json()
            toast.success('Policy created successfully')
            setPolicies(prev => [newPolicy, ...prev])

            // Reset form
            setFormData({
                name: '',
                policy_text: '',
                company_name: '',
                policy_type: '',
                coverage_limit: ''
            })
        } catch (err) {
            toast.error(err.message)
        } finally {
            setUploading(false)
        }
    }

    const handleDelete = async (policyId) => {
        if (!confirm('Are you sure you want to delete this policy?')) return

        try {
            const { data: { session } } = await supabase.auth.getSession()
            if (!session) throw new Error('Not authenticated')

            const response = await fetch(`${API_URL}/api/v1/policies/${policyId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${session.access_token}` }
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.detail || 'Failed to delete policy')
            }

            toast.success('Policy deleted successfully')
            setPolicies(prev => prev.filter(p => p.id !== policyId))
        } catch (err) {
            toast.error(err.message)
        }
    }

    const filteredPolicies = policies.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.company_name?.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className="min-h-screen bg-slate-950 text-white relative overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <StarsBackground />
                <ShootingStars />
            </div>

            {/* Header */}
            <header className="sticky top-0 z-30 bg-slate-950/80 backdrop-blur-md border-b border-white/10 relative z-40">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="p-2 -ml-2 hover:bg-white/10 rounded-lg transition-colors text-slate-400 hover:text-white"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/10 p-1.5 border border-white/10 backdrop-blur-md">
                                <img src="/PriClaim.png" alt="PriClaim" className="w-full h-full object-contain mix-blend-screen scale-150" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-white">Policy Management</h1>
                                <p className="text-xs text-slate-400 font-medium">Admin Panel</p>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 py-8 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Create Form */}
                    <div className="lg:col-span-5 space-y-6">
                        <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6 sticky top-28">
                            <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                                <Plus className="w-5 h-5 text-blue-400" />
                                Add New Policy
                            </h2>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <InputGroup label="Policy Name" required>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all font-medium text-white placeholder:text-slate-600"
                                        placeholder="e.g. Gold Health Plan 2024"
                                    />
                                </InputGroup>

                                <div className="grid grid-cols-2 gap-4">
                                    <InputGroup label="Company">
                                        <div className="relative">
                                            <Building className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                                            <input
                                                type="text"
                                                name="company_name"
                                                value={formData.company_name}
                                                onChange={handleInputChange}
                                                className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all text-white placeholder:text-slate-600"
                                                placeholder="e.g. Star Health"
                                            />
                                        </div>
                                    </InputGroup>

                                    <InputGroup label="Coverage Limit">
                                        <input
                                            type="number"
                                            name="coverage_limit"
                                            value={formData.coverage_limit}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all text-white placeholder:text-slate-600"
                                            placeholder="₹"
                                        />
                                    </InputGroup>
                                </div>

                                <InputGroup label="Policy Type">
                                    <select
                                        name="policy_type"
                                        value={formData.policy_type}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all appearance-none text-white [&>option]:bg-slate-900"
                                    >
                                        <option value="">Select Type...</option>
                                        <option value="Health">Health Insurance</option>
                                        <option value="Life">Life Insurance</option>
                                        <option value="Motor">Motor Insurance</option>
                                        <option value="Travel">Travel Insurance</option>
                                    </select>
                                </InputGroup>

                                <InputGroup label="Policy Text Document" required>
                                    <textarea
                                        name="policy_text"
                                        value={formData.policy_text}
                                        onChange={handleInputChange}
                                        required
                                        rows={6}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all resize-none font-mono text-sm leading-relaxed text-slate-300 placeholder:text-slate-600"
                                        placeholder="Paste the full policy terms and conditions text here..."
                                    />
                                </InputGroup>

                                <button
                                    type="submit"
                                    disabled={uploading}
                                    className="w-full py-3 bg-white text-slate-950 font-semibold rounded-xl hover:bg-slate-200 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-white/5"
                                >
                                    {uploading ? (
                                        <>Creating...</>
                                    ) : (
                                        <>
                                            <Upload className="w-4 h-4" />
                                            Create Policy
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* List */}
                    <div className="lg:col-span-7 space-y-6">
                        <div className="flex items-center gap-4 bg-white/5 p-2 rounded-xl border border-white/10 shadow-sm">
                            <Search className="w-5 h-5 text-slate-400 ml-2" />
                            <input
                                type="text"
                                placeholder="Search policies..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="flex-1 bg-transparent border-none focus:outline-none text-sm py-2 text-white placeholder:text-slate-600"
                            />
                        </div>

                        {loading ? (
                            <div className="text-center py-12 text-slate-500">
                                <div className="w-8 h-8 border-2 border-white/10 border-t-blue-500 rounded-full animate-spin mx-auto mb-3" />
                                Loading policies...
                            </div>
                        ) : filteredPolicies.length === 0 ? (
                            <div className="text-center py-16 bg-white/5 border border-white/10 border-dashed rounded-2xl">
                                <FileText className="w-12 h-12 text-slate-700 mx-auto mb-3" />
                                <p className="text-slate-400 font-medium">No policies found</p>
                                <p className="text-sm text-slate-600">Create one to get started</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {filteredPolicies.map(policy => (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        key={policy.id}
                                        className="group bg-slate-900/50 p-5 rounded-2xl border border-white/10 shadow-sm hover:bg-slate-800/60 transition-all"
                                    >
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h3 className="font-bold text-white truncate">
                                                        {policy.name}
                                                    </h3>
                                                    {policy.policy_type && (
                                                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide bg-blue-500/10 text-blue-400 border border-blue-500/20">
                                                            {policy.policy_type}
                                                        </span>
                                                    )}
                                                </div>

                                                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-400">
                                                    {policy.company_name && (
                                                        <span className="flex items-center gap-1.5">
                                                            <Building className="w-3.5 h-3.5" />
                                                            {policy.company_name}
                                                        </span>
                                                    )}
                                                    {policy.coverage_limit && (
                                                        <span className="flex items-center gap-1.5 text-slate-300 font-medium">
                                                            <Shield className="w-3.5 h-3.5" />
                                                            ₹{policy.coverage_limit.toLocaleString()}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            <button
                                                onClick={() => handleDelete(policy.id)}
                                                className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                                                title="Delete policy"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    )
}

function InputGroup({ label, required, children }) {
    return (
        <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                {label} {required && <span className="text-red-400">*</span>}
            </label>
            {children}
        </div>
    )
}
