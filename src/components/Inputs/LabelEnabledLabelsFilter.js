import { Row, Col } from 'react-bootstrap';

import React, { useState } from 'react';
import Select from 'react-select';
import { components } from 'react-select';

const data = [
    {
      label: 'Project Lead 1',
      value: 'lead_1',
      type: 'lead',
      icon: 'person',
    },
    {
      label: 'Project Lead 2',
      value: 'lead_2',
      type: 'lead',
      icon: 'person',
    },
    {
      label: 'Category 1',
      value: 'cat_1',
      type: 'category',
      icon: 'label_important',
    },
    {
      label: 'Category 2',
      value: 'cat_2',
      type: 'category',
      icon: 'label_important',
    },
];

const customStyles = {
    control: (base, state) => ({
      ...base,
      color: '#ffffff',
      backgroundColor: 'rgba(0, 0, 0, 0.35)',
      borderRadius: '0.5rem',
      border: 'none',
      boxShadow: 'none',
      cursor: 'pointer',
      minHeight: '40px',
    }),
    option: (base, state) => ({
      ...base,
      fontSize: '1rem',
      fontWeight: 400,
      backgroundColor: state.isFocused ? '#6e42c194' : 'rgba(0, 0, 0, 0)',
      color: '#ffffff',
      cursor: 'pointer',
    }),
    placeholder: (base) => ({
      ...base,
      color: '#495057',
      fontSize: '1rem',
    }),
    dropdownIndicator: (base) => ({
      ...base,
      display: 'none',
    }),
    indicatorSeparator: (base) => ({
        ...base,
        display: 'none',
    }),
    menu: (base) => ({
      ...base,
      backgroundColor: 'rgba(0, 0, 0, 0.35)',
      backdropFilter: 'blur(5px)',
    }),
    multiValue: (base, { data }) => {
        let backgroundColor;
        switch (data.type) {
          case 'lead':
            backgroundColor = '#8b51f5';
            break;
          case 'category':
            backgroundColor = '#343a40';
            break;
          default:
            backgroundColor = base.backgroundColor;
        }
        return {
          ...base,
          backgroundColor,
          margin: '0.25rem',
        };
    },
};
  
const customTheme = (theme) => ({
    ...theme,
    colors: {
      ...theme.colors,
      primary25: 'rgba(0, 0, 0, 0.1)',
      primary: 'rgba(0, 0, 0, 0.35)',
      neutral0: 'rgba(0, 0, 0, 0.35)',
      neutral80: '#ffffff',
    },
});

const CustomOption = (props) => {
    const { data, innerProps, innerRef } = props;
    return (
      <components.Option {...props}>
        <div style={{ height: '20px' }} className='d-flex align-items-center'>
          <i className="material-icons label-filter-custom-option-badge-icon">{data.icon}</i>&nbsp;
          <span className='label-filter-custom-option-badge-text'>
            {data.label}
          </span>
        </div>
      </components.Option>
    );
};

const CustomMultiValue = (props) => {
    const { data, children, removeProps } = props;
    return (
      <components.MultiValue {...props}>
        <div style={{ height: '20px' }} className='d-flex align-items-center'>
          <i className="material-icons label-filter-custom-option-badge-icon">{data.icon}</i>&nbsp;
          <span className='label-filter-custom-option-badge-text'>
            {children}
          </span>
        </div>
      </components.MultiValue>
    );
};  

const TypeAheadSelect = () => {
    const [selectedOptions, setSelectedOptions] = useState([]);

    const handleChange = (options) => {
        setSelectedOptions(options);
        console.log(selectedOptions);
    };

    return (
        <Select
            isMulti
            value={selectedOptions}
            options={data}
            onChange={handleChange}
            placeholder="Start Typing..."
            className="type-ahead-select"
            styles={customStyles}
            theme={customTheme}
            components={{ Option: CustomOption, MultiValue: CustomMultiValue }}
        />
    );
};

function LabelEnabledLabelsFilter(){
    return (
        <Row>
            <Col md={4}>
                <div className="d-flex align-items-center" style={{ height: '100%' }}>
                    <h6 className="task-settings-title">Labels</h6>
                </div>
            </Col>
            <Col md={8}>
                <TypeAheadSelect />
            </Col>
        </Row>
    );
}

export default LabelEnabledLabelsFilter;

