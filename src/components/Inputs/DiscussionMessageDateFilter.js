/* global chrome */
import { useEffect, useRef, useContext, useState } from 'react';
import { Card, Row, Col, Form } from 'react-bootstrap';
import { DiscussionMessageDateFilterContext, SetDiscussionMessageDateFilterContext } from '../../context/SettingsContext'
import DatePicker from './DatePicker';

function DiscussionMessageDateFilter() {
    const discussionMessageDateFilter = useContext(DiscussionMessageDateFilterContext);
    const setDiscussionMessageDateFilter = useContext(SetDiscussionMessageDateFilterContext);
    const operatorSelectRef = useRef(null);
    const datepickerRef = useRef(null);
    const [datepickerStyle, setDatepickerStyle] = useState({display: "none"});

    function handleChange(){
        var operatorVal = operatorSelectRef.current.value;
        var datepickerVal = datepickerRef.current.value;

        setDiscussionMessageDateFilter({
            "operator": operatorVal,
            "datepicker": datepickerVal
        });

        handleTypeChange();
    }

    function handleTypeChange(){
        var typeVal = operatorSelectRef.current.value;
        
        if (typeVal === "custom"){
            setDatepickerStyle({display: "block"});
        }else{
            setDatepickerStyle({display: "none"});
        }
    }

    useEffect(() => {
        if (Object.keys(discussionMessageDateFilter).length !== 0){
            operatorSelectRef.current.value = discussionMessageDateFilter.operator;
            datepickerRef.current.value = discussionMessageDateFilter.datepicker;
        }

        handleTypeChange();
    }, [discussionMessageDateFilter]);

    return (
        <Card>
        <Card.Body>
          <Row>
            <Col md={4}>
              <Form.Label className="form-control settings-label-text">Last Message Date</Form.Label>
            </Col>
            <Col md={4}>
              <Form.Control
                as="select"
                ref={operatorSelectRef}
                onChange={handleChange}
                className="settings-input"
              >
                <option value=""></option>
                <option value="today">Today</option>
                <option value="last7">Last 7 Days</option>
                <option value="last30">Last 30 Days</option>
                <option value="last90">Last 90 Days</option>
                <option value="custom">Custom Range</option>
              </Form.Control>
            </Col>
            <Col md={4}>
              <div style={datepickerStyle}>
                <DatePicker ref={datepickerRef} handleChange={handleChange} />
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    );
}

export default DiscussionMessageDateFilter;