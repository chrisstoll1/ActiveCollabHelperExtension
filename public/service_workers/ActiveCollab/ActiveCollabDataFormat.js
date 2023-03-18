export const formatProject = (project, projectTasks, projectDiscussions) => {
    const [formattedTaskLists, project_badge_level] = formatProjectTaskLists(projectTasks);
    const [formattedDiscussions, project_discussion_flagged] = formatProjectDiscussions(projectDiscussions);

    return {
        name: project.name,
        id: project.id,
        label: project.label_text,
        leader: project.leader_name,
        category: project.category_text,
        count_tasks: project.count_tasks,
        count_discussions: project.count_discussions,
        last_active: project.last_activity_on,
        task_lists_badge_level: project_badge_level,
        task_lists: formattedTaskLists,
        discussion_flag: project_discussion_flagged,
        discussions: formattedDiscussions
    };
};
  
const formatProjectTaskLists = (projectTasks) => {
    let project_badge_level = 0;

    const formattedTaskLists = projectTasks.task_lists.map((taskList) => {
        const [formattedTasks, taskListStatusList, taskList_badge_level, taskList_Overdue_Count, taskList_Open_Count] = formatProjectTaskListTasks(projectTasks, taskList);

        // Update the project badge level if the current task list has a higher level
        if (taskList_badge_level > project_badge_level) {
            project_badge_level = taskList_badge_level;
        }

        return {
            name: taskList.name,
            id: taskList.id,
            open_tasks: taskList_Open_Count,
            completed_tasks: taskList.completed_tasks,
            overdue_tasks: taskList_Overdue_Count,
            badges: taskListStatusList,
            tasks: formattedTasks
        };
    });

    return [formattedTaskLists, project_badge_level];
};

const formatProjectTaskListTasks = (projectTasks, taskList) => {
    // Filter all tasks to only include the tasks for the current task list
    const filteredTasks = projectTasks.tasks.filter((task) => {
        return task.task_list_id === taskList.id;
    });

    // Initialize the status list and badge level
    // Assume Completed if there are any completed tasks
    let taskListStatusList = (taskList.completed_tasks > 0) ? ['Completed'] : [];
    let taskList_badge_level = (taskList.completed_tasks > 0) ? 1 : 0;
    let taskList_Overdue_Count = 0;
    let taskList_Open_Count = 0;

    const formattedTasks = filteredTasks.map((task) => { //NOTE: Keep in mind, this is only run per OPEN task, not all tasks
        // initialize the status list and badge level
        let taskStatusList = [];
        let task_level = 0;
        
        // If the task is completed, add the status and update the badge level
        if (task.is_completed) {
            taskStatusList.push('Completed');
            task_level = 1;
        }else{
            // Otherwise, assume it is open
            taskStatusList.push('Open');
            task_level = 2;
            taskList_Open_Count++;

            // If the task is open
            // Determine if the task is overdue
            if ((task.due_on < Math.floor(Date.now() / 1000)) && task.due_on !== null) {
                taskStatusList.push('Overdue');
                task_level = 3;
                taskList_Overdue_Count++;
            }
        }

        // Add the status to the status list if it doesn't already exist
        taskStatusList.forEach((taskStatus) => {
            if (!taskListStatusList.includes(taskStatus)) {
                taskListStatusList.push(taskStatus);
            }
        });

        // Update the badge level if the current task has a higher level
        if (task_level > taskList_badge_level) {
            taskList_badge_level = task_level;
        }

        return {
            name: task.name,
            id: task.id,
            due_on: task.due_on,
            status: taskStatusList
        };
    });

    return [formattedTasks, taskListStatusList, taskList_badge_level, taskList_Overdue_Count, taskList_Open_Count];
};

const formatProjectDiscussions = (projectDiscussions) => {
    let project_discussion_flagged = false;

    const formattedDiscussions = projectDiscussions.discussions.map((discussion) => {
        // If there are comments, get the last comment's created_on and created_by_email
        let last_active, last_activity_by;
        if (discussion.comments_count > 0) {
            const lastComment = projectDiscussions.comments.Discussion[discussion.id];
            last_active = lastComment.created_on;
            last_activity_by = lastComment.created_by_email;
        }

        let discussionFlagged = false;

        // If the discussion is flagged, set the project discussion flag to true
        if (discussionFlagged) {
            project_discussion_flagged = true;
        }

        return {
            name: discussion.name,
            id: discussion.id,
            comments_count: discussion.comments_count,
            last_active: last_active,
            last_activity_by: last_activity_by,
            flagged: discussionFlagged
        };
    });

    return [formattedDiscussions, project_discussion_flagged];
};