const SmallStreak = (props: any) => {
    const { streak, status, bgColor} = props

    const imgSrc = status === "kept" ? "/assets/icons/lightning.png" : "/assets/icons/cloudicon.png"

    return (
        <div className="icon-row w-bg" style={{backgroundColor: bgColor}}>
            <img src={imgSrc} style={{height: 20}}/>
            <p className="pixel-sans">{streak}</p>
        </div>
    )
}

export default SmallStreak;