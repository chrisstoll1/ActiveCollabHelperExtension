/* global chrome */
import { filterProject } from "../data/settingsFilters";

export async function filterProjectData(Projects) {
    // Grab Settings from Sync Storage
    let Settings = await chrome.storage.sync.get(["user_settings"]);
    Settings = Settings.user_settings;

    const FilteredProjects = Projects.map((project) => {
        return filterProject(project, Settings);
    }).filter((project) => {
        if (Settings.settingsToggles["hide-empty-projects"]){
            if (project.discussions.length > 0 || project.task_lists.length > 0) {
                return true;
            }else{
                return false;
            }
        }else{
            return true;
        }
    });
    
    return FilteredProjects;
}
