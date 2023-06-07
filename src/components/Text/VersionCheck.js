import {useEffect, useState} from 'react';
import '../../assets/css/components/Text/VersionCheck.css'

function VersionCheck(){
    let manifestData = chrome.runtime.getManifest();
    const currentVersion = `v${manifestData.version}`;
    const [latestVersion, setLatestVersion] = useState(currentVersion);

    const redirectToRelease = () => {
        chrome.tabs.create({url: `https://github.com/chrisstoll1/ActiveCollabHelperExtension/releases/tag/${latestVersion}`});
    }

    useEffect(() => {
        fetch('https://api.github.com/repos/chrisstoll1/ActiveCollabHelperExtension/releases')
          .then(response => response.json())
          .then(data => {
            const latestRelease = data.find(release => release.tag_name !== "latest"); //Latest Tag other than "latest" (which is the pre-release)
            setLatestVersion(latestRelease.tag_name);
            console.log("Latest Version: " + latestRelease.tag_name);
          })
          .catch(error => console.error(error)); 
    }, [currentVersion]);

    if (latestVersion !== currentVersion){
        return (
            <div className="card version-check-card">
                <div className="card-body version-check-card-body">
                    <p className="version-check-description">
                        A new version of the extension is available: {latestVersion}
                    </p>
                    <i className="material-icons version-check-icon" onClick={redirectToRelease}>
                        launch
                    </i>
                </div>
            </div>
        );
    }else{
        return null;
    }
}

export default VersionCheck;