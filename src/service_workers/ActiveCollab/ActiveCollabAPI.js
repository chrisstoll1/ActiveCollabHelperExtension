export async function GetInitial(sessionCookie, accountNumber) {
    var headers = new Headers();
    headers.append("Cookie", sessionCookie);        
    var options = {
      method: 'GET',
      headers: headers,
      redirect: 'follow'
    };

    return await fetch(`https://app.activecollab.com/${accountNumber}/api/v1/initial`, options);
}

export async function GetProjectsDATA(sessionCookie, accountNumber) {
  var getProjectsRequestResponse = await GetProjects(sessionCookie, accountNumber);
  var projectsResponseText = await getProjectsRequestResponse.text();
  return JSON.parse(projectsResponseText);
}

export async function GetProjects(sessionCookie, accountNumber) {
    var headers = new Headers();
    headers.append("Cookie", sessionCookie);
    var options = {
      method: 'GET',
      headers: headers,
      redirect: 'follow'
    };

    return await fetch(`https://app.activecollab.com/${accountNumber}/api/v1/projects`, options);
}

export async function GetProjectTasksDATA(sessionCookie, accountNumber, projectId) {
  var getProjectTasksRequestResponse = await GetProjectTasks(sessionCookie, accountNumber, projectId);
  var projectTasksResponseText = await getProjectTasksRequestResponse.text();
  return JSON.parse(projectTasksResponseText);
}

export async function GetProjectTasks(sessionCookie, accountNumber, projectId) {
    var headers = new Headers();
    headers.append("Cookie", sessionCookie);
    var options = {
      method: 'GET',
      headers: headers,
      redirect: 'follow'
    };

    return await fetch(`https://app.activecollab.com/${accountNumber}/api/v1/projects/${projectId}/tasks`, options);
}

export async function GetProjectTasksArchivedDATA(sessionCookie, accountNumber, projectId) {
  var getProjectTasksArchivedRequestResponse = await GetProjectTasksArchived(sessionCookie, accountNumber, projectId);
  var projectTasksArchivedResponseText = await getProjectTasksArchivedRequestResponse.text();
  return JSON.parse(projectTasksArchivedResponseText);
}

export async function GetProjectTasksArchived(sessionCookie, accountNumber, projectId) {
    var headers = new Headers();
    headers.append("Cookie", sessionCookie);
    var options = {
      method: 'GET',
      headers: headers,
      redirect: 'follow'
    };

    return await fetch(`https://app.activecollab.com/${accountNumber}/api/v1/projects/${projectId}/tasks/archive`, options);
}

export async function GetProjectDiscussionsDATA(sessionCookie, accountNumber, projectId) {
  var getProjectDiscussionsRequestResponse = await GetProjectDiscussions(sessionCookie, accountNumber, projectId);
  var projectDiscussionsResponseText = await getProjectDiscussionsRequestResponse.text();
  return JSON.parse(projectDiscussionsResponseText);
}

export async function GetProjectDiscussions(sessionCookie, accountNumber, projectId) {
    var headers = new Headers();
    headers.append("Cookie", sessionCookie);
    var options = {
      method: 'GET',
      headers: headers,
      redirect: 'follow'
    };

    return await fetch(`https://app.activecollab.com/${accountNumber}/api/v1/projects/${projectId}/discussions`, options);
}

export async function GetUserDATA(sessionCookie, accountNumber, userId) {
  var getUserRequestResponse = await GetUser(sessionCookie, accountNumber, userId);
  var userResponseText = await getUserRequestResponse.text();
  try {
    let parsedData = JSON.parse(userResponseText);
    return parsedData.single;
  } catch (error) {
    return null;
  }
}

export async function GetUser(sessionCookie, accountNumber, userId) {
    var headers = new Headers();
    headers.append("Cookie", sessionCookie);
    var options = {
      method: 'GET',
      headers: headers,
      redirect: 'follow'
    };

    return await fetch(`https://app.activecollab.com/${accountNumber}/api/v1/users/${userId}`, options);
}

export async function GetProjectLabelsDATA(sessionCookie, accountNumber) {
  var getProjectLabelsRequestResponse = await GetProjectLabels(sessionCookie, accountNumber);
  var projectLabelsResponseText = await getProjectLabelsRequestResponse.text();
  return JSON.parse(projectLabelsResponseText);
}

export async function GetProjectLabels(sessionCookie, accountNumber) {
  var headers = new Headers();
  headers.append("Cookie", sessionCookie);
  var options = {
    method: 'GET',
    headers: headers,
    redirect: 'follow'
  };

  return await fetch(`https://app.activecollab.com/${accountNumber}/api/v1/projects/labels`, options);
}

export async function GetProjectCategoriesDATA(sessionCookie, accountNumber) {
  var getProjectCategoriesRequestResponse = await GetProjectCategories(sessionCookie, accountNumber);
  var projectCategoriesResponseText = await getProjectCategoriesRequestResponse.text();
  return JSON.parse(projectCategoriesResponseText);
}

export async function GetProjectCategories(sessionCookie, accountNumber) {
  var headers = new Headers();
  headers.append("Cookie", sessionCookie);
  var options = {
    method: 'GET',
    headers: headers,
    redirect: 'follow'
  };

  return await fetch(`https://app.activecollab.com/${accountNumber}/api/v1/projects/categories`, options);
}

export async function GetProjectsChildDATA(sessionCookie, accountNumber, projectsRAW, oldActiveCollabData) {
  //Get List of Tasks and Discussions for each project
  const projectDataPromises = projectsRAW.map(async project => {
    // determine if project has been updated since we last grabbed it
    const oldProject = oldActiveCollabData.find(oldProject => oldProject.id === project.id);
    if (oldProject && oldProject.last_active === project.last_activity_on) {
      project.useOldData = true;
      return [[], [], []];
    }

    var projectTasks = GetProjectTasksDATA(sessionCookie, accountNumber, project.id);
    var projectTasksArchived = GetProjectTasksArchivedDATA(sessionCookie, accountNumber, project.id);
    var projectDiscussions = GetProjectDiscussionsDATA(sessionCookie, accountNumber, project.id);
    return Promise.all([projectTasks, projectTasksArchived, projectDiscussions]);
  });
  return await Promise.all(projectDataPromises);
}

export async function GetProjectsLeadersDATA(sessionCookie, accountNumber, projectsRAW, oldLeaderData) {
  //Get List of Leaders for all projects
  const projectLeaderIDs = projectsRAW.map(project => project.leader_id);
  const uniqueLeaderIDs = [...new Set(projectLeaderIDs)];
  const projectLeaderDataPromises = uniqueLeaderIDs.map(async leaderID => {
    const oldLeader = oldLeaderData.find(oldLeader => oldLeader.id === leaderID);
    if (oldLeader) { //TODO: There is a potential bug here where if the user changes their name it will not update
      return oldLeader;
    }

    // Assume that if the leaderID is 0, then there is no leader
    var projectLeaderData = (leaderID !== 0) ? GetUserDATA(sessionCookie, accountNumber, leaderID) : null;
    return Promise.all([projectLeaderData]);
  });
  const projectLeaderData = await Promise.all(projectLeaderDataPromises);
  return projectLeaderData.flat().filter(leader => leader !== null);
}