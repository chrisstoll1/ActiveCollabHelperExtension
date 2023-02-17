/* global chrome */
import { filterTaskList } from "../data/settingsFilters";

export async function filterWorkingTaskList(TaskList) {
    // Grab Settings from Sync Storage
    let Settings = await chrome.storage.sync.get(["user_settings"]);
    Settings = Settings.user_settings;

    return filterTaskList(TaskList, Settings.settingsToggles);
}