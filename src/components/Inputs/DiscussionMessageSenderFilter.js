/* global chrome */
import { useEffect, useRef, useContext } from "react";
import { Card, Row, Col, Form } from 'react-bootstrap';
import { DiscussionMessageSenderFilterContext, SetDiscussionMessageSenderFilterContext } from "../../context/SettingsContext";

function DiscussionMessageSenderFilter(){
    const discussionMessageSenderFilter = useContext(DiscussionMessageSenderFilterContext);
    const setDiscussionMessageSenderFilter = useContext(SetDiscussionMessageSenderFilterContext);
    const inputRef = useRef(null);
    const selectRef = useRef(null);

    function handleChange(){
        var inputVal = inputRef.current.value;
        var selectVal = selectRef.current.value;

        setDiscussionMessageSenderFilter({
            "input": inputVal,
            "select": selectVal
        });
    }

    useEffect(() => {
        if (Object.keys(discussionMessageSenderFilter).length !== 0){
            inputRef.current.value = discussionMessageSenderFilter.input;
            selectRef.current.value = discussionMessageSenderFilter.select;
        }
    }, [discussionMessageSenderFilter]);


    return (
        <Card>
        <Card.Body>
          <Row>
            <Col md={4}>
              <Form.Label className="form-control settings-label-text">Last Message Sender</Form.Label>
            </Col>
            <Col md={4}>
              <Form.Control
                as="select"
                ref={selectRef}
                onChange={handleChange}
                className="settings-input"
              >
                <option value=""></option>
                <option value="doesNotContain">Does Not Contain</option>
                <option value="contains">Contains</option>
              </Form.Control>
            </Col>
            <Col md={4}>
              <Form.Control
                type="text"
                ref={inputRef}
                onChange={handleChange}
                className="settings-input"
                placeholder="@gmail.com"
              />
            </Col>
          </Row>
        </Card.Body>
      </Card>
    );
}

export default DiscussionMessageSenderFilter;