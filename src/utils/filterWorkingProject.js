/* global chrome */
import { filterProject } from "../data/settingsFilters";

export async function filterWorkingProject(Project) {
    // Grab Settings from Sync Storage
    let Settings = await chrome.storage.sync.get(["user_settings"]);
    Settings = Settings.user_settings;

    return filterProject(Project, Settings);
}