/*global chrome*/
import { useState, useContext, useEffect } from 'react';
import FilteredProjects from '../components/Cards/FilteredProjects';
import { IsRefreshing, SetRefreshing, SetExtState, OverviewFilter } from '../context/ExtStateContext'
import { filterProjectData } from '../utils/filterProjectData';
import Loading from '../components/Background/Loading';
import OverviewHeader from '../components/Text/OverviewHeader';
import OverviewSortBy from '../components/Inputs/OverviewSortBy';
import { emptyProjectResponses } from '../data/emptyProjectResponses'
import { SortDirection, SetSortDirection, SortOption, SetSortOption } from '../context/OverviewContext'

function Overview() {
    //Projects
    const [projects, setProjects] = useState([]);

    //Text Filter
    const overviewFilter = useContext(OverviewFilter);
    const filteredProjects = projects.filter(project => project.name.toLowerCase().includes(overviewFilter.toLowerCase()));
    
    //Empty Project Response (Quips)
    const [emptyProjectResponse, setEmptyProjectResponse] = useState("");

    //Sorting
    const [sortDirection, setSortDirection] = useState("ASC"); //ASC v DESC ^
    const [sortOption, setSortOption] = useState("Default"); //Name, Active Date, Discussion Count, Task Count

    //Context
    const isRefreshing = useContext(IsRefreshing);
    const setRefreshing = useContext(SetRefreshing);
    const setExtState = useContext(SetExtState);

    //Message Listener for Chrome related events
    chrome.runtime.onMessage.addListener((request, sender, reply) => {
        if (request.event === "updated"){
            chrome.storage.local.get(["ACProjects"]).then((result) => {
                filterProjectData(JSON.parse(result.ACProjects), sortOption, sortDirection).then((filteredProjectData) => {
                    setProjects(filteredProjectData);
                    setEmptyProjectResponse(emptyProjectResponses[Math.floor(Math.random() * emptyProjectResponses.length)]);
                });
            });
        }
        if (request.event === "invalid_token"){
            setExtState("Login");
            setRefreshing(false);
        }
    });

    useEffect(() => {
        //Load projects from local storage, if it doesnt exist refresh from API
        chrome.storage.local.get(["ACProjects"]).then((result) => {
            if (Object.keys(result).length === 0){
                setRefreshing(true);
                chrome.runtime.sendMessage({event: "refresh"});
            }else{
                filterProjectData(JSON.parse(result.ACProjects), sortOption, sortDirection).then((filteredProjectData) => {
                    setProjects(filteredProjectData);
                    setEmptyProjectResponse(emptyProjectResponses[Math.floor(Math.random() * emptyProjectResponses.length)]);
                });
            }
        });
    }, [sortDirection, sortOption]);

    return (
        <div className="main-body flex-grow-1">
            {(isRefreshing) ? 
                <Loading/>
            :
                <div className="card-list overview-card-list">
                    <div className="card-list-head">
                        <OverviewHeader 
                            filteredProjects={filteredProjects}
                            projects={projects}
                        />
                        <SortDirection.Provider value={sortDirection}>
                            <SetSortDirection.Provider value={setSortDirection}>
                                <SortOption.Provider value={sortOption}>
                                    <SetSortOption.Provider value={setSortOption}>
                                        <OverviewSortBy />
                                    </SetSortOption.Provider>
                                </SortOption.Provider>
                            </SetSortDirection.Provider>
                        </SortDirection.Provider>
                    </div>
                    <div className="card-list-body">
                        {(filteredProjects.length === 0) ? 
                            <div className="filter-quip">
                                {(projects.length > filteredProjects.length) ? 
                                    <div className='text-muted'>Sorry, no results were found for your search.</div>
                                :
                                    <div className='text-muted'>{emptyProjectResponse}</div>
                                }
                            </div>
                        : 
                            <FilteredProjects filteredProjects={filteredProjects}/>
                        }
                    </div>
                </div>
            }            
        </div>
    );
}

export default Overview;