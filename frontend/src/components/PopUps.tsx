import { useState } from "react"
import axiosInstance from "../lib/apiClient"
import { TickIcon } from "./Icons"

export const SmallPopUp = (props: any) => {
    const {subTitle, title, btnText, closePopUp} = props
    
    return (
        <div className="container popup-overlay">
            <div className="card popup">
                <h3>{title}</h3>
                <p style={{maxWidth: 250}}>{subTitle}</p>
                <button className="btn-primary" onClick={closePopUp}>{btnText}</button>
            </div>
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
            <div className="card popup store">
                <p className="sm-heading">{title}</p>
                <div><svg className="close-icon clickable" onClick={closePopUp} xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="var(--black-color)" viewBox="0 0 256 256"><path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z"></path></svg></div>
                <div className="row" style={{maxWidth: "95%", overflowX: "auto"}}>
                    {items.length === 0 ? (
                        <p>You have purchased all accessories</p>
                    ) : (
                        items.map((item: any) =>  (
                        <div className="card clickable" onClick={() => buyItem(item.id)} style={{border: "2px solid var(--dark-grey-color)", alignItems: "center"}}>
                            <img width={80} height={80} src={`/assets/accessories/previews/${item.id}_preview.png`} />
                            <div className="icon-row">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="var(--dark-yellow-color)" viewBox="0 0 256 256"><path d="M235.24,84.38l-28.06,23.68,8.56,35.39a13.34,13.34,0,0,1-5.09,13.91,13.54,13.54,0,0,1-15,.69L164,139l-31.65,19.06a13.51,13.51,0,0,1-15-.69,13.32,13.32,0,0,1-5.1-13.91l8.56-35.39L92.76,84.38a13.39,13.39,0,0,1,7.66-23.58l36.94-2.92,14.21-33.66a13.51,13.51,0,0,1,24.86,0l14.21,33.66,36.94,2.92a13.39,13.39,0,0,1,7.66,23.58ZM88.11,111.89a8,8,0,0,0-11.32,0L18.34,170.34a8,8,0,0,0,11.32,11.32l58.45-58.45A8,8,0,0,0,88.11,111.89Zm-.5,61.19L34.34,226.34a8,8,0,0,0,11.32,11.32l53.26-53.27a8,8,0,0,0-11.31-11.31Zm73-1-54.29,54.28a8,8,0,0,0,11.32,11.32l54.28-54.28a8,8,0,0,0-11.31-11.32Z"></path></svg>
                                <p className="sm-heading" style={{color: "var(--dark-yellow-color)"}}>{item.price}</p>
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
            <div className="card popup store">
                <p className="sm-heading">Inventory</p>
                <div><svg className="close-icon clickable" onClick={closePopUp} xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="var(--black-color)" viewBox="0 0 256 256"><path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z"></path></svg></div>
                <div className="row" style={{maxWidth: "95%", overflowX: "auto"}}>
                    {items.length === 0 ? (
                        <p>You don't have any items</p>
                    ) : (
                        items.map((item: any) =>  (
                        <div className="card clickable" onClick={() => changeVisibility(item)} style={{border: item.shown ? "3px solid var(--dark-blue-color)" : "2px solid var(--dark-grey-color)", alignItems: "center"}}>
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