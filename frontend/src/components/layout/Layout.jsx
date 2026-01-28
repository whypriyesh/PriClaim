import { Toaster } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'
import { useLocation } from 'react-router-dom'

export default function Layout({ children }) {
    const location = useLocation()

    return (
        <>
            <Toaster
                position="top-right"
                richColors
                closeButton
                theme="dark"
                className="font-body"
            />
            <AnimatePresence mode="wait">
                <motion.div
                    key={location.pathname}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                    {children}
                </motion.div>
            </AnimatePresence>
        </>
    )
}
