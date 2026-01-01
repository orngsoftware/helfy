const StatsCard = (props: any) => {
    const { title, data, iconSrc } = props

    return (
        <div className="card" style={{
            width: 100,
            padding: 5,
            alignItems: "center"
        }}>
            <img src={iconSrc} className="pixelated-img" style={{marginTop: 20}} height={24}/>
            <h2 className="pixel-sans">{data}</h2>
            <p style={{color: "var(--dark-grey-color)", marginBottom: 10, marginTop: 0}}>{title}</p>
        </div>
    )
}

export default StatsCard