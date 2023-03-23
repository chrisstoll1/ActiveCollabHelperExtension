/* global chrome */
import { useContext } from 'react';
import { SetExtState } from '../../context/ExtStateContext'
import ProjectTaskListBadge from '../Badge/ProjectTaskListBadge';

function ProjectTaskList(props) {
    const setExtState = useContext(SetExtState);
    
    function handleClick() {
        chrome.storage.local.set({"WorkingTaskList": JSON.stringify(props.task_list)});
        setExtState("TaskList");
    }

    return (
        <li className="list-group-item d-flex align-items-start justify-content-between" onClick={handleClick}>
            <div className="d-flex justify-content-left align-items-center">
                <i className="material-icons">assignment</i>
                <p>{props.task_list.name}</p>
            </div>
            <ProjectTaskListBadge task_list={props.task_list} />
        </li>
    );
}

export default ProjectTaskList;