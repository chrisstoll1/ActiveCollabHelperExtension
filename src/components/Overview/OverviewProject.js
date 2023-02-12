/* global chrome */
import { useContext } from 'react';
import { SetExtState } from '../../ExtStateContext';
import { formatUnixTimestamp } from '../../helpers';
import './OverviewProject.css';

function OverviewProject(props) {
    const setExtState = useContext(SetExtState);

    function handleClick() {
        console.log(props.project);
        chrome.storage.local.set({"WorkingProject": JSON.stringify(props.project)});
        setExtState("Project");
    }

    const taskClass = () => {
        if (props.project.task_lists_badge_level === 1){
            return "badge badge-secondary";
        } else if (props.project.task_lists_badge_level === 2){
            return "badge badge-success";
        } else if (props.project.task_lists_badge_level === 3){
            return "badge badge-danger";
        }else{
            return "badge badge-secondary";
        }
    }

    const discussionClass = () => {
        if (props.project.discussion_flag){
            return "badge badge-purple";
        }else{
            return "badge badge-secondary";
        }
    }

    return (
        <div class="card card-task card-project" onClick={handleClick}>
            <div class="card-body">
                <div class="card-title">
                    <h6 data-filter-by="text" class="H6-filter-by-text">{props.project.name}</h6>
                    <span class="text-small">Last Activity: {formatUnixTimestamp(props.project.last_active)}</span>
                </div>
                <div class="card-meta">
                    <div class="card-options">
                        <span className={taskClass()}>Tasks {props.project.count_tasks}</span>
                        <span className={discussionClass()}>Discussions {props.project.count_discussions}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default OverviewProject;

