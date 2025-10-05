import { motion } from "motion/react"

const ProgressBar = (props: any) => {
    const { maxValue, value, valueName } = props
    const fillWidth = Math.floor((value / maxValue) * 100)

    return (
        <div className="row" style={{width: "100%"}}>
            <div className="progress-bar">
                <motion.div
                    initial={{width: 0}} 
                    animate={{width: `${fillWidth}%`}}
                    transition={{ duration: 0.8, ease: "easeInOut"}}
                    className="progress-bar" 
                    style={{backgroundColor: "var(--dark-blue-color)"}}>
                        <div className="bar-shine"></div>
                </motion.div>
            </div>
            {valueName ? 
            (<p className="sm-heading" style={{width: 100}}>{`${valueName} ${value}/${maxValue}`}</p>)
            : ""}
        </div>
    )
}

export default ProgressBar