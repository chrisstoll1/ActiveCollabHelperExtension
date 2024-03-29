import { useEffect, useState, useContext } from 'react';
import { SettingsTogglesContext, SetSettingsTogglesContext } from '../../context/SettingsContext';

function Checkbox(props) {
    const settingsToggles = useContext(SettingsTogglesContext);
    const setSettingsToggles = useContext(SetSettingsTogglesContext);

    const [checked, setChecked] = useState(false);

    const handleChange = () => {
        setChecked(!checked);

        let newSettingsToggles = {...settingsToggles};
        newSettingsToggles[props.id] = !checked;

        setSettingsToggles(newSettingsToggles);

        // Call the optional callback function if provided
        if (props.onChangeCallback) {
            props.onChangeCallback(!checked);
        }
    };

    useEffect(() => {
        if (Object.keys(settingsToggles).length !== 0){
            if (settingsToggles[props.id] !== undefined){
                setChecked(settingsToggles[props.id]);
            }
        }
    }, [settingsToggles, props.id]);

    return (
        <div className="custom-control custom-checkbox custom-checkbox-switch">
            <input 
                type="checkbox" 
                className="custom-control-input" 
                id={props.id} 
                checked={checked}
                onChange={handleChange}
            />
            <label className="custom-control-label settings-input" htmlFor={props.id}>{props.label}</label>
        </div>
    );
}

export default Checkbox;