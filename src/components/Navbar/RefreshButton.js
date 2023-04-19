/*global chrome*/
import { useContext } from "react";
import '../../assets/css/components/Navbar/RefreshButton.css';
import { IsRefreshing, SetRefreshing } from '../../context/ExtStateContext';
import { useLocation } from "react-router-dom";

function RefreshButton() {
    const isRefreshing = useContext(IsRefreshing);
    const setRefreshing = useContext(SetRefreshing);
    const location = useLocation();
    const isSettingsPage = location.pathname === "/settings" || location.pathname === "/project/settings" || location.pathname === "/taskList/settings";

    function onClick() {
        if (!isRefreshing && !(location.pathname === "/login" || isSettingsPage)) { 
            setRefreshing(true);
            chrome.runtime.sendMessage({event: "refresh"});
        }
    }    

    chrome.runtime.onMessage.addListener((request, sender, reply) => {
        if (request.event === "updated"){
            setRefreshing(false); 
        }
    });

    return (
        <i id="refresh-button" className={
            (location.pathname === "/login" || isSettingsPage) ? 
                "material-icons extension-control-icons refresh-disabled" : 
                isRefreshing ? 
                    "material-icons extension-control-icons refresh-start" : 
                    "material-icons extension-control-icons"
        } onClick={onClick}>sync</i>
    );    
}

export default RefreshButton