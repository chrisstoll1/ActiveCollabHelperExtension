/*global chrome*/
import { useContext } from "react";
import { ExtState, SetExtState } from '../../context/ExtStateContext';
import '../../assets/css/components/Navbar/SettingsButton.css';

function SettingsButton() {
    const setExtState = useContext(SetExtState);
    const extState = useContext(ExtState);

    function settingsClicked() {
        setExtState("Settings");
    }

    return (
        <i className={(extState === 'Settings' ? "material-icons extension-control-icons settings-disabled" : "material-icons extension-control-icons")} onClick={settingsClicked}>settings</i>
    );
}

export default SettingsButton