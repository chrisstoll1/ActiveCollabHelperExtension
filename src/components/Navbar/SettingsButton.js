/*global chrome*/
import { useNavigate, useLocation } from 'react-router-dom';
import '../../assets/css/components/Navbar/SettingsButton.css';

function SettingsButton() {
    const navigate = useNavigate();
    const location = useLocation();

    function settingsClicked() {
        navigate('/settings');
    }

    const isSettingsPage = location.pathname === "/settings";

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