import { GetInitial, GetProjectsDATA, GetProjectTasksDATA, GetProjectTasksArchivedDATA, GetProjectDiscussionsDATA } from './ActiveCollab/ActiveCollabAPI.js';
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
      await removeLocalStorageObject("ExtState");
      refreshActiveCollabData();
    }
    if (request.event === "reset_settings"){
      await resetSyncedSettings();
      chrome.runtime.sendMessage({event: "settings_reset"});
    }
});

async function refreshActiveCollabData() {
  await removeLocalStorageObject("ACProjects");

  if (await isTokenValid()) {
    var activeCollabData = await buildActiveCollabDataObject();

    //Refresh projects
    await chrome.storage.local.set({"ACProjects": JSON.stringify(activeCollabData)});

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

    await chrome.runtime.sendMessage({event: "updated"});
  }else{
    console.log("INVALID TOKEN");
    await chrome.runtime.sendMessage({event: "invalid_token"});
  }
}

async function buildActiveCollabDataObject() {
  var PHPSESSID = await chrome.storage.sync.get(["PHPSESSID"])
  var accountNumber = await chrome.storage.sync.get(["activecollab_user_instances"])
  PHPSESSID = PHPSESSID.PHPSESSID.toString();
  accountNumber = accountNumber.activecollab_user_instances.toString();
  var sessionCookie = `PHPSESSID=${PHPSESSID}`;

  //Get List of Projects
  var projectsRAW = await GetProjectsDATA(sessionCookie, accountNumber);

  //Get List of Tasks and Discussions for each project
  const projectDataPromises = projectsRAW.map(async project => {
    var projectTasks = GetProjectTasksDATA(sessionCookie, accountNumber, project.id);
    var projectTasksArchived = GetProjectTasksArchivedDATA(sessionCookie, accountNumber, project.id);
    var projectDiscussions = GetProjectDiscussionsDATA(sessionCookie, accountNumber, project.id);
    return Promise.all([projectTasks, projectTasksArchived, projectDiscussions]);
  });
  const projectData = await Promise.all(projectDataPromises);

  //Format the data into a single object
  const projectsWithData = projectsRAW.map((project, index) => {
    const [projectTasks, projectTasksArchived, projectDiscussions] = projectData[index];
    let projectTasksAll = projectTasks;
    projectTasksAll.tasks = projectTasks.tasks.concat(projectTasksArchived); //Combine active and archived tasks
    return formatProject(project, projectTasksAll, projectDiscussions);
  });

  return projectsWithData;
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
        "type": "",
        "input": "",
        "datepicker": ""
      },
    "discussionMessageSenderFilter": {
        "input": "",
        "select": ""
      },
    "settingsToggles": {
        "hide-unflagged-discussions": false,
        "hide-open-tasks": false,
        "hide-completed-tasks": false,
        "hide-overdue-tasks": false,
        "hide-empty-projects": false
      }
    }
  });
}