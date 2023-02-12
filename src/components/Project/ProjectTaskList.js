/* global chrome */
import { useContext } from 'react';
import { SetExtState } from '../../ExtStateContext';

function ProjectTaskList(props) {
    const setExtState = useContext(SetExtState);
    
    function handleClick() {
        chrome.storage.local.set({"WorkingTaskList": JSON.stringify(props.task_list)});
        setExtState("TaskList");
    }

    return (
        <li class="list-group-item d-flex align-items-start justify-content-between" onClick={handleClick}>
            <div class="d-flex justify-content-left">
                <div>
                    <span><i class="material-icons">assignment</i> </span>
                </div>
                <div>
                    <p>{props.task_list.name}</p>
                </div>
            </div>
            <div>
                <div class="d-flex justify-content-right">
                    <div>
                        <small></small>
                    </div>
                    <div>
                        {(props.task_list.badges.includes('Completed')) ? <span class="badge badge-secondary">Completed {props.task_list.completed_tasks}</span> : null}
                        {(props.task_list.badges.includes('Open')) ? <span class="badge badge-success">Open {props.task_list.open_tasks}</span> : null}
                        {(props.task_list.badges.includes('Overdue')) ? <span class="badge badge-danger">Overdue {props.task_list.overdue_tasks}</span> : null}
                    </div>
                </div>
            </div>
        </li>
    );
}

export default ProjectTaskList;