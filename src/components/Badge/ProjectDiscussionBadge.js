import Badge from "./Badge";

function ProjectDiscussionBadge(props){
    const badgeColor = () => {
        if (props.discussion.flagged){
            return "purple";
        }else{
            return "secondary";
        }
    }

    return (
        <Badge color={badgeColor()} text={`Comments ${props.discussion.comments_count}`} />
    )
}

export default ProjectDiscussionBadge;