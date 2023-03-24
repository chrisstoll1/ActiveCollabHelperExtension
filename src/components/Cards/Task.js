/* global chrome */
import { formatUnixTimestamp } from '../../utils/formatUnixTimestamp';
import Badge from '../Badge/Badge';
import '../../assets/css/components/Cards/Task.css';

function Task(props) {
    const taskURL = `https://app.activecollab.com/${props.accountNumber}/projects/${props.projectId}?modal=Task-${props.task.id}-${props.projectId}`;

    function redirect() {
        chrome.tabs.create({url: taskURL});
        console.log('Redirecting to: ' + taskURL);
    }

    const taskIcon = () => {
        if (props.task.status.includes('Completed')){
            return 'assignment_turned_in';
        }else if (props.task.status.includes('Overdue')){
            return 'notification_important';
        }else if (props.task.status.includes('Open')){
            return 'play_for_work';
        }else{
            return 'task_alt';
        }
    }

    return (
        <li className="list-group-item d-flex justify-content-between" onClick={redirect}>
            <div className="d-flex align-items-center justify-content-left">
                <i className="material-icons task-header-icon">{taskIcon()}</i>
                <span>
                    <div className="task-name-text">{props.task.name}</div>
                    {(props.task.due_on === null) ? 
                        null
                    : 
                        <small className="text-muted task-due-on-wrapper">
                            <i className="material-icons task-due-on-icon">event</i>
                            {formatUnixTimestamp(props.task.due_on)}
                        </small>
                    } 
                </span>
            </div>
            <div className="d-flex align-items-center justify-content-right">
                {(props.task.status.includes('Completed')) ? 
                    <Badge 
                        color="secondary" 
                        text="Completed"
                    /> 
                : 
                    null
                }
                {(props.task.status.includes('Open')) ? 
                    <Badge 
                        color="success" 
                        text="Open"
                    /> 
                : 
                    null
                }
                {(props.task.status.includes('Overdue')) ? 
                    <Badge 
                        color="danger" 
                        text="Overdue"
                    /> 
                : 
                    null
                }
            </div>
        </li>
    );
}

export default Task;