/*global chrome*/
import { Routes, Route, useNavigate, useLocation  } from 'react-router-dom';
import Overview from '../views/Overview';
import Settings from '../views/Settings';
import Project from '../views/Project';
import Login from '../views/Login';
import TaskList from '../views/TaskList';
import { useEffect } from 'react';

function AppRoutes() {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        chrome.storage.local.set({LastVisitedPage: location.pathname});
        console.log(location.pathname);
    }, [location]);

    useEffect(() => {
        // TODO: Get this working
        chrome.storage.local.get(['LastVisitedPage'], function(result) {
            console.log(result)
            if (result.LastVisitedPage) {
                navigate(result.LastVisitedPage);
            }
        });

        const handleMouse = (ev) => {
            if (ev.buttons & 8) {
                // Mouse 4 (Back)
                navigate(-1);
            } else if (ev.buttons & 16) {
                // Mouse 5 (Forward)
                navigate(1);
            }
        };
    
        window.addEventListener("mousedown", handleMouse);

        return () => {
            window.removeEventListener("mousedown", handleMouse);
        }
    }, []);

    return (
        <Routes>
            <Route exact path="/" element={<Overview />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/project/settings" element={<Settings />} />
            <Route path="/taskList/settings" element={<Settings />} />
            <Route path="/project" element={<Project />} />
            <Route path="/taskList" element={<TaskList />} />
            <Route path="/login" element={<Login />} />
        </Routes>
    );
}

export default AppRoutes;