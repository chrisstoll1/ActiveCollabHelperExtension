/* global chrome */

function ResetMutedProjects() {
    function resetMutedProjects(){
        chrome.runtime.sendMessage({event: "reset_muted_projects"});
    }
  
    return (
        <button type="button" className="btn btn-primary" onClick={resetMutedProjects}>Clear Muted Projects</button>
    );
}

export default ResetMutedProjects;