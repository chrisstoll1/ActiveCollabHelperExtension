/* global chrome */
import { useEffect, useState, useContext } from "react"
import { SetExtState, IsRefreshing, ProjectFilter } from "../context/ExtStateContext"
import Loading from "../components/Background/Loading";
import Discussion from "../components/Cards/Discussion";
import ProjectTaskList from "../components/Cards/ProjectTaskList";
import { formatUnixTimestamp } from "../utils/formatUnixTimestamp";
import { filterWorkingProject } from "../utils/filterWorkingProject";

function Project(){
    //Project
    const [project, setProject] = useState({discussions: [], task_lists: []});

    //Text Filter
    const projectFilter = useContext(ProjectFilter);
    const filteredDiscussions = project.discussions.filter(discussion => discussion.name.toLowerCase().includes(projectFilter.toLowerCase()));
    const filteredTasks = project.task_lists.filter(task_list => task_list.name.toLowerCase().includes(projectFilter.toLowerCase()));

    //TODO: Remove? 
    const [loadingStorage, setLoadingStorage] = useState(false);
    
    //Context
    const setExtState = useContext(SetExtState);
    const isRefreshing = useContext(IsRefreshing);

    //Redirect to project page
    const [accountNumber, setAccountNumber] = useState(0);
    const projectURL = `https://app.activecollab.com/${accountNumber}/projects/${project.id}`;
    function redirect(){
        chrome.tabs.create({url: projectURL});
        console.log("Redirecting to: " + projectURL);
    }

    //Message Listener for Chrome related events
    chrome.runtime.onMessage.addListener((request, sender, reply) => {
        if (request.event === "updated"){
            chrome.storage.local.get(["WorkingProject"]).then((result) => {
                if (Object.keys(result).length === 0){
                    setExtState("Overview");
                }else{
                    filterWorkingProject(JSON.parse(result.WorkingProject)).then((filteredWorkingProject) => {;
                        setProject(filteredWorkingProject);
                    });
                }
            });
        }
    });

    useEffect(() => {
        const fetchData = async () => {
            setLoadingStorage(true);   

            const workingProjectResult = await chrome.storage.local.get(["WorkingProject"]);
            if (Object.keys(workingProjectResult).length === 0){
                setExtState("Overview");
            }else{
                const filteredWorkingProject = await filterWorkingProject(JSON.parse(workingProjectResult.WorkingProject));
                setProject(filteredWorkingProject);
            }

            const accountNumberResult = await chrome.storage.sync.get(["activecollab_user_instances"]);
            if (Object.keys(accountNumberResult).length === 0){
                setExtState("Login");
            }else{
                setAccountNumber(accountNumberResult.activecollab_user_instances);
            }

            setLoadingStorage(false);
        };
    
        fetchData();
    }, []);

    return (
        <div className="main-body flex-grow-1">
            {(loadingStorage || isRefreshing) ?
                <Loading />
            :
            <div className="card-list">
                <div className="d-flex justify-content-between">
                    <div className="task-list-header">
                        <h5>{project.name}</h5>
                        <small>Last Activity: {formatUnixTimestamp(project.last_active)}</small>
                    </div>
                    <div className="project-link-icon">
                        <i className="material-icons" onClick={redirect}>link</i>
                    </div>
                </div>

                <div className="card-list-body">
                    <div className="card-list">
                        <div className="card-list-head">
                            <h6>Discussions</h6>
                        </div>
                        <div className="card-list-body">
                            <ul className="list-group">
                                {(filteredDiscussions.length === 0) ?
                                    <div className="filter-quip">
                                        {(project.discussions.length > filteredDiscussions.length) ? 
                                            <muted>Sorry, no results were found for your search.</muted>
                                        :
                                            <muted>No Discussions!</muted>
                                        }
                                    </div>
                                :
                                    filteredDiscussions.map((discussion) => {
                                        return (
                                            <Discussion discussion={discussion} projectId={project.id} accountNumber={accountNumber} />
                                        )
                                    })
                                }
                            </ul>
                        </div>
                    </div>
                    <div className="card-list">
                        <div className="card-list-head">
                            <h6>Task Lists</h6>
                        </div>
                        <div className="card-list-body">
                            <ul className="list-group">
                                {(filteredTasks.length === 0) ?
                                    <div className="filter-quip">
                                        {(project.task_lists.length > filteredTasks.length) ?
                                            <muted>Sorry, no results were found for your search.</muted>
                                        :
                                            <muted>No Task Lists!</muted>
                                        }
                                    </div>
                                :
                                    filteredTasks.map((task_list) => {
                                        return (
                                            <ProjectTaskList task_list={task_list} projectId={project.id} />
                                        )
                                    })   
                                }
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            }
        </div>
    )
}

export default Project