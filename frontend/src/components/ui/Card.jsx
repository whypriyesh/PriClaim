export function Card({ children, className = '', hover = true }) {
  return (
    <div className={`
      bg-white p-8 rounded-2xl shadow-soft border border-slate-100
      ${hover ? 'hover:shadow-xl hover:-translate-y-1 transition-all duration-300' : ''}
      ${className}
    `}>
      {children}
    </div>
  )
}

export function FeatureCard({ icon, title, description, iconBg = 'bg-blue-50', iconColor = 'text-blue-600' }) {
  return (
    <Card>
      <div className={`w-14 h-14 ${iconBg} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
        <span className={`material-icons-round text-3xl ${iconColor}`}>{icon}</span>
      </div>
      <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
      <p className="text-slate-600 leading-relaxed">{description}</p>
    </Card>
  )
}