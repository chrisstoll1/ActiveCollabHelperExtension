/* global chrome */
import { useContext, useEffect, useState } from 'react';
import { IsRefreshing, SetExtState, TaskListFilter } from '../context/ExtStateContext'
import Loading from '../components/Background/Loading';
import Task from '../components/Cards/Task';
import { filterWorkingTaskList } from '../utils/filterWorkingTaskList';
import '../assets/css/views/TaskList.css';
import TaskListHeader from '../components/Text/TaskListHeader';

function Tasklist(props) {
    const setExtState = useContext(SetExtState);
    const [taskList, setTaskList] = useState({tasks: [], badges: [], completed_tasks: 0, overdue_tasks: 0, open_tasks: 0}); //TODO: initialize with prop
    const [projectId, setProjectId] = useState(0);
    const [projectName, setProjectName] = useState("");
    const [accountNumber, setAccountNumber] = useState(0);
    const taskListFilter = useContext(TaskListFilter);
    const isRefreshing = useContext(IsRefreshing);
    const [loadingStorage, setLoadingStorage] = useState(false);
    const filteredTasks = taskList.tasks.filter(task => task.name.toLowerCase().includes(taskListFilter.toLowerCase()));

    //Split tasks into completed and open
    const completedTasks = taskList.tasks.filter(task => task.status.includes('Completed'));
    const openTasks = taskList.tasks.filter(task => task.status.includes('Open'));
    const completedFilteredTasks = filteredTasks.filter(task => task.status.includes('Completed'));
    const openFilteredTasks = filteredTasks.filter(task => task.status.includes('Open'));

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
                    <TaskListHeader filteredTasks={filteredTasks} taskList={taskList} projectName={projectName} />

                    <div className="card-list-body">
                        <div className="card-list">
                            <div className="card-list-head">
                                <h6>Open Tasks</h6>
                            </div>
                            <div className="card-list-body">
                                <ul className="list-group">
                                    {(openFilteredTasks.length === 0) ?
                                        <div className="filter-quip">
                                            {(openTasks.length > openFilteredTasks.length) ?
                                                <div className="text-muted">Sorry, no results were found for your search.</div>
                                            :
                                                <div className="text-muted">No Open Tasks!</div>
                                            }
                                        </div>
                                    :
                                        openFilteredTasks.map((task, index) => {
                                            if (task.status.includes("Open")){
                                                return (
                                                    <Task key={index} task={task} projectId={projectId} accountNumber={accountNumber} />
                                                )
                                            }
                                        })   
                                    }
                                </ul>
                            </div>
                        </div>

                        <div className="card-list">
                            <div className="card-list-head">
                                <h6>Completed Tasks</h6>
                            </div>
                            <div className="card-list-body">
                                <ul className="list-group">
                                    {(completedFilteredTasks.length === 0) ?
                                        <div className="filter-quip">
                                            {(completedTasks.length > completedFilteredTasks.length) ?
                                                <div className="text-muted">Sorry, no results were found for your search.</div>
                                            :
                                                <div className="text-muted">No Completed Tasks!</div>
                                            }
                                        </div>
                                    :
                                        completedFilteredTasks.map((task, index) => {
                                            if (task.status.includes("Completed")){
                                                return (
                                                    <Task key={index} task={task} projectId={projectId} accountNumber={accountNumber} />
                                                )
                                            }
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