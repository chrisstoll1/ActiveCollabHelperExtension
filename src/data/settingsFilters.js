// NOTE: This is messy and needs to be refactored but it works for now

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

    const filteredDiscussions = discussions.map((discussion) => {
        var messageSenderFlagged = false;
        var messageSender = false;
        var messageDateFlagged = false;
        var messageDate = false;

        // Discussion Message Sender Filter
        if (discussion.last_activity_by) {
            if (SenderFilter.input !== "" && SenderFilter.select !== "") {
                messageSender = true;
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
            if (DateFilter.operator !== "" && DateFilter.type !== "" && (DateFilter.input !== "" || DateFilter.datepicker !== "")) {
                messageDate = true;
                const discussionDate = new Date(parseInt(discussion.last_active) * 1000);
                const filterDate = new Date(DateFilter.datepicker);
                const today = new Date();

                if (DateFilter.type === "static") {
                    if (DateFilter.operator === "before") {
                        if (discussionDate < filterDate) {
                            messageDateFlagged = true;
                        }
                    }else if (DateFilter.operator === "after") {
                        if (discussionDate > filterDate) {
                            messageDateFlagged = true;
                        }
                    }else if (DateFilter.operator === "on") {
                        if (discussionDate.toDateString() === filterDate.toDateString()) {
                            messageDateFlagged = true;
                        }
                    }
                }else if (DateFilter.type === "today+") {
                    var todayPlus = today + parseInt(DateFilter.input);

                    if (DateFilter.operator === "before") {
                        if (discussionDate < todayPlus) {
                            messageDateFlagged = true;
                        }
                    }else if (DateFilter.operator === "after") {
                        if (discussionDate > todayPlus) {
                            messageDateFlagged = true;
                        }
                    }else if (DateFilter.operator === "on") {
                        if (discussionDate.toDateString() === todayPlus.toDateString()) {
                            messageDateFlagged = true;
                        }
                    }
                }else if (DateFilter.type === "today-") {
                    var todayMinus = today - parseInt(DateFilter.input);

                    if (DateFilter.operator === "before") {
                        if (discussionDate < todayMinus) {
                            messageDateFlagged = true;
                        }
                    }else if (DateFilter.operator === "after") {
                        if (discussionDate > todayMinus) {
                            messageDateFlagged = true;
                        }
                    }else if (DateFilter.operator === "on") {
                        if (discussionDate.toDateString() === todayMinus.toDateString()) {
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
        if (SettingsToggles["hide-unflagged-discussions"]) {
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
    if (SettingsToggles["hide-completed-tasks"]) {
        hiddenBadges.push("Completed");
    }
    if (SettingsToggles["hide-open-tasks"]) {
        hiddenBadges.push("Open");
    }
    if (SettingsToggles["hide-overdue-tasks"]) {
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