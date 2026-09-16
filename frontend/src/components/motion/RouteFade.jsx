import { motion, useReducedMotion } from 'framer-motion'
import { useLocation } from 'react-router-dom'
import { easeOut } from '../../lib/motion.js'

export default function RouteFade({ children, className = '' }) {
  const { pathname, search } = useLocation()
  const reduce = useReducedMotion()
  const key = `${pathname}${search}`

  if (reduce) return <div className={className}>{children}</div>

  return (
    <motion.div
      key={key}
      className={className}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.48, ease: easeOut }}
    >
      {children}
    </motion.div>
  )
}
