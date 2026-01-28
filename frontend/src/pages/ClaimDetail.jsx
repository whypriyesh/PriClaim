import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import {
    ChevronLeft, FileText, Calendar, Clock, AlertCircle, CheckCircle,
    XCircle, HelpCircle, Activity, Stethoscope, User, Receipt,
    ChevronDown, ChevronUp, File, Search
} from 'lucide-react'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { StarsBackground } from '../components/ui/stars-background'
import { ShootingStars } from '../components/ui/shooting-stars'

export default function ClaimDetail() {
    const { claimId } = useParams()
    const navigate = useNavigate()
    const [claim, setClaim] = useState(null)
    const [loading, setLoading] = useState(true)
    const [showRawText, setShowRawText] = useState(false)

    useEffect(() => {
        fetchClaim()
    }, [claimId])

    const fetchClaim = async () => {
        try {
            const { data: { session } } = await supabase.auth.getSession()
            if (!session) return

            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/claims`, {
                headers: { 'Authorization': `Bearer ${session.access_token}` }
            })
            const data = await response.json()

            if (response.ok && data.claims) {
                const foundClaim = data.claims.find(c => c.id === claimId)
                setClaim(foundClaim)
            }
        } catch (err) {
            console.error('Failed to fetch claim:', err)
            toast.error('Failed to load claim details')
        } finally {
            setLoading(false)
        }
    }

    if (loading) return <LoadingState />
    if (!claim) return <NotFoundState navigate={navigate} />

    const structuredData = claim.extracted_data?.structured_data
    const rawText = claim.extracted_data?.raw_text

    return (
        <div className="min-h-screen bg-slate-950 text-white relative overflow-hidden pb-20">
            {/* Background */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <StarsBackground />
                <ShootingStars />
            </div>

            {/* Header */}
            <header className="sticky top-0 z-30 bg-slate-950/80 backdrop-blur-md border-b border-white/10 transition-all">
                <div className="max-w-5xl mx-auto px-6 py-4">
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="group flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-4 text-sm font-medium"
                    >
                        <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                        Back to Dashboard
                    </button>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-3 mb-1">
                                <h1 className="text-2xl font-bold text-white">Claim Details</h1>
                                <StatusBadge status={claim.status} />
                            </div>
                            <div className="flex items-center gap-2 text-sm text-slate-400">
                                <FileText className="w-4 h-4" />
                                <span>{claim.file_name}</span>
                                <span className="text-slate-600">•</span>
                                <span>Uploaded {new Date(claim.created_at).toLocaleDateString()}</span>
                            </div>
                        </div>

                        {claim.policy_text && (
                            <div className="px-3 py-1.5 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center gap-1.5 shadow-sm shadow-indigo-500/10">
                                <CheckCircle className="w-3.5 h-3.5" />
                                Policy Linked
                            </div>
                        )}
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-5xl mx-auto px-6 py-8 space-y-8 relative z-10">
                {claim.status === 'completed' && structuredData ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-8"
                    >
                        {/* AI Audit Results */}
                        {claim.audit_result && (
                            <AuditResultsSection auditResult={claim.audit_result} />
                        )}

                        {/* Extraction Confidence */}
                        <ConfidenceBanner confidence={structuredData.extraction_confidence} />

                        {/* Structured Data */}
                        <div className="grid md:grid-cols-2 gap-6">
                            <InfoCard
                                icon={Stethoscope}
                                title="Hospital Information"
                                value={structuredData.hospital_name || 'Not detected'}
                                empty={!structuredData.hospital_name}
                                delay={0.1}
                            />
                            <InfoCard
                                icon={User}
                                title="Patient Name"
                                value={structuredData.patient_name || 'Not detected'}
                                empty={!structuredData.patient_name}
                                delay={0.2}
                            />
                        </div>

                        {/* Line Items */}
                        <div className="bg-slate-900/50 backdrop-blur-md rounded-2xl overflow-hidden shadow-lg border border-white/10">
                            <div className="px-6 py-4 border-b border-white/10 bg-white/5">
                                <h2 className="font-semibold text-white flex items-center gap-2">
                                    <Receipt className="w-5 h-5 text-slate-400" />
                                    Claim Line Items
                                </h2>
                            </div>

                            {structuredData.claim_items?.length > 0 ? (
                                <div className="divide-y divide-white/10">
                                    {structuredData.claim_items.map((item, idx) => (
                                        <div key={idx} className="px-6 py-4 flex justify-between items-center hover:bg-white/5 transition-colors">
                                            <span className="text-slate-300 font-medium">{item.description}</span>
                                            <span className="font-semibold text-white font-mono">
                                                ₹{item.amount.toLocaleString()}
                                            </span>
                                        </div>
                                    ))}
                                    <div className="px-6 py-4 bg-white/5 flex justify-between items-center border-t border-white/10">
                                        <span className="font-bold text-white">Total Claimed</span>
                                        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400">
                                            ₹{structuredData.total_claimed?.toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                            ) : (
                                <div className="px-6 py-12 text-center text-slate-500">
                                    <File className="w-12 h-12 mx-auto text-slate-700 mb-2" />
                                    <p>No line items detected</p>
                                </div>
                            )}
                        </div>

                        {/* Raw Text Toggle */}
                        <div className="bg-slate-900/50 backdrop-blur-md rounded-2xl overflow-hidden shadow-lg border border-white/10">
                            <button
                                onClick={() => setShowRawText(!showRawText)}
                                className="w-full px-6 py-4 flex items-center justify-between hover:bg-white/5 transition-colors group"
                            >
                                <span className="font-semibold text-white flex items-center gap-2">
                                    <FileText className="w-5 h-5 text-slate-400 group-hover:text-blue-400 transition-colors" />
                                    Extracted Raw Text
                                </span>
                                {showRawText ? (
                                    <ChevronUp className="w-5 h-5 text-slate-400" />
                                ) : (
                                    <ChevronDown className="w-5 h-5 text-slate-400" />
                                )}
                            </button>

                            {showRawText && rawText && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    className="px-6 py-4 border-t border-white/10 bg-black/20"
                                >
                                    <pre className="text-xs text-slate-400 whitespace-pre-wrap font-mono bg-black/40 border border-white/10 p-4 rounded-xl shadow-inner max-h-96 overflow-y-auto">
                                        {rawText}
                                    </pre>
                                </motion.div>
                            )}
                        </div>
                    </motion.div>
                ) : (
                    <ProcessingState status={claim.status} error={claim.error_message} />
                )}
            </main>
        </div>
    )
}

function StatusBadge({ status }) {
    const config = {
        queued: { style: 'bg-amber-500/10 text-amber-500 border-amber-500/20', icon: Clock, label: 'Queued' },
        text_extraction: { style: 'bg-blue-500/10 text-blue-500 border-blue-500/20', icon: Activity, label: 'Processing' },
        completed: { style: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20', icon: CheckCircle, label: 'Completed' },
        failed: { style: 'bg-red-500/10 text-red-500 border-red-500/20', icon: AlertCircle, label: 'Failed' },
    }[status] || { style: 'bg-slate-800 text-slate-400 border-slate-700', icon: HelpCircle, label: status }

    const Icon = config.icon

    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${config.style}`}>
            <Icon className="w-3.5 h-3.5" />
            {config.label}
        </span>
    )
}

