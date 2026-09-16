import { motion, useReducedMotion } from 'framer-motion'
import { easeOut } from '../../lib/motion.js'

export default function Reveal({ children, className = '', delay = 0, y = 28 }) {
  const reduce = useReducedMotion()

  if (reduce) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y, filter: 'blur(7px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, amount: 0.16, margin: '0px 0px -8% 0px' }}
      transition={{ duration: 0.75, delay: delay / 1000, ease: easeOut }}
    >
      {children}
    </motion.div>
  )
}
