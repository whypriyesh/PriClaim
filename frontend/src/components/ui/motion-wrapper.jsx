import { motion } from 'framer-motion'

export const FadeIn = ({ children, delay = 0, className = "" }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.5, delay, ease: "easeOut" }}
        className={className}
    >
        {children}
    </motion.div>
)

export const StaggerContainer = ({ children, delay = 0, staggerChildren = 0.1, className = "" }) => (
    <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-50px" }}
        variants={{
            hidden: {},
            show: {
                transition: {
                    staggerChildren: staggerChildren,
                    delayChildren: delay,
                },
            },
        }}
        className={className}
    >
        {children}
    </motion.div>
)

export const StaggerItem = ({ children, className = "" }) => (
    <motion.div
        variants={{
            hidden: { opacity: 0, y: 20 },
            show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
        }}
        className={className}
    >
        {children}
    </motion.div>
)

export const ScaleOnHover = ({ children, className = "" }) => (
    <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
        className={className}
    >
        {children}
    </motion.div>
)
