/* global chrome */
import { filterProject } from "../data/settingsFilters";
import { sortProjects } from "../data/projectSorting";

export async function filterProjectData(Projects, SortOption, SortDirection) {
    // Grab Settings from Sync Storage
    let Settings = await chrome.storage.sync.get(["user_settings"]);
    Settings = Settings.user_settings;
    let projectLabelsFilter = Settings.projectLabelsFilter;

    // Grab Mute States from Sync Storage
    let MuteStates = await chrome.storage.sync.get(["MuteStates"]);
    MuteStates = MuteStates.MuteStates;

    // Filter Projects
    const FilteredProjects = Projects.map((project) => {
        if (Settings.settingsToggles['filter']){
            return filterProject(project, Settings);
        }
        return project;
    }).filter((project) => {
        if (Settings.settingsToggles['filter']){
            if (MuteStates !== undefined){
                if (project && project.id && MuteStates[project.id]) {
                    // Check if project is muted
                    if (MuteStates[project.id].state > 0) {
                        return false;
                    }
                }
            }
            // Check if project data is valid (has discussions and task lists) and label filter is met
            if (project.discussions.length > 0 && project.task_lists.length > 0) {
                if (projectLabelsFilter.length > 0) { //if label filter is not empty
                    const projectLeader = project.leader;
                    const projectCategory = project.category;
                    if (projectLabelsFilter.some((label) => label.value === projectLeader)) {
                        return true;
                    }
                    if (projectLabelsFilter.some((label) => label.value === projectCategory)) {
                        return true;
                    }
                    return false;
                }
                return true;
            }
            return false;
        }
        return true;
    });

    // Sort Projects
    const SortedFilteredProjects = sortProjects(FilteredProjects, SortOption, SortDirection);
    
    // Returned Formatted Projects
    return SortedFilteredProjects;
}
