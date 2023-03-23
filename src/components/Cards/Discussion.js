/* global chrome */
import { formatUnixTimestamp } from "../../utils/formatUnixTimestamp"
import "../../assets/css/components/Cards/Discussion.css"
import ProjectDiscussionBadge from "../Badge/ProjectDiscussionBadge";

function Discussion(props){
    const discussionURL = `https://app.activecollab.com/${props.accountNumber}/projects/${props.projectId}/discussions?modal=Discussion-${props.discussion.id}-${props.projectId}`;

    function redirect(){
        chrome.tabs.create({url: discussionURL});
        console.log("Redirecting to: " + discussionURL);
    }

    const discussionIconClass = () => {
        if (props.discussion.flagged){
            return "material-icons discussion-icon discussion-flagged-icon-purple"
        }else{
            return "material-icons discussion-icon"
        }
    }    

    return (
        <li className="list-group-item d-flex align-items-start justify-content-between" onClick={redirect}>
                <span>
                    <div className="discussion-title">
                        <i className={discussionIconClass()}>chat</i>
                        <span className="discussion-name">{props.discussion.name}</span>
                    </div>
                    {(props.discussion.last_activity_excerpt === undefined) ?
                        null
                        :
                        <small className="discussion-excerpt" dangerouslySetInnerHTML={{ __html: props.discussion.last_activity_excerpt }}></small>
                    }
                    {(props.discussion.last_activity_by === undefined || props.discussion.last_active === undefined) ? 
                        null
                    : 
                        <div><small className="text-muted">{props.discussion.last_activity_by} on {formatUnixTimestamp(props.discussion.last_active)}</small></div>
                    }
                </span>
            <div>
                <div className="d-flex justify-content-right">
                    <ProjectDiscussionBadge discussion={props.discussion} />
                </div>
            </div>
        </li>
    )
}

export default Discussion