/* global chrome */
import { useNavigate } from 'react-router-dom';
import ProjectTaskListBadge from '../Badge/ProjectTaskListBadge';

function ProjectTaskList(props) {
    const navigate = useNavigate();
    
    async function handleClick() {
        await chrome.storage.local.set({"WorkingTaskList": JSON.stringify(props.task_list)});
        console.log(props.task_list);
        navigate('/taskList');
    }

    return (
        <li className="list-group-item d-flex align-items-start justify-content-between" onClick={handleClick}>
            <div className="d-flex justify-content-left align-items-center">
                <i className="material-icons">assignment</i>
                <p>{props.task_list.name} <span className="counter-text text-muted">({props.task_list.tasks.length})</span></p>
            </div>
            <ProjectTaskListBadge task_list={props.task_list} />
        </li>
    );
}

export default ProjectTaskList;