import Badge from "./Badge";

function OverviewDiscussionBadge(props){
    const badgeColor = () => {
        if (props.project.discussion_flag){
            return "purple";
        }else{
            return "secondary";
        }
    }

    const badgeCounter = () => {
        if (props.project.discussions.length === 0){
            return "0";
        }else{
            return props.project.discussions.length;
        }
    }

    return (
        <Badge color={badgeColor()} icon={"chat"} counter={badgeCounter()} customClass={"badge-width-100"} />
    )
}

export default OverviewDiscussionBadge;