import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { Badge } from '../components/ui/Badge'

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
            const headers = {}

            // Add auth token
            const { data: { session } } = await supabase.auth.getSession()
            if (session?.access_token) {
                headers['Authorization'] = `Bearer ${session.access_token}`
            }

            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/claims`, { headers })
            const data = await response.json()

            if (response.ok && data.claims) {
                const foundClaim = data.claims.find(c => c.id === claimId)
                setClaim(foundClaim)
            }
        } catch (err) {
            console.error('Failed to fetch claim:', err)
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="text-slate-600">Loading claim...</div>
            </div>
        )
    }

    if (!claim) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-slate-600 mb-4">Claim not found</p>
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="text-blue-600 hover:text-blue-700"
                    >
                        ← Back to Dashboard
                    </button>
                </div>
            </div>
        )
    }

    const structuredData = claim.extracted_data?.structured_data
    const rawText = claim.extracted_data?.raw_text
    const extractionMethod = claim.extracted_data?.extraction_method

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <header className="bg-white border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-4"
                    >
                        <span className="material-icons-round">arrow_back</span>
                        Back to Dashboard
                    </button>

                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900">Claim Details</h1>
                            <p className="text-sm text-slate-500 mt-1">
                                {claim.file_name} · Uploaded {new Date(claim.created_at).toLocaleDateString()}
                            </p>
                        </div>

                        <div className="flex items-center gap-3">
                            <StatusBadge status={claim.status} />
                            {extractionMethod && (
                                <Badge variant="default">
                                    <span className="material-icons-round text-xs mr-1">
                                        {extractionMethod === 'pdfplumber' ? 'description' : 'photo_camera'}
                                    </span>
                                    {extractionMethod === 'pdfplumber' ? 'Text PDF' : 'OCR Scanned'}
                                </Badge>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-6 py-8">
                {claim.status === 'completed' && structuredData ? (
                    <div className="space-y-6">
                        {/* AI Audit Results - NEW */}
                        {claim.audit_result && (
                            <AuditResultsSection auditResult={claim.audit_result} />
                        )}

                        {/* Extraction Confidence */}
                        <ConfidenceBanner confidence={structuredData.extraction_confidence} />

                        {/* Structured Data Cards */}
                        <div className="grid md:grid-cols-2 gap-6">
                            {/* Hospital Info */}
                            <InfoCard
                                icon="local_hospital"
                                title="Hospital Information"
                                value={structuredData.hospital_name || 'Not detected'}
                                empty={!structuredData.hospital_name}
                            />

                            {/* Patient Info */}
                            <InfoCard
                                icon="person"
                                title="Patient Name"
                                value={structuredData.patient_name || 'Not detected'}
                                empty={!structuredData.patient_name}
                            />
                        </div>

                        {/* Claim Items */}
                        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                            <div className="px-6 py-4 border-b border-slate-100">
                                <h2 className="font-semibold text-slate-900 flex items-center gap-2">
                                    <span className="material-icons-round">receipt_long</span>
                                    Claim Line Items
                                </h2>
                            </div>

                            {structuredData.claim_items && structuredData.claim_items.length > 0 ? (
                                <div className="divide-y divide-slate-100">
                                    {structuredData.claim_items.map((item, idx) => (
                                        <div key={idx} className="px-6 py-4 flex justify-between items-center">
                                            <span className="text-slate-700">{item.description}</span>
                                            <span className="font-semibold text-slate-900">₹{item.amount.toLocaleString()}</span>
                                        </div>
                                    ))}

                                    {/* Total */}
                                    <div className="px-6 py-4 bg-slate-50 flex justify-between items-center">
                                        <span className="font-semibold text-slate-900">Total Claimed</span>
                                        <span className="text-xl font-bold text-primary">
                                            ₹{structuredData.total_claimed?.toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                            ) : (
                                <div className="px-6 py-12 text-center text-slate-500">
                                    <span className="material-icons-round text-4xl text-slate-300 mb-2">inbox</span>
                                    <p>No line items detected</p>
                                </div>
                            )}
                        </div>

                        {/* Raw Text Toggle */}
                        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                            <button
                                onClick={() => setShowRawText(!showRawText)}
                                className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition"
                            >
                                <span className="font-semibold text-slate-900 flex items-center gap-2">
                                    <span className="material-icons-round">article</span>
                                    Extracted Text (Raw)
                                </span>
                                <span className={`material-icons-round transition-transform ${showRawText ? 'rotate-180' : ''}`}>
                                    expand_more
                                </span>
                            </button>

                            {showRawText && rawText && (
                                <div className="px-6 py-4 border-t border-slate-100">
                                    <pre className="text-sm text-slate-600 whitespace-pre-wrap font-mono bg-slate-50 p-4 rounded-lg max-h-96 overflow-y-auto">
                                        {rawText}
                                    </pre>
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
                        <span className="material-icons-round text-5xl text-slate-300 mb-4">
                            {claim.status === 'failed' ? 'error' : 'hourglass_empty'}
                        </span>
                        <p className="text-slate-600">
                            {claim.status === 'failed'
                                ? `Processing failed: ${claim.error_message}`
                                : 'Claim is still processing...'}
                        </p>
                    </div>
                )}
            </main>
        </div>
    )
}

function StatusBadge({ status }) {
    const config = {
        queued: { style: 'bg-yellow-100 text-yellow-700', icon: 'schedule', label: 'Queued' },
        text_extraction: { style: 'bg-blue-100 text-blue-700', icon: 'description', label: 'Extracting' },
        completed: { style: 'bg-green-100 text-green-700', icon: 'check_circle', label: 'Completed' },
        failed: { style: 'bg-red-100 text-red-700', icon: 'error', label: 'Failed' },
    }[status] || { style: 'bg-slate-100 text-slate-600', icon: 'help', label: status }

    return (
        <span className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium ${config.style}`}>
            <span className="material-icons-round text-sm">{config.icon}</span>
            {config.label}
        </span>
    )
}

