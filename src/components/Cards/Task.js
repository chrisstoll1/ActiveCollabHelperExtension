/* global chrome */
import { formatUnixTimestamp } from '../../utils/formatUnixTimestamp';

function Task(props) {
    const taskURL = `https://app.activecollab.com/${props.accountNumber}/projects/${props.projectId}?modal=Task-${props.task.id}-${props.projectId}`;

    function redirect() {
        chrome.tabs.create({url: taskURL});
        console.log('Redirecting to: ' + taskURL);
    }

    const taskTitleWrapperClass = () => {
        if (props.task.due_on === null) {
            return 'd-flex justify-content-left';
        } else {
            return 'd-flex align-items-center justify-content-left';
        }
    };

    return (
        <li className="list-group-item d-flex justify-content-between" onClick={redirect}>
            <div className={taskTitleWrapperClass()}>
                <div>
                    <span><i className="material-icons">task_alt</i> </span>
                </div>
                <div>
                    <p className="discussion-name">{props.task.name}</p>
                    <div>{(props.task.due_on === null) ? 
                        <small></small>
                    : 
                        <small>Due on {formatUnixTimestamp(props.task.due_on)}</small>
                    }
                    </div>
                </div>
            </div>
            <div>
                <div className="d-flex justify-content-right">
                    <div>
                        <small></small>
                    </div>
                    <div>
                        {(props.task.status.includes('Completed')) ? <span className="badge badge-secondary">Completed</span> : null}
                        {(props.task.status.includes('Open')) ? <span className="badge badge-success">Open</span> : null}
                        {(props.task.status.includes('Overdue')) ? <span className="badge badge-danger">Overdue</span> : null}
                    </div>
                </div>
            </div>
        </li>
    );
}

export default Task;