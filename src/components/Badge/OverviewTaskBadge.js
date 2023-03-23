import Badge from "./Badge";

function OverviewTaskBadge(props){
    const badgeColor = () => {
        if (props.project.task_lists_badge_level === 1){
            return "secondary";
        } else if (props.project.task_lists_badge_level === 2){
            return "success";
        } else if (props.project.task_lists_badge_level === 3){
            return "danger";
        }else{
            return "secondary";
        }
    }

    const badgeCounter = () => {
        if (props.project.task_lists.length === 0){
            return "0";
        }else{
            return props.project.task_lists.length;
        }
    }

    return (
        <Badge color={badgeColor()} icon={"assignment"} counter={badgeCounter()} />
    )
}

export default OverviewTaskBadge;