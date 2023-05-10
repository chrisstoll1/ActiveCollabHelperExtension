/* globals chrome */
import { useEffect, useState } from "react";
import '../../assets/css/components/Inputs/MuteProjectButton.css'
import { setChromeBadge } from "../../utils/setChromeBadge";

function MuteProjectButton(props) {
    //0: not muted
    //1: snoozed
    //2: muted
    const [muteState, setMuteState] = useState(0);

    function getProjectsAndRefreshChromeBadge() {
        chrome.storage.local.get(["ACProjects"]).then((result) => {
            let projects = JSON.parse(result.ACProjects);
            setChromeBadge(projects);
        });
    }

    //get mute state from chrome storage on load, if it doesn't exist, set it to 0
    useEffect(() => {
        chrome.storage.sync.get(['MuteStates'], function(result) {
            if (result.MuteStates) {
                if (props.project.id && result.MuteStates[props.project.id]) {
                    setMuteState(result.MuteStates[props.project.id].state);
                } else {
                    setMuteState(0);
                }
            }
        });
    }, []);

    //store mute state in chrome storage on change
    useEffect(() => {
        chrome.storage.sync.get(['MuteStates'], function(result) {
            if (result.MuteStates) {
                // remove the project from the mute states if it's unmuted
                if (muteState === 0 && result.MuteStates[props.project.id]) {
                    delete result.MuteStates[props.project.id];
                    chrome.storage.sync.set(result);
                }else{
                    result.MuteStates[props.project.id] = {
                        state: muteState,
                        last_updated: props.project.last_active
                    };
                    chrome.storage.sync.set(result);
                }
            } else {
                if (props.project.id !== undefined){
                    let MuteStates = {};
                    MuteStates[props.project.id] = {
                        state: muteState,
                        last_updated: props.project.last_active
                    };

                    chrome.storage.sync.set({MuteStates: MuteStates});
                }
            }

            getProjectsAndRefreshChromeBadge();
        });
    }, [muteState, props.project]);

    function handleMute() {
        if (muteState === 0) {
            setMuteState(1);
        } else if (muteState === 1) {
            setMuteState(2);
        } else {
            setMuteState(0);
        }
    }

    const muteIcon = (muteState === 0) ? 'notifications' : (muteState === 1) ? 'notifications_paused' : 'notifications_off';

    const muteClass = (muteState === 0) ? 'mute-project-icon' : (muteState === 1) ? 'mute-project-icon-snoozed' : 'mute-project-icon-muted';

    return (
        <i onClick={handleMute} className={`material-icons ${muteClass}`}>{muteIcon}</i>
    );
}

export default MuteProjectButton;