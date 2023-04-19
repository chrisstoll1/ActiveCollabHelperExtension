import { filterProjectData } from "./filterProjectData.js";

export async function setChromeBadge(projects) {
    // console.log("Updating Chrome Badge");
    filterProjectData(projects, "name", "asc").then( async (filteredProjects) => {
        // Grab Settings from Sync Storage
        let Settings = await chrome.storage.sync.get(["user_settings"]);
        Settings = Settings.user_settings;

        // Set Badge Text
        let BadgeText = "";
        if (Settings.settingsToggles["show-badge-count"]) {
            BadgeText = filteredProjects.length.toString();
        }

        // Set Badge
        chrome.action.setBadgeText({ text: BadgeText });
    });
}