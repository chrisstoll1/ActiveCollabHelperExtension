export const filterProject = (project, Settings) => {
    const [DiscussionMessageDateFilter, DiscussionMessageSenderFilter, SettingsToggles] = [Settings.discussionMessageDateFilter, Settings.discussionMessageSenderFilter, Settings.settingsToggles];
    const [filteredDiscussions, project_discussion_flagged] = filterDiscussions(project.discussions, DiscussionMessageDateFilter, DiscussionMessageSenderFilter, SettingsToggles);
    const [filteredTaskLists, task_lists_badge_level] = filterTaskLists(project.task_lists, SettingsToggles);

    project.discussions = filteredDiscussions;
    project.discussion_flag = project_discussion_flagged;
    project.task_lists = filteredTaskLists;
    project.task_lists_badge_level = task_lists_badge_level;

    return project;
}

const filterDiscussions = (discussions, DateFilter, SenderFilter, SettingsToggles) => {
    let project_discussion_flagged = false;
    let messageSender = SenderFilter.input !== "" && SenderFilter.select !== "";
    let messageDate = DateFilter.operator !== "";

    const filteredDiscussions = discussions.map((discussion) => {
        let messageSenderFlagged = false;
        let messageDateFlagged = false;

        // Discussion Message Sender Filter
        if (discussion.last_activity_by) {
            if (messageSender) {
                if (SenderFilter.select === "contains"){
                    if (discussion.last_activity_by.toLowerCase().includes(SenderFilter.input.toLowerCase())) {
                        messageSenderFlagged = true;
                    }
                }else if (SenderFilter.select === "doesNotContain"){
                    if (!discussion.last_activity_by.toLowerCase().includes(SenderFilter.input.toLowerCase())) {
                        messageSenderFlagged = true;
                    }
                }
            }
        }

        // Discussion Message Date Filter
        if (discussion.last_active) {
            // operators: today, last7, last30, last90, custom
            if (messageDate) {
                const discussionDate = new Date(parseInt(discussion.last_active) * 1000);
                const today = new Date();

                if (DateFilter.operator === "today") {
                    if (discussionDate.toDateString() === today.toDateString()) {
                        messageDateFlagged = true;
                    }
                }else if (DateFilter.operator === "last7") {
                    const last7 = new Date(today.setDate(today.getDate() - 7));
                    if (discussionDate >= last7) {
                        messageDateFlagged = true;
                    }
                }else if (DateFilter.operator === "last30") {
                    const last30 = new Date(today.setDate(today.getDate() - 30));
                    if (discussionDate >= last30) {
                        messageDateFlagged = true;
                    }
                }else if (DateFilter.operator === "last90") {
                    const last90 = new Date(today.setDate(today.getDate() - 90));
                    if (discussionDate >= last90) {
                        messageDateFlagged = true;
                    }
                }else if (DateFilter.operator === "custom") {
                    // parse date range string from datepicker into date objects, check if discussion date is between the two. Account for single dates in string.
                    const dateRange = DateFilter.datepicker.split(" to ");
                    const date1 = new Date(dateRange[0]);
                    const date2 = new Date(dateRange[1]);
                    if (dateRange.length === 1) {
                        if (discussionDate.toDateString() === date1.toDateString()) {
                            messageDateFlagged = true;
                        }
                    }else if (dateRange.length === 2) {
                        if (discussionDate >= date1 && discussionDate <= date2) {
                            messageDateFlagged = true;
                        }
                    }
                }
            }
        }
        
        // Discussion Flagged
        if (messageSender && messageDate) {
            if (messageSenderFlagged && messageDateFlagged) {
                discussion.flagged = true;
                project_discussion_flagged = true;
            }else{
                discussion.flagged = false;
            }
        }else if (messageSender) {
            if (messageSenderFlagged) {
                discussion.flagged = true;
                project_discussion_flagged = true;
            }else{
                discussion.flagged = false;
            }
        }else if (messageDate) {
            if (messageDateFlagged) {
                discussion.flagged = true;
                project_discussion_flagged = true;
            }else{
                discussion.flagged = false;
            }
        }else{
            discussion.flagged = false;
        }

        return discussion;
    }).filter((discussion) => {
        // Hide Unflagged Discussions
        if (SettingsToggles["filter"] && (messageSender || messageDate)) {
            return discussion.flagged;
        }else{
            return true;
        }
    });

    return [filteredDiscussions, project_discussion_flagged];
}

const filterTaskLists = (taskLists, SettingsToggles) => {
    // loop through task lists
    const filteredTaskLists = taskLists.map((taskList) => {
        return filterTaskList(taskList, SettingsToggles);
    });

    // remove null task lists
    const newFilteredtaskLists = filteredTaskLists.filter((taskList) => taskList !== null);
    let badge_level = 0;

    // recalculate task list badge level
    newFilteredtaskLists.forEach((taskList) => {
        var taskListBadgeLevel = 0;
        if (taskList.badges.includes("Completed")) {
            taskListBadgeLevel = 1;
        }
        if (taskList.badges.includes("Open")) {
            taskListBadgeLevel = 2;
        }
        if (taskList.badges.includes("Overdue")) {
            taskListBadgeLevel = 3;
        }       
        if (taskListBadgeLevel > badge_level) {
            badge_level = taskListBadgeLevel;
        }
    });  

    return [newFilteredtaskLists, badge_level];
}

export const filterTaskList = (taskList, SettingsToggles) => {
    const hiddenBadges = [];
    if (!SettingsToggles["show-completed-tasks"]) {
        hiddenBadges.push("Completed");
    }
    if (!SettingsToggles["show-open-tasks"]) {
        hiddenBadges.push("Open");
    }
    if (!SettingsToggles["show-overdue-tasks"]) {
        hiddenBadges.push("Overdue");
    }

    // if badges include a hidden one
    if (taskList.badges.some((badge) => hiddenBadges.includes(badge))) {
        // loop through tasks
        const filteredTasks = taskList.tasks.map((task) => {
            // if badges include a hidden one
            if (task.status.some((badge) => hiddenBadges.includes(badge))) {
                // remove badge
                task.status = task.status.filter((badge) => !hiddenBadges.includes(badge));
            }
            // if there are no other badges remove the task
            if (task.status.length === 0) {
                return null;
            }else{
                return task;
            }
        });
        // remove null tasks
        taskList.tasks = filteredTasks.filter((task) => task !== null);

        // remove hidden badges from taskList
        taskList.badges = taskList.badges.filter((badge) => !hiddenBadges.includes(badge));
    }
    // if there are no other tasks remove the task list
    if (taskList.tasks.length === 0) {
        return null;
    }

    return taskList;
}