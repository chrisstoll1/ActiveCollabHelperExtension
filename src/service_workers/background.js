import { setChromeBadge } from "../utils/setChromeBadge";
import { GetInitial, GetProjectsDATA, GetProjectLabelsDATA, GetProjectCategoriesDATA, GetProjectsChildDATA, GetProjectsLeadersDATA } from './ActiveCollab/ActiveCollabAPI.js';
import { formatProject } from './ActiveCollab/ActiveCollabDataFormat.js';

chrome.runtime.onInstalled.addListener(async () => {
    console.log("Installed!");
    resetSyncedSettings();
});

chrome.runtime.onMessage.addListener(async (request, sender, reply) => {
    if (request.event === "refresh"){
      refreshActiveCollabData();   
    }
    if (request.event === "activecollab_token"){
      chrome.storage.sync.set({"PHPSESSID": request.token});
      chrome.storage.sync.set({"activecollab_user_instances": request.instance});
    }
    if (request.event === "delete_token"){
      await removeSyncStorageObject("PHPSESSID");
      await removeSyncStorageObject("activecollab_user_instances");
      await removeLocalStorageObject("ACProjects");
      await removeLocalStorageObject("WorkingProject");
      await removeLocalStorageObject("WorkingTaskList");
      await removeLocalStorageObject("LastRefreshTime");
      await removeLocalStorageObject("ACLeaders");
      await removeLocalStorageObject("SortCache");
      refreshActiveCollabData();
    }
    if (request.event === "reset_settings"){
      await resetSyncedSettings();
      chrome.runtime.sendMessage({event: "settings_reset"});
    }
    if (request.event === "auto_refresh_settings_updated"){
      let period = request.autoRefreshOptions.input;
      let type = request.autoRefreshOptions.select;
      let enabled = request.autoRefreshOptions.isOn;
      await configureAutoRefreshAlarm(period, type, enabled);
    }
});

chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name === 'auto-refresh-alarm') {
    await refreshActiveCollabData();
  }
});

async function refreshActiveCollabData() {
  // Delete existing data DEBUG
  // await removeLocalStorageObject("ACProjects");

  // Cache Project data
  var oldActiveCollabData = await chrome.storage.local.get(["ACProjects"]);
  if (Object.keys(oldActiveCollabData).length === 0){
      oldActiveCollabData = [];
  }else{
      oldActiveCollabData = JSON.parse(oldActiveCollabData.ACProjects);
  }
  // Cached Leader Data
  var oldLeaderData = await chrome.storage.local.get(["ACLeaders"]);
  if (Object.keys(oldLeaderData).length === 0){
      oldLeaderData = [];
  }else{
      oldLeaderData = JSON.parse(oldLeaderData.ACLeaders);
  }

  // Remove existing data from storage
  await removeLocalStorageObject("ACProjects");
  await removeLocalStorageObject("ACLeaders");

  if (await isTokenValid()) {
    // Get new data
    const [activeCollabData, projectLeaderData] = await buildActiveCollabDataObject(oldActiveCollabData, oldLeaderData);

    //Set refresh time
    var date = new Date();
    var refreshTime = date.toLocaleString();
    await chrome.storage.local.set({"LastRefreshTime": refreshTime});
    try {
      await chrome.runtime.sendMessage({event: "refresh-date-updated"});
    } catch (error) {
      console.log(error);
    }

    //Set Local Storage to new data
    await chrome.storage.local.set({"ACProjects": JSON.stringify(activeCollabData)});
    await chrome.storage.local.set({"ACLeaders": JSON.stringify(projectLeaderData)});

    //Set Chrome Badge to number of projects
    await setChromeBadge(activeCollabData);

    //Refresh working project if it exists
    await chrome.storage.local.get(["WorkingProject"], async function(result) {
      if (Object.keys(result).length === 0){
          //Do nothing
      }else{ 
          var workingProject = JSON.parse(result.WorkingProject);
          var newWorkingProject = activeCollabData.filter((project) => {
              return project.id === workingProject.id;
          });
          await chrome.storage.local.set({"WorkingProject": JSON.stringify(newWorkingProject[0])});

          //Refresh working tasklist if it exists
          await chrome.storage.local.get(["WorkingTaskList"], async function(result) {
              if (Object.keys(result).length === 0){
                  //Do nothing
              }else{
                  var workingTaskList = JSON.parse(result.WorkingTaskList);
                  var newWorkingTaskList = newWorkingProject[0].task_lists.filter((taskList) => {
                      return taskList.id === workingTaskList.id;
                  });
                  await chrome.storage.local.set({"WorkingTaskList": JSON.stringify(newWorkingTaskList[0])});
              }
          });
      }
    });

    try {
      await chrome.runtime.sendMessage({event: "updated"});
    } catch (error) {
      console.log(error);
    }
  }else{
    console.log("INVALID TOKEN");
    try {
      await chrome.runtime.sendMessage({event: "invalid_token"});
    } catch (error) {
      console.log(error);
    }
  }
}

