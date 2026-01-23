import { Link } from 'react-router-dom'

export function Button({ 
  children, 
  variant = 'primary', 
  size = 'md',
  href,
  to,
  className = '',
  ...props 
}) {
  const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-full transition-all duration-300'
  
  const variants = {
    primary: 'bg-primary hover:bg-primary-hover text-white shadow-xl shadow-primary/25',
    secondary: 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200',
    ghost: 'bg-slate-100 hover:bg-slate-200 text-slate-900',
  }
  
  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-sm',
    lg: 'px-8 py-4 text-base',
  }

  const classes = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`

  if (to) {
    return <Link to={to} className={classes} {...props}>{children}</Link>
  }
  
  if (href) {
    return <a href={href} className={classes} {...props}>{children}</a>
  }

  return <button className={classes} {...props}>{children}</button>
}