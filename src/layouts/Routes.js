/*global chrome*/
import { useContext } from 'react';
import Overview from '../views/Overview';
import Settings from '../views/Settings';
import Project from '../views/Project';
import Login from '../views/Login';
import TaskList from '../views/TaskList';
import { ExtState } from '../context/ExtStateContext'

function Routes() {
    const extState = useContext(ExtState);

    if (extState === "Overview"){
        return (<Overview/>);
    }
    if (extState === "Settings"){
        return (<Settings/>);
    }
    if (extState === "Login"){
        return (<Login/>);
    }
    if (extState === "Project"){
        return (<Project/>);
    }
    if (extState === "TaskList"){
        return (<TaskList/>);
    }
}

export default Routes;