function InfoCard({ icon: Icon, title, value, empty, delay }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay }}
            className="bg-slate-900/50 backdrop-blur-md p-6 rounded-2xl flex items-center gap-4 hover:shadow-lg hover:bg-slate-800/60 transition-all border border-white/10"
        >
            <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-400 border border-blue-500/20 shadow-lg shadow-blue-500/5">
                <Icon className="w-6 h-6" />
            </div>
            <div>
                <h3 className="text-sm font-medium text-slate-400 mb-1">{title}</h3>
                <p className={`text-lg leading-none ${empty ? 'text-slate-600 italic' : 'text-white font-bold'}`}>
                    {value}
                </p>
            </div>
        </motion.div>
    )
}

function AuditResultsSection({ auditResult }) {
    const { verdict, risk_score, findings = [], explanation, confidence } = auditResult

    const verdictConfig = {
        'APPROVED': { style: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20', icon: CheckCircle, label: 'Approved' },
        'PARTIALLY_APPROVED': { style: 'bg-amber-500/10 text-amber-500 border-amber-500/20', icon: AlertCircle, label: 'Partially Approved' },
        'REJECTED': { style: 'bg-red-500/10 text-red-500 border-red-500/20', icon: XCircle, label: 'Rejected' },
        'NEEDS_REVIEW': { style: 'bg-blue-500/10 text-blue-500 border-blue-500/20', icon: HelpCircle, label: 'Needs Review' },
    }
    const config = verdictConfig[verdict] || verdictConfig['NEEDS_REVIEW']
    const VerdictIcon = config.icon

    return (
        <div className="bg-gradient-to-br from-slate-900/80 to-blue-950/30 rounded-3xl border border-white/10 shadow-xl p-8 relative overflow-hidden backdrop-blur-xl">
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

            <div className="relative z-10">
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-600/20 text-white">
                        <Activity className="w-7 h-7" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-white">AI Audit Report</h2>
                        <div className="flex items-center gap-2 text-sm text-slate-400">
                            <span>Powered by Groq LLaMA-3.3-70B</span>
                            {confidence && (
                                <span className="bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded text-xs font-semibold border border-blue-500/30">
                                    {(confidence * 100).toFixed(0)}% Confidence
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Risk & Verdict */}
                    <div className="space-y-6">
                        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 shadow-sm">
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Risk Assessment</h3>
                            <div className="flex items-center gap-6">
                                <RiskGauge score={risk_score} />
                                <div>
                                    <div className="text-3xl font-bold text-white">{risk_score}/100</div>
                                    <div className={`text-sm font-medium ${risk_score < 30 ? 'text-emerald-400' : risk_score < 70 ? 'text-amber-400' : 'text-red-400'
                                        }`}>
                                        {risk_score < 30 ? 'Low Risk' : risk_score < 70 ? 'Medium Risk' : 'High Risk'}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className={`rounded-2xl p-6 border ${config.style} flex items-center gap-4 bg-opacity-50`}>
                            <VerdictIcon className="w-10 h-10/ text-inherit" />
                            <div>
                                <div className="text-xs font-bold opacity-80 uppercase tracking-wider">Verdict</div>
                                <div className="text-2xl font-bold">{config.label}</div>
                            </div>
                        </div>
                    </div>

                    {/* Explanation & Findings */}
                    <div className="space-y-6">
                        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 shadow-sm">
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">AI Analysis</h3>
                            <p className="text-slate-300 leading-relaxed font-medium">
                                {explanation || "No explanation provided."}
                            </p>
                        </div>

                        {findings.length > 0 && (
                            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 shadow-sm">
                                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                                    Key Findings ({findings.length})
                                </h3>
                                <div className="space-y-3">
                                    {findings.map((f, i) => <FindingRow key={i} finding={f} />)}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

function RiskGauge({ score }) {
    const radius = 30
    const circumference = 2 * Math.PI * radius
    const strokeDashoffset = circumference - (score / 100) * circumference

    let color = '#10B981' // green
    if (score >= 30) color = '#F59E0B' // yellow
    if (score >= 70) color = '#EF4444' // red

    return (
        <div className="relative w-24 h-24 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
                <circle cx="48" cy="48" r={radius} stroke="#334155" strokeWidth="8" fill="transparent" />
                <circle
                    cx="48" cy="48" r={radius}
                    stroke={color}
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-out"
                />
            </svg>
        </div>
    )
}

function FindingRow({ finding }) {
    const { type, severity, description } = finding
    const icons = {
        high: AlertCircle,
        medium: HelpCircle,
        low: CheckCircle
    }
    const colors = {
        high: 'text-red-400 bg-red-500/10 border-red-500/20',
        medium: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
        low: 'text-blue-400 bg-blue-500/10 border-blue-500/20'
    }

    const Icon = icons[severity] || icons.medium
    const colorClass = colors[severity] || colors.medium

    return (
        <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-900/80 border border-white/10 shadow-sm">
            <div className={`p-1.5 rounded-lg shrink-0 ${colorClass} bg-transparent border-none`}>
                <Icon className="w-4 h-4" />
            </div>
            <div>
                <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{type.replace('_', ' ')}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase ${colorClass.split(' ')[1] || ''} ${colorClass.split(' ')[0]}`}>
                        {severity}
                    </span>
                </div>
                <p className="text-sm text-slate-300 leading-snug">{description}</p>
            </div>
        </div>
    )
}

function ConfidenceBanner({ confidence }) {
    let config = {
        style: 'bg-slate-800 text-slate-400 border-slate-700',
        icon: HelpCircle,
        text: 'Unknown confidence'
    }

    if (confidence === 'high') config = { style: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', icon: CheckCircle, text: 'High Confidence Extraction' }
    if (confidence === 'medium') config = { style: 'bg-amber-500/10 text-amber-400 border-amber-500/20', icon: AlertCircle, text: 'Medium Confidence - Please Review' }
    if (confidence === 'low') config = { style: 'bg-red-500/10 text-red-400 border-red-500/20', icon: AlertCircle, text: 'Low Confidence - Manual Check Required' }

    const Icon = config.icon

    return (
        <div className={`rounded-xl p-4 flex items-center gap-3 border ${config.style}`}>
            <Icon className="w-5 h-5" />
            <span className="font-medium text-sm">{config.text}</span>
        </div>
    )
}

function LoadingState() {
    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center">
            <div className="text-center">
                <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-4" />
                <p className="text-slate-400 font-medium">Loading claim details...</p>
            </div>
        </div>
    )
}

function NotFoundState({ navigate }) {
    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
            <div className="text-center max-w-md">
                <div className="w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/10">
                    <Search className="w-8 h-8 text-slate-500" />
                </div>
                <h2 className="text-xl font-bold text-white mb-2">Claim Not Found</h2>
                <p className="text-slate-400 mb-6">The claim you are looking for doesn't exist or has been deleted.</p>
                <button
                    onClick={() => navigate('/dashboard')}
                    className="bg-white text-slate-950 px-6 py-2.5 rounded-xl font-bold hover:bg-slate-200 transition-colors"
                >
                    Return to Dashboard
                </button>
            </div>
        </div>
    )
}

function ProcessingState({ status, error }) {
    const isFailed = status === 'failed'
    return (
        <div className="bg-slate-900/50 backdrop-blur-md rounded-3xl border border-white/10 p-12 text-center max-w-2xl mx-auto shadow-xl">
            <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${isFailed ? 'bg-red-500/10 text-red-500' : 'bg-blue-500/10 text-blue-500'}`}>
                {isFailed ? <AlertCircle className="w-10 h-10" /> : <Activity className="w-10 h-10 animate-pulse" />}
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">
                {isFailed ? 'Processing Failed' : 'Analyzing Claim...'}
            </h2>
            <p className="text-slate-400 max-w-md mx-auto leading-relaxed">
                {isFailed
                    ? `We encountered an issue processing this claim: ${error}`
                    : 'Our AI is extracting data and auditing this claim against policy guidelines. This usually takes 10-20 seconds.'}
            </p>
        </div>
    )
}
