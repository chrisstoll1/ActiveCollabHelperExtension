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