import ProjectTaskListBadge from "../Badge/ProjectTaskListBadge";

function TaskListHeader(props){
    const { filteredTasks, taskList, projectName } = props;

    function tasksCoutner() {
        let counterText;
        if (filteredTasks.length === taskList.tasks.length) {
            counterText = `(${taskList.tasks.length})`;
        } else {
            counterText = `(${filteredTasks.length} of ${taskList.tasks.length})`;
        }
        return counterText;
    }

    return (
        <div className="d-flex justify-content-between task-list-header-wrapper">
            <div className="task-list-header">
                <div className="task-list-header-title">
                    <i className="material-icons">assignment</i>
                    <h5>{taskList.name}</h5>
                    <div className='overview-counter-text text-muted inline-element'>
                        {' '}
                        {tasksCoutner()}
                    </div>
                </div>
                <small>{projectName}</small>
            </div>
            <div className="task-list-header-badges">
                <ProjectTaskListBadge task_list={taskList} />
            </div>
        </div>
    )
}

export default TaskListHeader;