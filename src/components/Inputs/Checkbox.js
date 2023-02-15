/*global chrome*/
import { useEffect, useState, useContext } from 'react';
import { SettingsTogglesContext, SetSettingsTogglesContext } from '../../store/SettingsContext';

function Checkbox(props) {
    const settingsToggles = useContext(SettingsTogglesContext);
    const setSettingsToggles = useContext(SetSettingsTogglesContext);

    const [checked, setChecked] = useState(false);

    const handleChange = () => {
        setChecked(!checked);

        let newSettingsToggles = {...settingsToggles};
        newSettingsToggles[props.id] = !checked;

        setSettingsToggles(newSettingsToggles);
    };

    useEffect(() => {
        if (Object.keys(settingsToggles).length !== 0){
            if (settingsToggles[props.id] !== undefined){
                setChecked(settingsToggles[props.id]);
            }
        }
    }, [settingsToggles]);

    return (
        <div class="custom-control custom-checkbox custom-checkbox-switch">
            <input 
                type="checkbox" 
                class="custom-control-input" 
                id={props.id} 
                checked={checked}
                onChange={handleChange}
            />
            <label class="custom-control-label settings-input" for={props.id}>{props.label}</label>
        </div>
    );
}

export default Checkbox;