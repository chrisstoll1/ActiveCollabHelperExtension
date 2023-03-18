import { useContext, useEffect, useState } from "react";
import { ExtState, IsRefreshing } from "../../context/ExtStateContext"
import '../../assets/css/components/Footer/Footer.css'
import { formatDateStringToTimeAgo } from "../../utils/formatDateStringToTimeAgo";

function Footer() {
    const extState = useContext(ExtState);
    const isRefreshing = useContext(IsRefreshing);
    const [lastRefreshTime, setLastRefreshTime] = useState("");
    const [currentTime, setCurrentTime] = useState(new Date());

    function footerClass() {
        if (extState === "Settings") {
            return ("footer-wrapper d-flex justify-content-end");
        }else if (extState === "Login") {
            return ("footer-disabled");
        }else{
            return ("footer-wrapper d-flex justify-content-center");
        }
    }

    function footerText() {
        if (extState === "Settings") {
            return ("ActiveCollab Helper Extension v0.0.1");
        }else{
            if (lastRefreshTime !== ""){
                return ("Refreshed: " + formatDateStringToTimeAgo(lastRefreshTime, currentTime));
            }else{
                return ("Refreshed: Never");
            }
        }
    }

    chrome.runtime.onMessage.addListener((request, sender, reply) => {
        if (request.event === "refresh-date-updated"){
            chrome.storage.local.get(["LastRefreshTime"]).then((result) => {
                if (Object.keys(result).length !== 0){
                    if (result.LastRefreshTime !== lastRefreshTime){
                        setLastRefreshTime(result.LastRefreshTime);
                    }
                }
            });
        }
    });

    useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000); // Update every second (1000 ms)

        chrome.storage.local.get(["LastRefreshTime"]).then((result) => {
            if (Object.keys(result).length !== 0){
                if (result.LastRefreshTime !== lastRefreshTime){
                    setLastRefreshTime(result.LastRefreshTime);
                }
            }
        });

        return () => clearInterval(intervalId);
    }, []);

    if (isRefreshing){
        return (null);
    }else{
        return (
            <div className={footerClass()}>
                <div className="p-2">
                    <div className="small footer-small">{footerText()}</div>
                </div>
            </div>
        )
    }
}

export default Footer;