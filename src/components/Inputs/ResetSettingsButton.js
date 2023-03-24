/* global chrome */

function ResetSettingsButton() {
    function resetSettings(){
        chrome.runtime.sendMessage({event: "reset_settings"});
    }
  
    return (
        <button type="button" className="btn btn-primary" onClick={resetSettings}>Clear Settings</button>
    );
}

export default ResetSettingsButton;