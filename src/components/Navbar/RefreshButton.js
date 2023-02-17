/*global chrome*/
import { useContext } from "react";
import '../../assets/css/components/Navbar/RefreshButton.css';
import { IsRefreshing, SetRefreshing, ExtState } from '../../context/ExtStateContext';

function RefreshButton() {
    const isRefreshing = useContext(IsRefreshing);
    const setRefreshing = useContext(SetRefreshing);
    const extState = useContext(ExtState);

    function onClick() {
        if (!isRefreshing && !(extState === "Login" || extState === "Settings")) { 
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
            (extState === "Login" || extState === "Settings") ? 
                "material-icons extension-control-icons refresh-disabled" : 
                isRefreshing ? 
                    "material-icons extension-control-icons refresh-start" : 
                    "material-icons extension-control-icons"
        } onClick={onClick}>sync</i>
    );
}

export default RefreshButton