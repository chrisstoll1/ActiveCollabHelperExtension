/* global chrome */
import { formatUnixTimestamp } from '../../helpers';

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
        <li class="list-group-item d-flex justify-content-between" onClick={redirect}>
            <div className={taskTitleWrapperClass()}>
                <div>
                    <span><i class="material-icons">task_alt</i> </span>
                </div>
                <div>
                    <p class="discussion-name">{props.task.name}</p>
                    <div>{(props.task.due_on === null) ? 
                        <small></small>
                    : 
                        <small>Due on {formatUnixTimestamp(props.task.due_on)}</small>
                    }
                    </div>
                </div>
            </div>
            <div>
                <div class="d-flex justify-content-right">
                    <div>
                        <small></small>
                    </div>
                    <div>
                        {(props.task.status.includes('Open')) ? <span class="badge badge-success">Open</span> : null}
                        {(props.task.status.includes('Overdue')) ? <span class="badge badge-danger">Overdue</span> : null}
                    </div>
                </div>
            </div>
        </li>
    );
}

export default Task;