import { useEffect, useState } from "react"
import StatsCard from "../components/StatsCard"
import axiosInstance from "../lib/apiClient"
import Companion from "../components/Companion"
import { InventoryPopUp, StorePopUp } from "../components/PopUps"
import { AnimatePresence, motion } from "motion/react"
import Loading from "../components/Loading"
import { useNavigate } from "react-router-dom"
import { clearAccessToken } from "../lib/tokenManager"

const CompanionPage = () => {
    const [data, setData] = useState({
        xp: 0,
        learning_xp: 0,
        streak: 0,
        status: "lost",
        })
    const [isStoreOpen, setOpen] = useState(false)
    const [isInventoryOpen, setInventoryOpen] = useState(false)
    const [isLoading, setLoading] = useState(true)

    const [companionURL, setCompanionURL] = useState("")
    const [accessories, setAccessories] = useState<object[]>([])
    const [storeItems, setStoreItems] = useState([])

    const navigate = useNavigate()
    
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
                status: streakResponse.data.result.status
            })
            setCompanionURL(companionResponse.data.base_companion_url)
            setAccessories(inventoryResponse.data.accessories)
            setStoreItems(storeResponse.data.accessories)
        } catch(error: any) {
            console.error("Error fetching stats: ", error)
        } finally {
            setLoading(false)
        }
        return;
    }

    const handleBuy = (itemID: number, itemURL: string) => {
        setStoreItems(prev => prev.filter((i: any) => i.id !== itemID));

        setAccessories(prev => [
            ...prev,
            { accessory_id: itemID, url: itemURL, shown: true }
        ]);
    };

    const handleToggleAccessory = (id: number) => {
        setAccessories(prev =>
            prev.map((acc: any) =>
                acc.accessory_id === id
                ? { ...acc, shown: !acc.shown }
                : acc
        )
        );
    };


    async function logOut() {
        try {
            await axiosInstance.post("/auth/log-out")
            clearAccessToken()
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
            <div className="col center-align" style={{gap: 10, marginBottom: 110}}>
                <div className="row">
                    <StatsCard 
                    title="Action XP"
                    data={data.xp}
                    iconSrc="/assets/icons/flyingstar.png" />
                    <StatsCard
                    title="Learn XP"
                    data={data.learning_xp}
                    iconSrc="/assets/icons/bluestar.png" />
                    <StatsCard
                    title="Streak"
                    data={data.streak}
                    iconSrc={data.status === "kept" ? "/assets/icons/lightning.png" : "/assets/icons/cloudicon.png"}
                     />
                </div>
                <Companion companionSRC={companionURL} accessories={accessories}/>
                <div className="col" style={{gap: 10, maxWidth: "100%"}}>
                    <div className="row" style={{gap: 10, margin: 0, flexWrap: "wrap", justifyContent: "center", width: "100%"}}>
                        <button className="btn-primary btn-white" style={{width: "fit-content", padding: 15}} onClick={() => setOpen(true)}>
                            <p className="pixel-sans">Shop</p>
                        </button>
                        <button className="btn-primary btn-white" style={{width: "fit-content", padding: 15}} onClick={() => setInventoryOpen(true)}>
                            <p className="pixel-sans">Inventory</p>
                        </button>
                        <button className="btn-primary" style={{width: "fit-content", padding: 15, backgroundColor: "var(--orange-color)", color: "var(--red-color)"}} onClick={logOut}>
                            <p className="pixel-sans">Logout</p>
                        </button>
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
                        items={accessories} 
                        closePopUp={() => setInventoryOpen(false)}
                        onChange={handleToggleAccessory} 
                    />
                    </motion.div>
                )}
                </AnimatePresence>
            </div>
        </div>
    )
}

export default CompanionPage