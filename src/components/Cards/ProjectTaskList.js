/* global chrome */
import { useContext } from 'react';
import { SetExtState } from '../../context/ExtStateContext'

function ProjectTaskList(props) {
    const setExtState = useContext(SetExtState);
    
    function handleClick() {
        chrome.storage.local.set({"WorkingTaskList": JSON.stringify(props.task_list)});
        setExtState("TaskList");
    }

    return (
        <li className="list-group-item d-flex align-items-start justify-content-between" onClick={handleClick}>
            <div className="d-flex justify-content-left">
                <div>
                    <span><i className="material-icons">assignment</i> </span>
                </div>
                <div>
                    <p>{props.task_list.name}</p>
                </div>
            </div>
            <div>
                <div className="d-flex justify-content-right">
                    <div>
                        <small></small>
                    </div>
                    <div>
                        {(props.task_list.badges.includes('Completed')) ? <span className="badge badge-secondary">Completed {props.task_list.completed_tasks}</span> : null}
                        {(props.task_list.badges.includes('Open')) ? <span className="badge badge-success">Open {props.task_list.open_tasks}</span> : null}
                        {(props.task_list.badges.includes('Overdue')) ? <span className="badge badge-danger">Overdue {props.task_list.overdue_tasks}</span> : null}
                    </div>
                </div>
            </div>
        </li>
    );
}

export default ProjectTaskList;