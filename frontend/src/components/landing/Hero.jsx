import { Button } from '../ui/button'

export default function Hero() {
  return (
    <header className="pt-32 pb-20 lg:pt-48 lg:pb-32 hero-bg relative overflow-hidden">
      {/* Aurora Background Blobs */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl" />
      <div className="absolute top-1/3 -right-20 w-[500px] h-[500px] bg-indigo-200/30 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
        {/* Trust Badge */}
        <div className="inline-flex items-center gap-2 bg-white border border-slate-200 px-3 py-1.5 rounded-full mb-8 shadow-sm">
          <div className="flex -space-x-2">
            <img alt="User" className="w-6 h-6 rounded-full border-2 border-white" src="https://i.pravatar.cc/100?img=1" />
            <img alt="User" className="w-6 h-6 rounded-full border-2 border-white" src="https://i.pravatar.cc/100?img=2" />
            <img alt="User" className="w-6 h-6 rounded-full border-2 border-white" src="https://i.pravatar.cc/100?img=3" />
          </div>
          <span className="text-xs font-medium text-slate-600">Trusted by 200+ Hospitals</span>
        </div>

        {/* Headline */}
        <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight text-slate-900 mb-6 leading-[1.1]">
          Maximize Revenue with <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
            AI-Driven Claim Audits
          </span>
        </h1>

        <p className="text-lg lg:text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed">
          Automatically audit medical claims against policy clauses in seconds. Prevent denials, ensure compliance, 
          and optimize your hospital's revenue cycle with 99.9% accuracy.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
          <Button to="/login" size="lg">Start Auditing Free</Button>
          <Button href="#how-it-works" variant="secondary" size="lg">
            <span className="material-icons-round text-lg mr-2">play_circle_outline</span>
            Watch Demo
          </Button>
        </div>

        {/* Dashboard Preview */}
        <DashboardPreview />
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
    if (risk <= 30) return { bar: 'bg-green-500', text: 'text-green-600', label: 'Low' }
    if (risk <= 70) return { bar: 'bg-yellow-500', text: 'text-yellow-600', label: 'Med' }
    return { bar: 'bg-red-500', text: 'text-red-600', label: 'High' }
  }

  const getStatusStyles = (color) => ({
    green: 'bg-green-100 text-green-700',
    yellow: 'bg-yellow-100 text-yellow-700',
    red: 'bg-red-100 text-red-700',
  }[color])

  return (
    <div className="relative mx-auto max-w-5xl">
      {/* Glow Effect */}
      <div className="absolute -inset-4 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-[2rem] opacity-20 blur-xl" />
      
      {/* Dashboard Card */}
      <div className="relative bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Window Bar */}
        <div className="bg-slate-50 border-b border-slate-200 px-4 py-3 flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-400" />
            <div className="w-3 h-3 rounded-full bg-yellow-400" />
            <div className="w-3 h-3 rounded-full bg-green-400" />
          </div>
          <div className="flex-1 text-center text-xs text-slate-400 font-medium">
            PriClaim Dashboard - Audit Overview
          </div>
        </div>

        <div className="p-6 md:p-8 grid grid-cols-12 gap-6 text-left">
          {/* Sidebar */}
          <div className="col-span-3 lg:col-span-2 hidden md:block space-y-1 border-r border-slate-100 pr-6">
            <SidebarItem icon="dashboard" label="Overview" active />
            <SidebarItem icon="description" label="Claims" />
            <SidebarItem icon="analytics" label="Reports" />
            <SidebarItem icon="settings" label="Settings" />
          </div>

          {/* Main Content */}
          <div className="col-span-12 md:col-span-9 lg:col-span-10">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-slate-800">Recent Claims Audit</h3>
              <div className="flex gap-2">
                <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-500">
                  <span className="material-icons-round">filter_list</span>
                </button>
                <button className="bg-primary text-white px-4 py-1.5 rounded-lg text-sm font-medium">
                  New Audit
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-slate-500 uppercase bg-slate-50">
                  <tr>
                    <th className="px-4 py-3 rounded-l-lg">Claim ID</th>
                    <th className="px-4 py-3">Patient</th>
                    <th className="px-4 py-3">Amount</th>
                    <th className="px-4 py-3">Risk Score</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 rounded-r-lg">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {claims.map((claim) => {
                    const riskStyle = getRiskColor(claim.risk)
                    return (
                      <tr key={claim.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-4 py-3 font-medium text-slate-900">{claim.id}</td>
                        <td className="px-4 py-3 text-slate-600">{claim.patient}</td>
                        <td className="px-4 py-3 text-slate-600">{claim.amount}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-16 bg-slate-200 rounded-full h-1.5 overflow-hidden">
                              <div className={`${riskStyle.bar} h-1.5 rounded-full`} style={{ width: `${claim.risk}%` }} />
                            </div>
                            <span className={`${riskStyle.text} font-semibold text-xs`}>
                              {riskStyle.label} ({claim.risk}%)
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`${getStatusStyles(claim.statusColor)} px-2 py-1 rounded-md text-xs font-medium`}>
                            {claim.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-slate-400">
                          <span className="material-icons-round text-base cursor-pointer hover:text-primary">more_vert</span>
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
    <div className={`flex items-center gap-3 px-3 py-2 rounded-lg font-medium text-sm cursor-pointer transition-colors
      ${active 
        ? 'bg-blue-50 text-blue-600' 
        : 'text-slate-500 hover:bg-slate-50'
      }`}
    >
      <span className="material-icons-round text-sm">{icon}</span>
      {label}
    </div>
  )
}