function ConfidenceBanner({ confidence }) {
    const config = {
        high: { style: 'bg-green-50 border-green-200 text-green-700', icon: 'check_circle', text: 'High confidence extraction' },
        medium: { style: 'bg-yellow-50 border-yellow-200 text-yellow-700', icon: 'warning', text: 'Medium confidence - review recommended' },
        low: { style: 'bg-orange-50 border-orange-200 text-orange-700', icon: 'info', text: 'Low confidence - manual review required' },
        none: { style: 'bg-red-50 border-red-200 text-red-700', icon: 'error', text: 'Extraction failed - no data found' },
    }[confidence] || { style: 'bg-slate-50 border-slate-200 text-slate-600', icon: 'help', text: 'Unknown confidence' }

    return (
        <div className={`border rounded-xl p-4 flex items-center gap-3 ${config.style}`}>
            <span className="material-icons-round">{config.icon}</span>
            <span className="font-medium">{config.text}</span>
        </div>
    )
}

function InfoCard({ icon, title, value, empty }) {
    return (
        <div className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                    <span className="material-icons-round text-blue-600">{icon}</span>
                </div>
                <h3 className="font-semibold text-slate-700">{title}</h3>
            </div>
            <p className={`text-lg ${empty ? 'text-slate-400 italic' : 'text-slate-900 font-medium'}`}>
                {value}
            </p>
        </div>
    )
}

