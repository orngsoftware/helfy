const Companion = ({ accessories, companionSRC }: {accessories: Array<object>, companionSRC: string}) => {
    return (
        <div className="col center">
            <div className="companion">
                {accessories.map((item: any) => (
                    item.shown ? (
                    <img className="companion-element" style={{zIndex: item.level}} src={item.url}/>
                    ) : ""
                ))}
                <img className="companion-base" src={companionSRC}/> 
            </div>
        </div>
    )
}

export default Companion;
