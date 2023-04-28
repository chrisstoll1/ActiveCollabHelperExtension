import { useState } from "react";
import '../../assets/css/components/Inputs/MuteProjectButton.css'

function MuteProjectButton(props) {
    //state with 3 possible values: 0, 1, 2
    //0: not muted
    //1: snoozed
    //2: muted
    const [muteState, setMuteState] = useState(0);

    function handleMute() {
        if (muteState === 0) {
            setMuteState(1);
        } else if (muteState === 1) {
            setMuteState(2);
        } else {
            setMuteState(0);
        }
        console.log(muteState);
    }

    const muteIcon = (muteState === 0) ? 'notifications' : (muteState === 1) ? 'notifications_paused' : 'notifications_off';

    const muteClass = (muteState === 0) ? 'mute-project-icon' : (muteState === 1) ? 'mute-project-icon-snoozed' : 'mute-project-icon-muted';

    return (
        <i onClick={handleMute} className={`material-icons ${muteClass}`}>{muteIcon}</i>
    );
}

export default MuteProjectButton;