/*global chrome*/
import { Row, Col } from 'react-bootstrap';

import React, { useEffect, useState, useContext } from 'react';
import Select from 'react-select';
import { ProjectLabelsFilterContext, SetProjectLabelsFilterContext } from '../../context/SettingsContext';
import { components } from 'react-select';

const data = async () => {
    let values = [];
    const storedProjects = await chrome.storage.local.get(["ACProjects"]);
    const projects = JSON.parse(storedProjects.ACProjects);
    if (Object.keys(projects).length !== 0){
        //Get unique leader and category values
        const leaders = [...new Set(projects.map(item => item.leader))].filter(Boolean);
        const categories = [...new Set(projects.map(item => item.category))].filter(Boolean);

        //Create array of objects for each leader and category
        leaders.forEach(leader => {
            values.push({
                label: leader,
                value: leader,
                type: 'lead',
                icon: 'person',
            });
        });
        categories.forEach(category => {
            values.push({
                label: category,
                value: category,
                type: 'category',
                icon: 'label_important',
            });
        });
    }
    return values;
};

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
    const [options, setOptions] = useState([]);
    const setProjectLabelsFilter = useContext(SetProjectLabelsFilterContext);
    const projectLabelsFilter = useContext(ProjectLabelsFilterContext);

    const handleChange = (options) => {
        setProjectLabelsFilter(options);
        console.log(options);
    };

    //Grab options from chrome storage
    useEffect(() => {
        const fetchData = async () => {
            const result = await data();
            setOptions(result);
        };
        fetchData();
    }, []);

    return (
        <Select
            isMulti
            value={projectLabelsFilter}
            options={options}
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

