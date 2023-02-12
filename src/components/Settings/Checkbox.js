/*global chrome*/
import { useEffect, useState } from 'react';

function Checkbox(props) {
    const [checked, setChecked] = useState(false);

    const handleChange = () => {
        setChecked(!checked);
        chrome.storage.sync.set({[props.id]: !checked});
    };

    useEffect(() => {
        chrome.storage.sync.get([props.id]).then((result) => {
            if (Object.keys(result).length === 0){
                chrome.storage.sync.set({[props.id]: false});
                setChecked(false);
            }else{
                setChecked(result[props.id]);
            }
        });
    }, []);

    return (
        <div class="form-group">
            <div class="custom-control custom-checkbox custom-checkbox-switch">
                <input 
                    type="checkbox" 
                    class="custom-control-input" 
                    id={props.id} 
                    checked={checked}
                    onChange={handleChange}
                />
                <label class="custom-control-label" for={props.id}>{props.label}</label>
            </div>
        </div>
    );
}

export default Checkbox;