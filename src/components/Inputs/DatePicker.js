import { useEffect, useRef } from 'react';
import flatpickr from 'flatpickr';

function DatePicker() {
    const datePicker = useRef(null);

    useEffect(() => {
        flatpickr(datePicker.current, {
            dateFormat: "m/d/Y"
        });
    }, []);

    return (
        <input class="form-control settings-input" ref={datePicker}  type="text" placeholder="Select a Date" />
    );
}

export default DatePicker;