/*global chrome*/
import { Routes, Route } from 'react-router-dom';
import Overview from '../views/Overview';
import Settings from '../views/Settings';
import Project from '../views/Project';
import Login from '../views/Login';
import TaskList from '../views/TaskList';

function AppRoutes() {
    return (
        <Routes>
            <Route exact path="/" element={<Overview />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/project" element={<Project />} />
            <Route path="/taskList" element={<TaskList />} />
            <Route path="/login" element={<Login />} />
        </Routes>
    );
}

export default AppRoutes;