import React, { useState, useContext, useEffect } from 'react';
import { Accordion, Card } from 'react-bootstrap';
import Checkbox from '../Inputs/Checkbox';
import DiscussionMessageSenderFilter from '../Inputs/DiscussionMessageSenderFilter';
import DiscussionMessageDateFilter from '../Inputs/DiscussionMessageDateFilter';
import '../../assets/css/components/Cards/SettingsFilterAccordion.css'
import TaskEnabledFlagsFilter from '../Inputs/TaskEnabledFlagsFilter';
import LabelEnabledLabelsFilter from '../Inputs/LabelEnabledLabelsFilter';
import { SettingsTogglesContext } from '../../context/SettingsContext';

const SettingsFilterAccordion = () => {
    const settingsToggles = useContext(SettingsTogglesContext);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        if (settingsToggles && settingsToggles['filter'] !== undefined){
            setIsOpen(settingsToggles['filter']);
        }
    }, [settingsToggles]);

    const handleToggle = (isChecked) => {
        setIsOpen(isChecked);
    };

    return (
        <Accordion activeKey={isOpen ? '0' : null}>
        <Card className='filters-card'>
            <Card.Header className="accordion-header">
            <div className="d-flex align-items-start justify-content-between pb-1">
                <h5 className="settings-title">Filter</h5>
                <Checkbox id="filter" label="" onChangeCallback={handleToggle}/>
            </div>
            </Card.Header>
            <Accordion.Collapse eventKey="0">
            <Card.Body className="accordion-body">
                <hr className="mt-4" />
                <div className="row">
                <div className="col-12">
                    <Card>
                        <Card.Header className="accordion-header">
                            <h6 className="settings-title">Discussions</h6>
                        </Card.Header>
                        <Card.Body className="accordion-body">
                            <div className="row">
                                <div className="col-12">
                                    <DiscussionMessageSenderFilter />
                                    <DiscussionMessageDateFilter />
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                
                    {/* Tasks */}
                    <Card className='task-label-filter-card'>
                        <Card.Body>
                            <TaskEnabledFlagsFilter />
                        </Card.Body>
                    </Card>

                    {/* Labels */}
                    <Card>
                        <Card.Body>
                            <LabelEnabledLabelsFilter />
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

export default SettingsFilterAccordion;
