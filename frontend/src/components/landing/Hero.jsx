import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Play, CheckCircle, AlertCircle, Clock } from 'lucide-react'

export default function Hero() {
  return (
    <header className="pt-32 pb-20 lg:pt-48 lg:pb-32 relative overflow-hidden">



      <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
        {/* Trust Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-2 rounded-full mb-8 backdrop-blur-md"
        >
          <div className="flex -space-x-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className={`w-6 h-6 rounded-full border-2 border-slate-950 bg-slate-800 flex items-center justify-center text-[10px] text-white`}>
                <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="" className="w-full h-full rounded-full opacity-80" />
              </div>
            ))}
          </div>
          <span className="text-xs font-medium text-slate-300">Trusted by 200+ Hospitals</span>
        </motion.div>

        {/* Spotlight Effect */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-blue-500/20 rounded-full blur-[120px] pointer-events-none mix-blend-screen" />

        {/* Headline */}
        <div className="relative z-10 mb-6">
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-5xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.1]"
          >
            Maximize Revenue with <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 via-blue-400 to-indigo-400 animate-gradient-x inline-block">
              {Array.from("AI-Driven Claim Audits").map((char, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.05, type: "spring", stiffness: 200 }}
                  className="inline-block"
                >
                  {char === " " ? "\u00A0" : char}
                </motion.span>
              ))}
            </span>
          </motion.h1>
        </div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-lg lg:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Automatically audit medical claims against policy clauses in seconds. Prevent denials, ensure compliance,
          and optimize your hospital's revenue cycle with 99.9% accuracy.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20"
        >
          <Link
            to="/login"
            className="h-12 px-8 rounded-full bg-white text-slate-950 font-semibold text-lg hover:bg-slate-200 transition-colors flex items-center gap-2"
          >
            Start Auditing Free <ArrowRight className="w-5 h-5" />
          </Link>
          <a
            href="#how-it-works"
            className="h-12 px-8 rounded-full bg-white/5 border border-white/10 text-white font-semibold text-lg hover:bg-white/10 transition-colors flex items-center gap-2 backdrop-blur-sm"
          >
            <Play className="w-5 h-5 fill-current" /> Watch Demo
          </a>
        </motion.div>

        {/* Dashboard Preview - Floating Dark Glass */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.7 }}
        >
          <DashboardPreview />
        </motion.div>
      </div>
    </header>
  )
}

function DashboardPreview() {
  const claims = [
    { id: 'CLM-2024-001', patient: 'Sarah Connor', amount: '$12,450.00', risk: 15, status: 'Approved', statusColor: 'green' },
    { id: 'CLM-2024-002', patient: 'John Smith', amount: '$45,200.00', risk: 88, status: 'Flagged', statusColor: 'red' },
    { id: 'CLM-2024-003', patient: 'Emily Davis', amount: '$3,150.00', risk: 45, status: 'Review', statusColor: 'yellow' },
  ]

  const getRiskColor = (risk) => {
    if (risk <= 30) return { bar: 'bg-emerald-500', text: 'text-emerald-400', label: 'Low' }
    if (risk <= 70) return { bar: 'bg-amber-500', text: 'text-amber-400', label: 'Med' }
    return { bar: 'bg-red-500', text: 'text-red-400', label: 'High' }
  }

  const getStatusStyles = (color) => ({
    green: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
    yellow: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
    red: 'bg-red-500/10 text-red-400 border border-red-500/20',
  }[color])

  return (
    <div className="relative mx-auto max-w-5xl group">
      {/* Glow Effect behind the card */}
      <div className="absolute -inset-1 bg-gradient-to-b from-white/20 to-transparent rounded-[2rem] opacity-30 blur-2xl group-hover:opacity-40 transition-opacity duration-700" />

      {/* Dashboard Card - Dark Theme */}
      <div className="relative bg-slate-900/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 overflow-hidden ring-1 ring-white/10">
        {/* Window Bar */}
        <div className="bg-slate-900 border-b border-white/5 px-4 py-3 flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-slate-700" />
            <div className="w-3 h-3 rounded-full bg-slate-700" />
            <div className="w-3 h-3 rounded-full bg-slate-700" />
          </div>
          <div className="flex-1 text-center text-xs text-slate-500 font-medium font-mono">
            PriClaim_Audit_V2.0
          </div>
        </div>

        <div className="p-6 md:p-8 grid grid-cols-12 gap-6 text-left">
          {/* Sidebar */}
          <div className="col-span-3 lg:col-span-2 hidden md:block space-y-1 border-r border-white/5 pr-6">
            <SidebarItem icon={<div className="w-4 h-4 rounded bg-white/20" />} label="Overview" active />
            <SidebarItem icon={<div className="w-4 h-4 rounded border border-white/20" />} label="Claims" />
            <SidebarItem icon={<div className="w-4 h-4 rounded border border-white/20" />} label="Reports" />
            <SidebarItem icon={<div className="w-4 h-4 rounded border border-white/20" />} label="Settings" />
          </div>

          {/* Main Content */}
          <div className="col-span-12 md:col-span-9 lg:col-span-10">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-white">Recent Claims Audit</h3>
              <div className="flex gap-3">
                <div className="h-8 w-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-400">
                  <Clock className="w-4 h-4" />
                </div>
                <div className="h-8 px-3 rounded-lg bg-white text-slate-950 text-xs font-bold flex items-center">
                  New Audit
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-slate-500 uppercase bg-white/5">
                  <tr>
                    <th className="px-4 py-3 rounded-l-lg">Claim ID</th>
                    <th className="px-4 py-3">Patient</th>
                    <th className="px-4 py-3">Amount</th>
                    <th className="px-4 py-3">Risk Score</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 rounded-r-lg">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {claims.map((claim) => {
                    const riskStyle = getRiskColor(claim.risk)
                    return (
                      <tr key={claim.id} className="hover:bg-white/5 transition-colors">
                        <td className="px-4 py-3 font-medium text-slate-200 font-mono text-xs">{claim.id}</td>
                        <td className="px-4 py-3 text-slate-400">{claim.patient}</td>
                        <td className="px-4 py-3 text-slate-300 font-mono">{claim.amount}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-16 bg-slate-800 rounded-full h-1.5 overflow-hidden">
                              <div className={`${riskStyle.bar} h-1.5 rounded-full`} style={{ width: `${claim.risk}%` }} />
                            </div>
                            <span className={`${riskStyle.text} font-bold text-xs`}>
                              {riskStyle.label}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`${getStatusStyles(claim.statusColor)} px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider`}>
                            {claim.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-slate-600">
                          <div className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors text-slate-400">
                            •••
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function SidebarItem({ icon, label, active = false }) {
  return (
    <div className={`flex items-center gap-3 px-3 py-2 rounded-lg font-medium text-sm cursor-pointer transition-all
      ${active
        ? 'bg-white/10 text-white'
        : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
      }`}
    >
      {icon}
      {label}
    </div>
  )
}