/*global chrome*/
import { useState, useContext, useEffect } from 'react';
import OverviewProject from '../components/Cards/OverviewProject';
import { IsRefreshing, SetRefreshing, BodyFilter, SetExtState, SetBodyFilter } from '../store/ExtStateContext';
import Loading from '../components/Background/Loading';

function Overview() {
    const bodyFilter = useContext(BodyFilter);
    const setBodyFilter = useContext(SetBodyFilter);
    const [projects, setProjects] = useState([]);
    const filteredProjects = projects.filter(project => project.name.toLowerCase().includes(bodyFilter.toLowerCase()));
    const [isLoadingStorage, setLoadingStorage] = useState(false);
    const [emptyProjectResponse, setEmptyProjectResponse] = useState("");
    const isRefreshing = useContext(IsRefreshing);
    const setRefreshing = useContext(SetRefreshing);
    const setExtState = useContext(SetExtState);

    const emptyProjectResponses = [
        "No projects to conquer! Yay!",
        "Nada, zip, zilch.",
        "Nope, nothing to do here.",
        "No projects? Time to retire.",
        "Nothing to do here, move along.",
        "Nothing here, let's watch paint dry.",
        "Projects? What projects?",
        "No projects, no worries. Time for coffee.",
        "Where are all the projects?",
        "No projects in sight, time to relax."
    ]

    chrome.runtime.onMessage.addListener((request, sender, reply) => {
        if (request.event === "updated"){
            chrome.storage.local.get(["ACProjects"]).then((result) => {
                setProjects(JSON.parse(result.ACProjects));
                setEmptyProjectResponse(emptyProjectResponses[Math.floor(Math.random() * emptyProjectResponses.length)]);
            });
        }
        if (request.event === "invalid_token"){
            setExtState("Login");
            setRefreshing(false);
            setLoadingStorage(false);
        }
    });

    useEffect(() => {
        setBodyFilter("");

        //Load projects from local storage, if it doesnt exist refresh from API
        setLoadingStorage(true);
        chrome.storage.local.get(["ACProjects"]).then((result) => {
            if (Object.keys(result).length === 0){
                setRefreshing(true);
                chrome.runtime.sendMessage({event: "refresh"});
            }else{
                setProjects(JSON.parse(result.ACProjects));
                setEmptyProjectResponse(emptyProjectResponses[Math.floor(Math.random() * emptyProjectResponses.length)]);
            }
            setLoadingStorage(false);
        });
    }, []);

    return (
        <div class="main-body">
            {(isLoadingStorage || isRefreshing) ? 
                <Loading/>
            :
                <div class="card-list">
                    <div class="card-list-head">
                        <h6>Projects</h6>
                    </div>
                    <div class="card-list-body">
                        {(filteredProjects.length === 0) ? 
                            <div class="filter-quip">
                                {(projects.length > filteredProjects.length) ? 
                                    <muted>Sorry, no results were found for your search.</muted>
                                :
                                    <muted>{emptyProjectResponse}</muted>
                                }
                            </div>
                        : 
                            filteredProjects.map((project,index)=>{
                                return <OverviewProject 
                                    project={project}
                                />
                            })
                        }
                    </div>
                </div>
            }            
        </div>
    );
}

export default Overview;