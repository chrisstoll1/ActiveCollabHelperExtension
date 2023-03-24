/* global chrome */
import { useEffect, useRef, useContext } from "react";
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
        <div className="card">
            <div className="card-body">
                <div className="row">
                    <div className="col-4">
                        <label className="form-control settings-label-text">Last Message Sender</label>
                    </div>
                    <div className="col-4">
                        <select ref={selectRef} onChange={handleChange} className="form-control settings-input">
                            <option selected value=""></option>
                            <option value="doesNotContain">Does Not Contain</option>
                            <option value="contains">Contains</option>
                        </select>
                    </div>
                    <div className="col-4">
                        <input ref={inputRef} onChange={handleChange} type="text" className="form-control settings-input" placeholder="@gmail.com"/>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DiscussionMessageSenderFilter;