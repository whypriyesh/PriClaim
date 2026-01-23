export function Badge({ children, variant = 'default', className = '' }) {
  const variants = {
    default: 'bg-white border border-slate-200 text-slate-600',
    success: 'bg-green-100 text-green-700',
    warning: 'bg-yellow-100 text-yellow-700',
    danger: 'bg-red-100 text-red-700',
    primary: 'bg-blue-100 text-blue-700',
  }

  return (
    <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium ${variants[variant]} ${className}`}>
      {children}
    </span>
  )
}