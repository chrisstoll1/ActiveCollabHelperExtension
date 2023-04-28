/*global chrome*/
import { useNavigate, useLocation } from 'react-router-dom';
import '../../assets/css/components/Navbar/SettingsButton.css';

function SettingsButton() {
    const navigate = useNavigate();
    const location = useLocation();
    const isSettingsPage = location.pathname === "/settings" || location.pathname === "/project/settings" || location.pathname === "/taskList/settings";

    function settingsClicked() {
        if (!isSettingsPage) {
            if (location.pathname === "/project") {
                navigate('/project/settings');
            }
            else if (location.pathname === "/taskList") {
                navigate('/taskList/settings');
            }else{
                navigate('/settings');
            }
        }
    }

    return (
        <i
            className={
                isSettingsPage
                    ? 'material-icons extension-control-icons settings-disabled'
                    : 'material-icons extension-control-icons'
            }
            onClick={settingsClicked}
        >
            settings
        </i>
    );
}

export default SettingsButton