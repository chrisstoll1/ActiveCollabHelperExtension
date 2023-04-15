import { Row, Col, Form } from 'react-bootstrap';
import Badge from '../Badge/Badge';
import '../../assets/css/components/Inputs/TaskEnabledFlagsFilter.css'

function TaskEnabledFlagsFilter() {
    return (
        <Row>
            <Col md={4}>
                <div className="d-flex align-items-center" style={{ height: '100%' }}>
                    <h6 className="task-settings-title">Tasks</h6>
                </div>
            </Col>
            <Col md={8}>
                <Form>
                    <div key={`inline-checkbox`}>
                        <Form.Check inline type="checkbox" id='hide-completed-tasks' />
                        <Form.Check.Label htmlFor='hide-completed-tasks' className='mr-3 task-enabled-flags-filter-label'>
                            <div className="task-enabled-flags-filter-badge-wrapper">
                                <Badge
                                    color="secondary"
                                    text="Completed"
                                    icon="assignment_turned_in"
                                />
                            </div>
                        </Form.Check.Label>
                        <Form.Check inline type="checkbox" id='hide-open-tasks' />
                        <Form.Check.Label htmlFor='hide-open-tasks' className='mr-3 task-enabled-flags-filter-label'>
                            <div className="task-enabled-flags-filter-badge-wrapper">
                                <Badge
                                    color="success"
                                    text="Open"
                                    icon="play_for_work"
                                />
                            </div>
                        </Form.Check.Label>
                        <Form.Check inline type="checkbox" id='hide-overdue-tasks' />
                        <Form.Check.Label htmlFor='hide-overdue-tasks' className='mr-3 task-enabled-flags-filter-label'>
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
            </Col>
        </Row>
    );
}

export default TaskEnabledFlagsFilter;