import { forwardRef, useEffect } from 'react';
import flatpickr from 'flatpickr';

const DatePicker = forwardRef((props, ref) => {
  const { handleChange } = props;

  useEffect(() => {
    flatpickr(ref.current, {
      dateFormat: 'm/d/Y',
      mode: 'range',
      onChange: handleChange,
    });
  }, []);

  return (
    <input
      className="form-control settings-input"
      ref={ref}
      type="text"
      placeholder="Select a Date Range"
    />
  );
});

export default DatePicker;