import { useEffect, useState } from "react"
import StatsCard from "../components/StatsCard"
import axiosInstance from "../lib/apiClient"
import { getStyling } from "../components/Streak"
import Companion from "../components/Companion"
import { InventoryPopUp, StorePopUp } from "../components/PopUps"
import { AnimatePresence, motion } from "motion/react"
import Loading from "../components/Loading"
import { useNavigate } from "react-router-dom"

const CompanionPage = () => {
    const [data, setData] = useState({
        xp: 0,
        learning_xp: 0,
        streak: 0,
        status: "lost",
        stage: 0,
        inventoryItems: []
    })
    const [isStoreOpen, setOpen] = useState(false)
    const [isInventoryOpen, setInventoryOpen] = useState(false)
    const [isLoading, setLoading] = useState(true)

    const [companionType, setCompanionType] = useState("")
    const [accessories, setAccessories] = useState<object[]>([])
    const [storeItems, setStoreItems] = useState([])

    const navigate = useNavigate()

    const streakStyle = getStyling(data.status)
    
    async function fetchData() {
        setLoading(true)
        try {
            const xpResponse = await axiosInstance.get("/users/stats/xp")
            const learningXPResponse = await axiosInstance.get("/users/stats/xp?learning=True")
            const streakResponse = await axiosInstance.get("/users/stats/streak")
            const storeResponse = await axiosInstance.get("/companion/accessories")
            const inventoryResponse = await axiosInstance.get("/companion/accessories?inventory=True")
            const companionResponse = await axiosInstance.get("/companion")

            setData({
                xp: xpResponse.data.xp,
                learning_xp: learningXPResponse.data.xp,
                streak: streakResponse.data.result.streak,
                status: streakResponse.data.result.status,
                stage: companionResponse.data.companion.stage,
                inventoryItems: inventoryResponse.data.accessories
            })
            setCompanionType(companionResponse.data.companion.type)
            setAccessories(companionResponse.data.companion.accessories)
            setStoreItems(storeResponse.data.accessories)
        } catch(error: any) {
            console.error("Error fetching stats: ", error)
        } finally {
            setLoading(false)
        }
        return;
    }

    const handleBuy = (itemID: number) => {
        setStoreItems(prev => prev.filter((i:any) => i.id !== itemID))
        setAccessories(prev => prev.filter((i:any) => i.id !== itemID))
    }

    async function changeCompanionType() {
        try {
            const newType = companionType === "plant" ? "cactus" : "plant"
            await axiosInstance.post(`/companion/change/${newType}`)
            setCompanionType(newType)
        } catch(error: any) {
            console.log("Error changing companion type: ", error)
        }
        return;
    }

    async function logOut() {
        try {
            await axiosInstance.post("/auth/log-out")
            navigate("/")
        } catch(error: any) {
            console.log("Error logging out: ", error)
        }
        return;
    }

    useEffect(() => {
        fetchData()
    }, [])

    return isLoading ? (
        <Loading />
    ) : (
        <div className="container">
            <div className="col" style={{alignItems: "center", gap: 10, marginTop: 10}}>
                <div className="row">
                    <StatsCard bgColor="var(--yellow-color)" 
                                color="var(--dark-yellow-color)" 
                                title="Action XP"
                                data={data.xp}
                                iconD="M235.24,84.38l-28.06,23.68,8.56,35.39a13.34,13.34,0,0,1-5.09,13.91,13.54,13.54,0,0,1-15,.69L164,139l-31.65,19.06a13.51,13.51,0,0,1-15-.69,13.32,13.32,0,0,1-5.1-13.91l8.56-35.39L92.76,84.38a13.39,13.39,0,0,1,7.66-23.58l36.94-2.92,14.21-33.66a13.51,13.51,0,0,1,24.86,0l14.21,33.66,36.94,2.92a13.39,13.39,0,0,1,7.66,23.58ZM88.11,111.89a8,8,0,0,0-11.32,0L18.34,170.34a8,8,0,0,0,11.32,11.32l58.45-58.45A8,8,0,0,0,88.11,111.89Zm-.5,61.19L34.34,226.34a8,8,0,0,0,11.32,11.32l53.26-53.27a8,8,0,0,0-11.31-11.31Zm73-1-54.29,54.28a8,8,0,0,0,11.32,11.32l54.28-54.28a8,8,0,0,0-11.31-11.32Z" />
                    <StatsCard bgColor="var(--blue-color)" 
                                color="var(--dark-blue-color)" 
                                title="Learn XP"
                                data={data.learning_xp}
                                iconD="M234.29,114.85l-45,38.83L203,211.75a16.4,16.4,0,0,1-24.5,17.82L128,198.49,77.47,229.57A16.4,16.4,0,0,1,53,211.75l13.76-58.07-45-38.83A16.46,16.46,0,0,1,31.08,86l59-4.76,22.76-55.08a16.36,16.36,0,0,1,30.27,0l22.75,55.08,59,4.76a16.46,16.46,0,0,1,9.37,28.86Z" />
                    <StatsCard bgColor={streakStyle.bgColor} 
                                color={streakStyle.color} 
                                title="Streak"
                                data={data.streak}
                                iconD={streakStyle.icon_d} />
                </div>
                <Companion stage={data.stage} type={companionType} accessories={accessories}/>
                <div className="col" style={{gap: 10, minHeight: 200, marginBottom: 100}}>
                    <div className="row" style={{gap: 10, margin: 0}}>
                        <button className="btn-primary btn-white" style={{width: 150}} onClick={() => setOpen(true)}>
                            <div className="icon-row">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="var(--black-color)" viewBox="0 0 256 256"><path d="M239.71,74.14l-25.64,92.28A24.06,24.06,0,0,1,191,184H92.16A24.06,24.06,0,0,1,69,166.42L33.92,40H16a8,8,0,0,1,0-16H40a8,8,0,0,1,7.71,5.86L57.19,64H232a8,8,0,0,1,7.71,10.14ZM88,200a16,16,0,1,0,16,16A16,16,0,0,0,88,200Zm104,0a16,16,0,1,0,16,16A16,16,0,0,0,192,200Z"></path></svg>
                                <p>Accessories</p>
                            </div>
                        </button>
                        <button className="btn-primary btn-white" style={{width: 150}} onClick={changeCompanionType}>
                            <div className="icon-row">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="var(--black-color)" viewBox="0 0 256 256"><path d="M224,48V152a16,16,0,0,1-16,16H112v16a8,8,0,0,1-13.66,5.66l-24-24a8,8,0,0,1,0-11.32l24-24A8,8,0,0,1,112,136v16h96V48H96v8a8,8,0,0,1-16,0V48A16,16,0,0,1,96,32H208A16,16,0,0,1,224,48ZM168,192a8,8,0,0,0-8,8v8H48V104h96v16a8,8,0,0,0,13.66,5.66l24-24a8,8,0,0,0,0-11.32l-24-24A8,8,0,0,0,144,72V88H48a16,16,0,0,0-16,16V208a16,16,0,0,0,16,16H160a16,16,0,0,0,16-16v-8A8,8,0,0,0,168,192Z"></path></svg>
                                <p>Change plant</p>
                            </div>
                        </button>
                    </div>
                    <div className="row" style={{gap: 10, margin: 0}}>
                        <button className="btn-primary btn-white" style={{width: 150}} onClick={() => setInventoryOpen(true)}>
                            <div className="icon-row">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="var(--black-color)" viewBox="0 0 256 256"><path d="M184,40H72A56.06,56.06,0,0,0,16,96v96a16,16,0,0,0,16,16H224a16,16,0,0,0,16-16V96A56.06,56.06,0,0,0,184,40Zm40,56v8H192V56.8A40.07,40.07,0,0,1,224,96Zm-88,40H120V104h16Zm-24,16h32a8,8,0,0,0,8-8V120h24v72H80V120h24v24A8,8,0,0,0,112,152Zm40-48V96a8,8,0,0,0-8-8H112a8,8,0,0,0-8,8v8H80V56h96v48ZM64,56.8V104H32V96A40.07,40.07,0,0,1,64,56.8ZM32,120H64v72H32Zm192,72H192V120h32v72Z"></path></svg>
                                <p>Inventory</p>
                            </div>
                        </button>
                        <button className="btn-primary btn-red" style={{width: 150}} onClick={logOut}>Log out</button>
                    </div>
                </div>
                <AnimatePresence>
                {isStoreOpen && (
                    <motion.div
                        initial={{ y: '100%', opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: '100%', opacity: 0 }}
                        transition={{
                            duration: 0.2
                        }}
                        style={{
                            position: 'fixed',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            zIndex: 1000
                        }}
                    >
                    <StorePopUp 
                        items={storeItems} 
                        closePopUp={() => setOpen(false)} 
                        title="Accessories"
                        onBuy={handleBuy}
                    />
                    </motion.div>
                )}
                </AnimatePresence>
                <AnimatePresence>
                {isInventoryOpen && (
                    <motion.div
                        initial={{ y: '100%', opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: '100%', opacity: 0 }}
                        transition={{
                            duration: 0.2
                        }}
                        style={{
                            position: 'fixed',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            zIndex: 1000
                        }}
                    >
                    <InventoryPopUp 
                        items={data.inventoryItems} 
                        closePopUp={() => setInventoryOpen(false)}
                        onChange={handleBuy} 
                    />
                    </motion.div>
                )}
                </AnimatePresence>
            </div>
        </div>
    )
}

export default CompanionPage