async function buildActiveCollabDataObject(oldActiveCollabData, oldLeaderData) {
  var PHPSESSID = await chrome.storage.sync.get(["PHPSESSID"])
  var accountNumber = await chrome.storage.sync.get(["activecollab_user_instances"])
  PHPSESSID = PHPSESSID.PHPSESSID.toString();
  accountNumber = accountNumber.activecollab_user_instances.toString();
  var sessionCookie = `PHPSESSID=${PHPSESSID}`;

  //Get List of Projects
  var projectsRAW = await GetProjectsDATA(sessionCookie, accountNumber);

  //Project Data (Discussions, Tasks)
  const projectData = await GetProjectsChildDATA(sessionCookie, accountNumber, projectsRAW, oldActiveCollabData);

  //Get List of Labels for all projects
  const projectLabels = await GetProjectLabelsDATA(sessionCookie, accountNumber);

  //Get List of Categories for all projects
  const projectCategories = await GetProjectCategoriesDATA(sessionCookie, accountNumber);

  //Get List of Leaders for all projects
  const projectLeaders = await GetProjectsLeadersDATA(sessionCookie, accountNumber, projectsRAW, oldLeaderData);

  //Format the data into a single object
  const projectsWithData = projectsRAW.map((project, index) => {
    // If old data is valid use it
    if (project.useOldData) {
      return oldActiveCollabData.find(oldProject => oldProject.id === project.id);
    }

    // Deconstruct the project data
    const [projectTasks, projectTasksArchived, projectDiscussions] = projectData[index];

    // Combine active and archived tasks
    let projectTasksAll = projectTasks;
    projectTasksAll.tasks = projectTasks.tasks.concat(projectTasksArchived);

    // Add label text to project 
    const foundLabel = projectLabels.find(label => label.id === project.label_id);
    if (foundLabel) {
      project.label_text = foundLabel.name;
    }

    // Add category text to project
    const foundCategory = projectCategories.find(category => category.id === project.category_id);
    if (foundCategory) {
      project.category_text = foundCategory.name;
    }

    // Add leader name to project
    const foundLeader = projectLeaders.find(leader => leader.id === project.leader_id);
    if (foundLeader) {
      project.leader_name = foundLeader.display_name;
    }

    // format the project data
    return formatProject(project, projectTasksAll, projectDiscussions);
  });

  return [projectsWithData, projectLeaders];
}

async function isTokenValid() {
  var PHPSESSID = await chrome.storage.sync.get(["PHPSESSID"]);
  var accountNumber = await chrome.storage.sync.get(["activecollab_user_instances"]);
  if (Object.keys(PHPSESSID).length === 0 && Object.keys(accountNumber).length === 0){
    return false;
  }else{
    PHPSESSID = PHPSESSID.PHPSESSID.toString();
    accountNumber = accountNumber.activecollab_user_instances.toString();
    var sessionCookie = `PHPSESSID=${PHPSESSID}`;

    var validTokenRequestResponse = await GetInitial(sessionCookie, accountNumber);
    if (!validTokenRequestResponse.ok){
        return false;
    }
  }
  return true;
}

async function removeLocalStorageObject(key) {
  try {
    const items = await new Promise((resolve, reject) => {
      chrome.storage.local.get(key, function (items) {
        resolve(items);
      });
    });

    if (items.hasOwnProperty(key)) {
      await new Promise((resolve, reject) => {
        chrome.storage.local.remove(key, function () {
          resolve();
        });
      });
      console.log(`Local storage object with key '${key}' has been removed.`);
    } else {
      console.log(`No local storage object with key '${key}' exists.`);
    }
  } catch (error) {
    console.error(error);
  }
}

async function removeSyncStorageObject(key) {
  try {
    const items = await new Promise((resolve, reject) => {
      chrome.storage.sync.get(key, function (items) {
        resolve(items);
      });
    });

    if (items.hasOwnProperty(key)) {
      await new Promise((resolve, reject) => {
        chrome.storage.sync.remove(key, function () {
          resolve();
        });
      });
      console.log(`Sync storage object with key '${key}' has been removed.`);
    } else {
      console.log(`No sync storage object with key '${key}' exists.`);
    }
  } catch (error) {
    console.error(error);
  }
}

async function resetSyncedSettings(){
  // Set default settings
  await chrome.storage.sync.set({"user_settings": {
    "discussionMessageDateFilter": {
        "operator": "",
        "datepicker": ""
      },
    "discussionMessageSenderFilter": {
        "input": "",
        "select": ""
      },
    "projectLabelsFilter": [],
    "autoRefreshOptions": {
        "input": "5",
        "select": "minutes"
      },
    "settingsToggles": {
        "filter": false,
        "show-open-tasks": true,
        "show-completed-tasks": true,
        "show-overdue-tasks": true,
        "show-badge-count": true,
        "debug": false,
        "auto-refresh": false
      }
    }
  });
}

async function configureAutoRefreshAlarm(period, type, enabled) {
  let alarmName = `auto-refresh-alarm`;
  let alarmInfo;
  if (type === 'minutes') {
    alarmInfo = {
      periodInMinutes: parseInt(period)
    };
  } else if (type === 'hours') {
    alarmInfo = {
      periodInMinutes: parseInt(period) * 60
    };
  }

  await chrome.alarms.clear('auto-refresh-alarm');
  if (enabled) {
    await chrome.alarms.create(alarmName, alarmInfo);
  }
} 