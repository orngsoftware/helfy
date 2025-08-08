const StatsCard = (props: any) => {
    const { bgColor, color, title, data, iconD } = props

    return (
        <div className="card" style={{
            backgroundColor: bgColor,
            width: 87,
            height: 90,
            padding: 5,
            alignItems: "center"
        }}>
            <p className="sm-heading" style={{color: color}}>{title}</p>
            <div className="icon-row">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill={color} viewBox="0 0 256 256"><path d={iconD}></path></svg>
                <h2>{data}</h2>
            </div>
        </div>
    )
}

export default StatsCard