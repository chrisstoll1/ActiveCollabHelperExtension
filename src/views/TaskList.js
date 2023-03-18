/* global chrome */
import { useContext, useEffect, useState } from 'react';
import { IsRefreshing, SetExtState, TaskListFilter } from '../context/ExtStateContext'
import Loading from '../components/Background/Loading';
import Task from '../components/Cards/Task';
import { filterWorkingTaskList } from '../utils/filterWorkingTaskList';
import '../assets/css/views/TaskList.css';

function Tasklist() {
    const setExtState = useContext(SetExtState);
    const [taskList, setTaskList] = useState({tasks: []});
    const [projectId, setProjectId] = useState(0);
    const [projectName, setProjectName] = useState("");
    const [accountNumber, setAccountNumber] = useState(0);
    const taskListFilter = useContext(TaskListFilter);
    const isRefreshing = useContext(IsRefreshing);
    const [loadingStorage, setLoadingStorage] = useState(false);
    const filteredOpenTasks = taskList.tasks.filter(task => task.name.toLowerCase().includes(taskListFilter.toLowerCase()));

    const taskListURL = `https://app.activecollab.com/${accountNumber}/projects/${projectId}/task-lists/${taskList.id}`;

    function redirect() {
        chrome.tabs.create({url: taskListURL});
        console.log('Redirecting to: ' + taskListURL);
    }

    chrome.runtime.onMessage.addListener((request, sender, reply) => {
        if (request.event === "updated"){
            chrome.storage.local.get(["WorkingTaskList"]).then((result) => {
                if (Object.keys(result).length === 0){
                    setExtState("Project");
                }else{
                    filterWorkingTaskList(JSON.parse(result.WorkingTaskList)).then((filteredWorkingTaskList) => {
                        if (filteredWorkingTaskList === null){
                            setExtState("Project");
                        }else{
                            setTaskList(filteredWorkingTaskList);
                        }
                    });
                }
            });
        }
    });

    useEffect(() => {
        const fetchData = async () => {
            setLoadingStorage(true);

            const workingTaskListResult = await chrome.storage.local.get(["WorkingTaskList"]);
            if (Object.keys(workingTaskListResult).length === 0){
                setExtState("Project");
            }else{
                const filteredWorkingTaskList = await filterWorkingTaskList(JSON.parse(workingTaskListResult.WorkingTaskList));
                if (filteredWorkingTaskList === null){
                    setExtState("Project");
                }else{
                    setTaskList(filteredWorkingTaskList);
                }
            }
    
            const workingProjectResult = await chrome.storage.local.get(["WorkingProject"]);
            if (Object.keys(workingProjectResult).length === 0){
                setExtState("Project");
            }else{
                setProjectId(JSON.parse(workingProjectResult.WorkingProject).id);
                setProjectName(JSON.parse(workingProjectResult.WorkingProject).name);
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
                            <h5>{taskList.name}</h5>
                            <small>{projectName}</small>
                        </div>
                        <div className="project-link-icon">
                            <i className="material-icons" onClick={redirect}>link</i>
                        </div>
                    </div>

                    <div className="card-list-body">
                        <div className="card-list">
                            <div className="card-list-head">
                                <h6>Open Tasks</h6>
                            </div>
                            <div className="card-list-body">
                                <ul className="list-group">
                                    {(filteredOpenTasks.length === 0) ?
                                        <div className="filter-quip">
                                            {(taskList.tasks.length > filteredOpenTasks.length) ?
                                                <div className="text-muted">Sorry, no results were found for your search.</div>
                                            :
                                                <div className="text-muted">No Open Tasks!</div>
                                            }
                                        </div>
                                    :
                                        filteredOpenTasks.map((task, index) => {
                                            return (
                                                <Task key={index} task={task} projectId={projectId} accountNumber={accountNumber} />
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
    );
}

export default Tasklist;