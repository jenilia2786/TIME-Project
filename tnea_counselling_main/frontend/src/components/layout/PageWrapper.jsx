import { motion } from 'framer-motion'
import useThemeStore from '../../store/useThemeStore'

function PageWrapper({ children, className = '' }) {
  const collapsed = useThemeStore((s) => s.sidebarCollapsed)

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3 }}
      className={`p-5 pb-24 lg:pt-[88px] lg:pr-7 ${collapsed ? 'lg:pl-20' : 'lg:pl-7'} lg:pb-8 w-full ${className}`}
    >
      {children}
    </motion.div>
  )
}

export default PageWrapper