// AI Audit Results Section
function AuditResultsSection({ auditResult }) {
    if (!auditResult) return null

    const { verdict, risk_score, findings = [], explanation, confidence } = auditResult

    // Verdict styling
    const verdictConfig = {
        'APPROVED': { style: 'bg-green-100 text-green-700 border-green-200', icon: 'check_circle', label: 'Approved' },
        'PARTIALLY_APPROVED': { style: 'bg-yellow-100 text-yellow-700 border-yellow-200', icon: 'warning', label: 'Partially Approved' },
        'REJECTED': { style: 'bg-red-100 text-red-700 border-red-200', icon: 'cancel', label: 'Rejected' },
        'NEEDS_REVIEW': { style: 'bg-blue-100 text-blue-700 border-blue-200', icon: 'info', label: 'Needs Review' },
    }

    const config = verdictConfig[verdict] || verdictConfig['NEEDS_REVIEW']

    // Risk score color
    const getRiskColor = (score) => {
        if (score < 30) return 'text-green-600'
        if (score < 70) return 'text-yellow-600'
        return 'text-red-600'
    }

    const getRiskBg = (score) => {
        if (score < 30) return 'from-green-500 to-green-600'
        if (score < 70) return 'from-yellow-500 to-yellow-600'
        return 'from-red-500 to-red-600'
    }

    return (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border-2 border-blue-200 p-6">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                    <span className="material-icons-round text-white">psychology</span>
                </div>
                <div>
                    <h2 className="text-xl font-bold text-slate-900">AI Audit Results</h2>
                    <p className="text-sm text-slate-600">Powered by Groq Mixtral-8x7B</p>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                {/* Risk Score Gauge */}
                <div className="bg-white rounded-xl p-6">
                    <h3 className="font-semibold text-slate-700 mb-4">Risk Assessment</h3>
                    <div className="flex items-center justify-center">
                        <div className="relative w-32 h-32">
                            <svg className="transform -rotate-90 w-32 h-32">
                                <circle cx="64" cy="64" r="56" stroke="#e2e8f0" strokeWidth="8" fill="none" />
                                <circle
                                    cx="64"
                                    cy="64"
                                    r="56"
                                    stroke="url(#riskGradient)"
                                    strokeWidth="8"
                                    fill="none"
                                    strokeDasharray={`${(risk_score / 100) * 352} 352`}
                                    strokeLinecap="round"
                                />
                                <defs>
                                    <linearGradient id="riskGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" className={`${getRiskBg(risk_score).split(' ')[0]}`} />
                                        <stop offset="100%" className={`${getRiskBg(risk_score).split(' ')[1]}`} />
                                    </linearGradient>
                                </defs>
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center flex-col">
                                <span className={`text-3xl font-bold ${getRiskColor(risk_score)}`}>{risk_score}</span>
                                <span className="text-xs text-slate-500">Risk Score</span>
                            </div>
                        </div>
                    </div>
                    <p className="text-center text-sm text-slate-600 mt-4">
                        {risk_score < 30 ? 'Low Risk' : risk_score < 70 ? 'Medium Risk' : 'High Risk'}
                    </p>
                </div>

                {/* Verdict */}
                <div className="bg-white rounded-xl p-6">
                    <h3 className="font-semibold text-slate-700 mb-4">Verdict</h3>
                    <div className={`border-2 rounded-xl p-4 ${config.style}`}>
                        <div className="flex items-center gap-3">
                            <span className="material-icons-round text-4xl">{config.icon}</span>
                            <div>
                                <p className="text-2xl font-bold">{config.label}</p>
                                {confidence !== undefined && (
                                    <p className="text-sm opacity-75 mt-1">
                                        Confidence: {Math.round(confidence * 100)}%
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* AI Explanation */}
            {explanation && (
                <div className="bg-white rounded-xl p-6 mt-6">
                    <div className="flex items-center gap-2 mb-3">
                        <span className="material-icons-round text-blue-600">lightbulb</span>
                        <h3 className="font-semibold text-slate-900">AI Explanation</h3>
                    </div>
                    <p className="text-slate-700 leading-relaxed">{explanation}</p>
                </div>
            )}

            {/* Findings */}
            {findings.length > 0 && (
                <div className="bg-white rounded-xl p-6 mt-6">
                    <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                        <span className="material-icons-round">assignment</span>
                        Findings ({findings.length})
                    </h3>
                    <div className="space-y-3">
                        {findings.map((finding, idx) => (
                            <FindingCard key={idx} finding={finding} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

function FindingCard({ finding }) {
    const { type, severity, description } = finding

    const severityConfig = {
        high: { style: 'bg-red-50 border-red-200 text-red-700', icon: 'error' },
        medium: { style: 'bg-yellow-50 border-yellow-200 text-yellow-700', icon: 'warning' },
        low: { style: 'bg-blue-50 border-blue-200 text-blue-700', icon: 'info' },
    }

    const config = severityConfig[severity] || severityConfig.medium

    const typeLabels = {
        exclusion: 'Exclusion',
        waiting_period: 'Waiting Period',
        missing_document: 'Missing Document',
        policy_limit: 'Policy Limit',
        pre_existing: 'Pre-existing Condition',
        other: 'Other'
    }

    return (
        <div className={`border rounded-lg p-4 ${config.style}`}>
            <div className="flex gap-3">
                <span className="material-icons-round text-xl">{config.icon}</span>
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium">{typeLabels[type] || type}</span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-white/50">
                            {severity} severity
                        </span>
                    </div>
                    <p className="text-sm opacity-90">{description}</p>
                </div>
            </div>
        </div>
    )
}
