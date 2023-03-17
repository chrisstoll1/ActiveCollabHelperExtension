export const sortProjects = (projects, sortOption, sortDirection) => {
    if (sortOption === "Name"){
        if (sortDirection === "ASC"){
            return projects.sort((a,b) => (a.name > b.name) ? 1 : -1);
        }else{
            return projects.sort((a,b) => (a.name < b.name) ? 1 : -1);
        }
    }else if (sortOption === "Active Date"){
        if (sortDirection === "ASC"){
            return projects.sort((a,b) => (a.last_active < b.last_active) ? 1 : -1);
        }else{
            return projects.sort((a,b) => (a.last_active > b.last_active) ? 1 : -1);
        }
    }else if (sortOption === "Discussion Count"){
        if (sortDirection === "ASC"){
            return projects.sort((a,b) => (a.discussions.length < b.discussions.length) ? 1 : -1);
        }else{
            return projects.sort((a,b) => (a.discussions.length > b.discussions.length) ? 1 : -1);
        }
    }else if (sortOption === "Task Count"){
        if (sortDirection === "ASC"){
            return projects.sort((a,b) => (a.task_lists.length < b.task_lists.length) ? 1 : -1);
        }else{
            return projects.sort((a,b) => (a.task_lists.length > b.task_lists.length) ? 1 : -1);
        }
    }else{
        return projects;
    }
}