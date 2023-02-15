/* global chrome */
import { formatUnixTimestamp } from "../../assets/js/helpers"
import "./Discussion.css"

function Discussion(props){
    const discussionURL = `https://app.activecollab.com/${props.accountNumber}/projects/${props.projectId}/discussions?modal=Discussion-${props.discussion.id}-${props.projectId}`;

    function redirect(){
        chrome.tabs.create({url: discussionURL});
        console.log("Redirecting to: " + discussionURL);
    }

    const discussionTitleWrapperClass = () => {
        if (props.discussion.last_activity_by === undefined || props.discussion.last_active === undefined){
            return "d-flex justify-content-left"
        }else{
            return "d-flex align-items-center justify-content-left"
        }
    }

    const discussionIconClass = () => {
        if (props.discussion.flagged){
            return "material-icons discussion-flagged-icon-purple"
        }else{
            return "material-icons"
        }
    }

    const discussionBadgeClass = () => {
        if (props.discussion.flagged){
            return "badge discussion-flagged-badge-purple"
        }else{
            return "badge badge-secondary"
        }
    }

    return (
        <li class="list-group-item d-flex align-items-start justify-content-between" onClick={redirect}>
            <div className={discussionTitleWrapperClass()}>
                <div>
                    <span><i className={discussionIconClass()}>chat</i> </span>
                </div>
                <div>
                    <p class="discussion-name">{props.discussion.name}</p>
                    <div>{(props.discussion.last_activity_by === undefined || props.discussion.last_active === undefined) ? 
                        <small></small>
                    : 
                        <small>Last message by {props.discussion.last_activity_by} on {formatUnixTimestamp(props.discussion.last_active)}</small>
                    }
                    </div>
                </div>
            </div>
            <div>
                <div class="d-flex justify-content-right">
                    <div>{(props.discussion.comments_count === null) ?
                        <div></div>
                    :
                        <span className={discussionBadgeClass()}>
                            Comments {props.discussion.comments_count}
                        </span>
                    }
                    </div>
                </div>
            </div>
        </li>
    )
}

export default Discussion