import Badge from "./Badge";

function ProjectTaskListBadge(props) {
    return (
        <div className="badge-container-horizontal">
            {(props.task_list.badges.includes('Completed')) ? 
                    <Badge 
                        color="secondary" 
                        icon="assignment_turned_in" 
                        counter={ props.task_list.completed_tasks.toString()} 
                    /> 
                :   
                    null
            }

            {(props.task_list.badges.includes('Open')) ? 
                    <Badge
                        color="success"
                        icon="play_for_work"
                        counter={props.task_list.open_tasks.toString()}
                    />
                :
                    null
            }

            {(props.task_list.badges.includes('Overdue')) ?
                    <Badge
                        color="danger"
                        icon="notification_important"
                        counter={props.task_list.overdue_tasks.toString()}
                    />
                :
                    null
            }
        </div>
    )
}

export default ProjectTaskListBadge;