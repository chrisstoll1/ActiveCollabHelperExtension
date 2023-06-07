import { useContext, useEffect, useState } from "react";
import { IsRefreshing } from "../../context/ExtStateContext"
import '../../assets/css/components/Footer/Footer.css'
import { formatDateStringToTimeAgo } from "../../utils/formatDateStringToTimeAgo";
import { useLocation } from "react-router-dom";

function Footer() {
    const isRefreshing = useContext(IsRefreshing);
    const [lastRefreshTime, setLastRefreshTime] = useState("");
    const [currentTime, setCurrentTime] = useState(new Date());
    const location = useLocation();

    let manifestData = chrome.runtime.getManifest();
    const currentVersion = `v${manifestData.version}`;

    const redirectToRepository = () => {
        chrome.tabs.create({url: `https://github.com/chrisstoll1/ActiveCollabHelperExtension/tree/${currentVersion}`});
    }

    function footerClass() {
        if (location.pathname === "/settings") {
            return ("footer-wrapper d-flex justify-content-end");
        }else if (location.pathname === "/login") {
            return ("footer-disabled");
        }else{
            return ("footer-wrapper d-flex justify-content-center");
        }
    }

    function footerText() {
        if (location.pathname === "/settings") {
            return (
                <span onClick={redirectToRepository} className="footer-link">ActiveCollab Helper Extension: {currentVersion}</span>
            );
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