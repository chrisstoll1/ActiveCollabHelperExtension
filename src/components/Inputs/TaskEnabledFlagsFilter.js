import { Row, Col, Form } from 'react-bootstrap';
import Badge from '../Badge/Badge';
import '../../assets/css/components/Inputs/TaskEnabledFlagsFilter.css'
import { useContext, useEffect, useState } from 'react';
import { SettingsTogglesContext, SetSettingsTogglesContext } from '../../context/SettingsContext';

function TaskEnabledFlagsFilter() {
    const settingsToggles = useContext(SettingsTogglesContext);
    const setSettingsToggles = useContext(SetSettingsTogglesContext);
    const [hideCompletedTasks, setHideCompletedTasks] = useState(false);
    const [hideOpenTasks, setHideOpenTasks] = useState(false);
    const [hideOverdueTasks, setHideOverdueTasks] = useState(false);

    const handleCheckboxChange = (event) => {
        let newSettingsToggles = {...settingsToggles};
        newSettingsToggles[event.target.id] = event.target.checked;

        setSettingsToggles(newSettingsToggles);
    };

    useEffect(() => {
        const loadCheckboxValues = async () => {
            const keys = ['show-completed-tasks', 'show-open-tasks', 'show-overdue-tasks'];
            keys.forEach(key => {
                if (settingsToggles[key] !== undefined){
                    setHideCompletedTasks(settingsToggles['show-completed-tasks'] || false);
                    setHideOpenTasks(settingsToggles['show-open-tasks'] || false);
                    setHideOverdueTasks(settingsToggles['show-overdue-tasks'] || false);
                }
            });
        };
        loadCheckboxValues();
    }, [settingsToggles]);

    return (
        <Row className='task-label-filter-row-wrapper'>
            <Col md={4}>
                <div className="d-flex align-items-center" style={{ height: '100%' }}>
                    <h6 className="task-settings-title">Tasks</h6>
                </div>
            </Col>
            <Col md={8}>
                <div className='d-flex align-items-center' style={{ height: '100%', paddingLeft: '3px' }}>
                    <Form>
                        <div key={`inline-checkbox`}>
                            <Form.Check checked={hideCompletedTasks} inline type="checkbox" id='show-completed-tasks' onChange={handleCheckboxChange} />
                            <Form.Check.Label htmlFor='show-completed-tasks' className='mr-3 task-enabled-flags-filter-label'>
                                <div className="task-enabled-flags-filter-badge-wrapper">
                                    <Badge
                                        color="secondary"
                                        text="Completed"
                                        icon="assignment_turned_in"
                                    />
                                </div>
                            </Form.Check.Label>
                            <Form.Check checked={hideOpenTasks} inline type="checkbox" id='show-open-tasks' onChange={handleCheckboxChange} />
                            <Form.Check.Label htmlFor='show-open-tasks' className='mr-3 task-enabled-flags-filter-label'>
                                <div className="task-enabled-flags-filter-badge-wrapper">
                                    <Badge
                                        color="success"
                                        text="Open"
                                        icon="play_for_work"
                                    />
                                </div>
                            </Form.Check.Label>
                            <Form.Check checked={hideOverdueTasks} inline type="checkbox" id='show-overdue-tasks' onChange={handleCheckboxChange} />
                            <Form.Check.Label htmlFor='show-overdue-tasks' className='mr-3 task-enabled-flags-filter-label'>
                                <div className="task-enabled-flags-filter-badge-wrapper">
                                    <Badge
                                        color="danger"
                                        text="Overdue"
                                        icon="notification_important"
                                    />
                                </div>
                            </Form.Check.Label>
                        </div>
                    </Form>
                </div>
            </Col>
        </Row>
    );
}

export default TaskEnabledFlagsFilter;
