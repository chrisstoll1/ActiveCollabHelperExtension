import React, { useState, useContext, useEffect, useRef } from 'react';
import { Accordion, Card, Row, Col, Form } from 'react-bootstrap';
import Checkbox from '../Inputs/Checkbox';
import '../../assets/css/components/Cards/SettingsFilterAccordion.css'
import { SettingsTogglesContext, AutoRefreshOptionsContext, SetAutoRefreshOptionsContext } from '../../context/SettingsContext';

const SettingsAutoRefreshAccordion = () => {
    const autoRefreshOptions = useContext(AutoRefreshOptionsContext);
    const setAutoRefreshOptions = useContext(SetAutoRefreshOptionsContext);
    const settingsToggles = useContext(SettingsTogglesContext);
    const [isOpen, setIsOpen] = useState(false);
    const inputRef = useRef(null);
    const selectRef = useRef(null);

    function handleChange({isOn}){
        isOn = isOn ?? isOpen;
        var inputVal = inputRef.current.value;
        var selectVal = selectRef.current.value;

        setAutoRefreshOptions({
            "input": inputVal,
            "select": selectVal
        });

        chrome.runtime.sendMessage({event: "auto_refresh_settings_updated", "autoRefreshOptions": {
            "input": inputVal,
            "select": selectVal,
            "isOn": isOn
        }});
    }

    useEffect(() => {
        if (Object.keys(autoRefreshOptions).length !== 0){
            inputRef.current.value = autoRefreshOptions.input;
            selectRef.current.value = autoRefreshOptions.select;
        }
    }, [autoRefreshOptions]);

    useEffect(() => {
        if (settingsToggles && settingsToggles['auto-refresh'] !== undefined){
            setIsOpen(settingsToggles['auto-refresh']);
        }
    }, [settingsToggles]);

    const handleToggle = (isChecked) => {
        setIsOpen(isChecked);
        handleChange({isOn: isChecked});
    };

    return (
        <Accordion activeKey={isOpen ? '0' : null}>
        <Card className='filters-card'>
            <Card.Header className="accordion-header">
            <div className="d-flex align-items-start justify-content-between pb-1">
                <h5 className="settings-title">Auto-Refresh</h5>
                <Checkbox id="auto-refresh" label="" onChangeCallback={handleToggle}/>
            </div>
            </Card.Header>
            <Accordion.Collapse eventKey="0">
            <Card.Body className="accordion-body">
                <hr className="mt-4" />
                <div className="row">
                <div className="col-12">
                    <Card>
                        <Card.Body>
                            <Row>
                                <Col md={4}>
                                <Form.Label className="form-control settings-label-text">Every</Form.Label>
                                </Col>
                                <Col md={4}>
                                <Form.Control
                                    type="number"
                                    ref={inputRef}
                                    onChange={handleChange}
                                    className="settings-input"
                                    placeholder="5"
                                />
                                </Col>
                                <Col md={4}>
                                <Form.Control
                                    as="select"
                                    ref={selectRef}
                                    onChange={handleChange}
                                    className="settings-input"
                                >
                                    <option value=""></option>
                                    <option value="minutes">Minutes</option>
                                    <option value="hours">Hours</option>
                                </Form.Control>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </div>
                </div>
            </Card.Body>
            </Accordion.Collapse>
        </Card>
        </Accordion>
    );
};

export default SettingsAutoRefreshAccordion;
