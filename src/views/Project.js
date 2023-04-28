/* global chrome */
import { useEffect, useState, useContext, useCallback } from "react"
import { useNavigate } from "react-router-dom"
import { IsRefreshing, ProjectFilter } from "../context/ExtStateContext"
import Loading from "../components/Background/Loading";
import Discussion from "../components/Cards/Discussion";
import ProjectTaskList from "../components/Cards/ProjectTaskList";
import { filterWorkingProject } from "../utils/filterWorkingProject";
import ProjectHeader from "../components/Text/ProjectHeader";

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
    const isRefreshing = useContext(IsRefreshing);
    const navigate = useNavigate();

    //Redirect to project page
    const [accountNumber, setAccountNumber] = useState(0);
    const projectURL = `https://app.activecollab.com/${accountNumber}/projects/${project.id}`;
    const handleRedirect = useCallback((projectURL) => {
        chrome.tabs.create({url: projectURL});
        console.log("Redirecting to: " + projectURL);
    }, []);

    //Message Listener for Chrome related events
    chrome.runtime.onMessage.addListener((request, sender, reply) => {
        if (request.event === "updated"){
            chrome.storage.local.get(["WorkingProject"]).then((result) => {
                if (Object.keys(result).length === 0){
                    navigate("/");
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
                navigate("/");
            }else{
                const filteredWorkingProject = await filterWorkingProject(JSON.parse(workingProjectResult.WorkingProject));
                setProject(filteredWorkingProject);
            }

            const accountNumberResult = await chrome.storage.sync.get(["activecollab_user_instances"]);
            if (Object.keys(accountNumberResult).length === 0){
                navigate("/login");
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
                <ProjectHeader project={project} projectURL={projectURL} redirect={handleRedirect} />

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
                                            <div className="text-muted">Sorry, no results were found for your search.</div>
                                        :
                                            <div className="text-muted">No Discussions!</div>
                                        }
                                    </div>
                                :
                                    filteredDiscussions.map((discussion, index) => {
                                        return (
                                            <Discussion key={index} discussion={discussion} projectId={project.id} accountNumber={accountNumber} />
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
                                            <div className="text-muted">Sorry, no results were found for your search.</div>
                                        :
                                            <div className="text-muted">No Task Lists!</div>
                                        }
                                    </div>
                                :
                                    filteredTasks.map((task_list, index) => {
                                        return (
                                            <ProjectTaskList key={index} task_list={task_list} projectId={project.id} />
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