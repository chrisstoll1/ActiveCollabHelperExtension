/* global chrome */

export async function FilterProjectData(Projects) {
    // Grab Settings from Sync Storage
    let Settings = await chrome.storage.sync.get(["user_settings"]);
    Settings = Settings.user_settings;
    console.log(`Settings:`);
    console.log(Settings);

    const FilteredProjects = Projects.map((project) => {
        return filterProject(project, Settings);
    }).filter((project) => {
        if (Settings.settingsToggles["hide-empty-projects"]){
            if (project.discussion_flag) { // && project.task_lists.length > 0
                return true;
            }else{
                return false;
            }
        }else{
            return true;
        }
    });

    console.log(`FilterProjectData:`);
    console.log(FilteredProjects);
    
    return FilteredProjects;
}

const filterProject = (project, Settings) => {
    const [DiscussionMessageDateFilter, DiscussionMessageSenderFilter, SettingsToggles] = [Settings.discussionMessageDateFilter, Settings.discussionMessageSenderFilter, Settings.settingsToggles];
    const [filteredDiscussions, project_discussion_flagged] = filterDiscussions(project.discussions, DiscussionMessageDateFilter, DiscussionMessageSenderFilter, SettingsToggles);
    
    project.discussions = filteredDiscussions;
    project.discussion_flag = project_discussion_flagged;

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

const filterTasks = (taskLists, SettingsToggles) => {
    // TODO: Filter Tasks based on Settings

    return taskLists;
}