import { useState } from "react"
import axiosInstance from "../lib/apiClient"
import { FlyingStar, TickIcon } from "./Icons"
import { motion, AnimatePresence } from "motion/react"

export const SmallPopUp = (props: any) => {
    const {subTitle, title, btnText, closePopUp} = props
    
    return (
        <div className="container popup-overlay">
            <AnimatePresence>
                <motion.div 
                initial={{scale: 0.1}}
                animate={{
                    scale: 1,
                    transition: {duration: 0.5, type: "spring", stiffness: 300, damping: 20}
                }}
                className="card popup">
                    <h3>{title}</h3>
                    <p style={{maxWidth: 250}}>{subTitle}</p>
                    <button className="btn-primary" onClick={closePopUp}>{btnText}</button>
                </motion.div>
            </AnimatePresence>
        </div>
    )
}

export const StorePopUp = (props: any) => {
    const { closePopUp, title, items, onBuy } = props
    const [isOpen, setOpen] = useState(false)

    async function buyItem(itemID: number) {
        try {
            await axiosInstance.post(`/companion/accessories/buy/${itemID}`)
            onBuy(itemID)
        } catch(error: any) {
            if (error.response?.status === 400) {
                setOpen(true)
            } else {
                console.error("Error buying an item: ", error)
            }
        }
    }

    return isOpen ? (<SmallPopUp title="Not enough XP" 
                        subTitle="You don't have enough Action XP to buy this item" 
                        btnText="Okay" closePopUp={() => setOpen(false)} /> ) :
        (<div className="container">
            <div className="card popup store to-bottom">
                <div className="row" style={{width: "100%"}}>
                    <p className="pixel-sans">{title}</p>
                    <svg className="clickable to-right" onClick={closePopUp} xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="var(--black-color)" viewBox="0 0 256 256"><path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z"></path></svg>
                </div>
                <div className="row" style={{maxWidth: "95%", overflowX: "auto"}}>
                    {items.length === 0 ? (
                        <p>You have purchased all accessories</p>
                    ) : (
                        items.map((item: any) =>  (
                        <div className="card" onClick={() => buyItem(item.id)} style={{cursor: "pointer", border: "2px solid var(--grey-color)", alignItems: "center"}}>
                            <img width={80} height={80} src={`/assets/accessories/previews/${item.id}_preview.png`} />
                            <div className="icon-row">
                                <FlyingStar width={16} height={16} />
                                <p className="pixel-sans">{item.price}</p>
                            </div>
                        </div>)
                    ))}
                </div>
            </div>
        </div>)
}

export const InventoryPopUp = ({ closePopUp, items, onChange }: any) => {

    async function changeVisibility(item: any) {
        try {
            await axiosInstance.patch(`/companion/accessories/toggle/${item.accessory_id}`);
            onChange(item.accessory_id);
        } catch (error: any) {
            console.log("Error toggling item visibility: ", error);
        }
  }

    return (
        <div className="container">
            <div className="card popup store to-bottom">
                <div className="row" style={{width: "100%"}}>
                    <p className="pixel-sans">Inventory</p>
                    <svg className="clickable to-right" onClick={closePopUp} xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="var(--black-color)" viewBox="0 0 256 256"><path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z"></path></svg>
                </div>
                <div className="row" style={{maxWidth: "95%", overflowX: "auto"}}>
                    {items.length === 0 ? (
                        <p>You don't have any items</p>
                    ) : (
                        items.map((item: any) =>  (
                        <div className="card" onClick={() => changeVisibility(item)} style={{cursor: "pointer", border: item.shown ? "3px solid var(--dark-blue-color)" : "2px solid var(--dark-grey-color)", alignItems: "center"}}>
                            {item.shown ? (
                                <div className="circle" style={{backgroundColor: "var(--dark-blue-color)"}}>
                                    <TickIcon width={15} height={15} color="white" />
                                </div>
                            ) : ""}
                            <img width={80} height={80} src={`/assets/accessories/previews/${item.accessory_id}_preview.png`} />
                        </div>)
                    ))}
                </div>
            </div>
        </div>
    )
} 