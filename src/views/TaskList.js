/* global chrome */
import { useContext, useEffect, useState } from 'react';
import { BodyFilter, IsRefreshing, SetExtState, SetBodyFilter } from '../context/ExtStateContext'
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
    const bodyFilter = useContext(BodyFilter);
    const setBodyFilter = useContext(SetBodyFilter);
    const isRefreshing = useContext(IsRefreshing);
    const [loadingStorage, setLoadingStorage] = useState(false);
    const filteredOpenTasks = taskList.tasks.filter(task => task.name.toLowerCase().includes(bodyFilter.toLowerCase()));

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
            setBodyFilter("");
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
        <div class="main-body">
            {(loadingStorage || isRefreshing) ?
                <Loading />
            :
                <div class="card-list">
                    <div class="d-flex justify-content-between">
                        <div class="task-list-header">
                            <h5>{taskList.name}</h5>
                            <small>{projectName}</small>
                        </div>
                        <div class="project-link-icon">
                            <i class="material-icons" onClick={redirect}>link</i>
                        </div>
                    </div>

                    <div class="card-list-body">
                        <div class="card-list">
                            <div class="card-list-head">
                                <h6>Open Tasks</h6>
                            </div>
                            <div class="card-list-body">
                                <ul class="list-group">
                                    {(filteredOpenTasks.length === 0) ?
                                        <div class="filter-quip">
                                            {(taskList.tasks.length > filteredOpenTasks.length) ?
                                                <muted>Sorry, no results were found for your search.</muted>
                                            :
                                                <muted>No Open Tasks!</muted>
                                            }
                                        </div>
                                    :
                                        filteredOpenTasks.map((task) => {
                                            return (
                                                <Task task={task} projectId={projectId} accountNumber={accountNumber} />
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