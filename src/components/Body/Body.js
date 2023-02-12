/*global chrome*/
import { useState, useContext } from 'react';
import Overview from '../Overview/Overview';
import Settings from '../Settings/Settings';
import Project from '../Project/Project';
import Login from '../Login/Login';
import TaskList from '../TaskList/TaskList';
import { ExtState } from '../../ExtStateContext';

function Body() {
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

export default Body;