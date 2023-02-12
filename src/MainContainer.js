/*global chrome*/
import { useState, useEffect } from 'react';
import Navbar from './components/Navbar/Navbar';
import Body from './components/Body/Body';
import { ExtState, SetExtState, IsRefreshing, SetRefreshing, BodyFilter, SetBodyFilter } from './ExtStateContext';

function MainContainer() {
    const [extState, setExtState] = useState("Overview");
    const [isRefreshing, setRefreshing] = useState(false);
    const [bodyFilter, setBodyFilter] = useState("");

    useEffect(() => {
        //Load extension state from local storage
        chrome.storage.local.get(["ExtState"]).then((result) => {
            if (Object.keys(result).length !== 0){
                setExtState(result.ExtState);
            }
        });
    }, []);

    useEffect(() => {
        //Update the extension state in local storage unless it is Login
        if (extState !== "Login"){
            chrome.storage.local.set({ExtState: extState});
        }
    }, [extState]);

    return (
        <div class="main-container">
            <ExtState.Provider value={extState}>
                <SetExtState.Provider value={setExtState}>
                    <IsRefreshing.Provider value={isRefreshing}>
                        <SetRefreshing.Provider value={setRefreshing}>
                            <BodyFilter.Provider value={bodyFilter}>
                                <SetBodyFilter.Provider value={setBodyFilter}>
                                    <Navbar/>
                                    <Body/>
                                </SetBodyFilter.Provider>
                            </BodyFilter.Provider>
                        </SetRefreshing.Provider>
                    </IsRefreshing.Provider>
                </SetExtState.Provider>
            </ExtState.Provider>
        </div>
    );
}

export default MainContainer;