/*global chrome*/
import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar/Navbar';
import Footer from '../components/Footer/Footer';
import Routes from './Routes';
import { setChromeBadge } from '../utils/setChromeBadge';
import { ExtState, SetExtState, IsRefreshing, SetRefreshing, OverviewFilter, SetOverviewFilter, ProjectFilter, SetProjectFilter, TaskListFilter, SetTaskListFilter } from '../context/ExtStateContext'

function Main() {
    const [extState, setExtState] = useState("Overview");
    const [isRefreshing, setRefreshing] = useState(false);
    const [overviewFilter, setOverviewFilter] = useState("");
    const [projectFilter, setProjectFilter] = useState("");
    const [taskListFilter, setTaskListFilter] = useState("");

    useEffect(() => {
        //Load extension state from local storage
        chrome.storage.local.get(["ExtState"]).then((result) => {
            if (Object.keys(result).length !== 0){
                setExtState(result.ExtState);
            }
        });

        // Update Chrome Badge using setChromeBadge
        chrome.storage.local.get(["ACProjects"]).then(async (result) => {
            if (Object.keys(result).length !== 0){
                const projects = JSON.parse(result.ACProjects);
                await setChromeBadge(projects);
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
        <div className="main-container d-flex flex-column min-vh-100">
            <ExtState.Provider value={extState}>
                <SetExtState.Provider value={setExtState}>
                    <IsRefreshing.Provider value={isRefreshing}>
                        <SetRefreshing.Provider value={setRefreshing}>
                            <OverviewFilter.Provider value={overviewFilter}>
                                <SetOverviewFilter.Provider value={setOverviewFilter}>
                                    <ProjectFilter.Provider value={projectFilter}>
                                        <SetProjectFilter.Provider value={setProjectFilter}>
                                            <TaskListFilter.Provider value={taskListFilter}>
                                                <SetTaskListFilter.Provider value={setTaskListFilter}>
                                                    <Navbar/>
                                                    <Routes/>
                                                    <Footer/>
                                                </SetTaskListFilter.Provider>
                                            </TaskListFilter.Provider>
                                        </SetProjectFilter.Provider>
                                    </ProjectFilter.Provider>
                                </SetOverviewFilter.Provider>
                            </OverviewFilter.Provider>
                        </SetRefreshing.Provider>
                    </IsRefreshing.Provider>
                </SetExtState.Provider>
            </ExtState.Provider>
        </div>
    );
}

export default Main;