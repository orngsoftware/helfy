import ProgressBar from "./ProgressBar";

const Companion = ({ stage, type, accessories }: {stage: number, type: string, accessories: Array<object>}) => {
    return (
        <div className="col center">
            <div className="companion">
                {accessories.map((item: any) => (
                    item.shown ?
                    <img className="companion-element" style={{zIndex: item.level}} src={`/src/assets/accessories/${item.accessory_id}.svg`}/>
                    : ""
                ))}
                <img className="companion-base" src={`/src/assets/companions/${type}${stage}.svg`}/>
            </div>
            <ProgressBar maxValue={8} value={stage} />
        </div>
    )
}

export default Companion;
