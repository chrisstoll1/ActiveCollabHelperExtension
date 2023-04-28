/*global chrome*/
import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar/Navbar';
import Footer from '../components/Footer/Footer';
import AppRoutes from './AppRoutes';
import { MemoryRouter as Router, useNavigate } from 'react-router-dom';
import { setChromeBadge } from '../utils/setChromeBadge';
import { IsRefreshing, SetRefreshing, OverviewFilter, SetOverviewFilter, ProjectFilter, SetProjectFilter, TaskListFilter, SetTaskListFilter } from '../context/ExtStateContext';

function Main() {
    const [isRefreshing, setRefreshing] = useState(false);
    const [overviewFilter, setOverviewFilter] = useState("");
    const [projectFilter, setProjectFilter] = useState("");
    const [taskListFilter, setTaskListFilter] = useState("");

    useEffect(() => {
        // Update Chrome Badge using setChromeBadge
        chrome.storage.local.get(["ACProjects"], async (result) => {
            if (Object.keys(result).length !== 0) {
                const projects = JSON.parse(result.ACProjects);
                await setChromeBadge(projects);
            }
        });   
    }, []);

    return (
        <div className="main-container d-flex flex-column min-vh-100">
            <Router>
                <IsRefreshing.Provider value={isRefreshing}>
                    <SetRefreshing.Provider value={setRefreshing}>
                        <OverviewFilter.Provider value={overviewFilter}>
                            <SetOverviewFilter.Provider value={setOverviewFilter}>
                                <ProjectFilter.Provider value={projectFilter}>
                                    <SetProjectFilter.Provider value={setProjectFilter}>
                                        <TaskListFilter.Provider value={taskListFilter}>
                                            <SetTaskListFilter.Provider value={setTaskListFilter}>
                                                <Navbar />
                                                <AppRoutes />
                                                <Footer />
                                            </SetTaskListFilter.Provider>
                                        </TaskListFilter.Provider>
                                    </SetProjectFilter.Provider>
                                </ProjectFilter.Provider>
                            </SetOverviewFilter.Provider>
                        </OverviewFilter.Provider>
                    </SetRefreshing.Provider>
                </IsRefreshing.Provider>
            </Router>
        </div>
    );
}

export default Main;