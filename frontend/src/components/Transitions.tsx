import { motion } from 'framer-motion'

const BottomToTop = ({ children }: any) => {
    return (
        <motion.div
        initial={{
            y: 1000,
            opacity: 0
        }}
        animate={{
            y: 0,
            opacity: 1,
            transition: {duration: 0.3}
        }}
        className="color-container"
        >
            {children}
        </motion.div>
    )
}

export default BottomToTop;