const Divider = (props: any) => {
    const { text, color } = props
    return (
        <div className="divider">
            <div className="hl" style={{backgroundColor: color}}></div>
            {text ? (
                <p>{text}</p>
            ) : ""}
            <div className="hl" style={{backgroundColor: color}}></div>
        </div>
    )
}

export default Divider;