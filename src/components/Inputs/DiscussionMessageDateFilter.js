/* global chrome */
import { useEffect, useRef, useContext, useState } from 'react';
import { DiscussionMessageDateFilterContext, SetDiscussionMessageDateFilterContext } from '../../context/SettingsContext'
import DatePicker from './DatePicker';

function DiscussionMessageDateFilter() {
    const discussionMessageDateFilter = useContext(DiscussionMessageDateFilterContext);
    const setDiscussionMessageDateFilter = useContext(SetDiscussionMessageDateFilterContext);
    const operatorSelectRef = useRef(null);
    const typeSelectRef = useRef(null);
    const inputRef = useRef(null);
    const datepickerRef = useRef(null);
    const [inputStyle, setInputStyle] = useState({display: "none"});
    const [datepickerStyle, setDatepickerStyle] = useState({display: "none"});

    function handleChange(){
        var operatorVal = operatorSelectRef.current.value;
        var typeVal = typeSelectRef.current.value;
        var inputVal = inputRef.current.value;
        var datepickerVal = datepickerRef.current.value;

        setDiscussionMessageDateFilter({
            "operator": operatorVal,
            "type": typeVal,
            "input": inputVal,
            "datepicker": datepickerVal
        });

        handleTypeChange();
    }

    function handleTypeChange(){
        var typeVal = typeSelectRef.current.value;
        
        if (typeVal === "static"){
            setInputStyle({display: "none"});
            setDatepickerStyle({display: "block"});
        }
        else if (typeVal === "today+" || typeVal === "today-"){
            setInputStyle({display: "block"});
            setDatepickerStyle({display: "none"});
        }
        else {
            setInputStyle({display: "none"});
            setDatepickerStyle({display: "none"});
        }
    }

    useEffect(() => {
        if (Object.keys(discussionMessageDateFilter).length !== 0){
            operatorSelectRef.current.value = discussionMessageDateFilter.operator;
            typeSelectRef.current.value = discussionMessageDateFilter.type;
            inputRef.current.value = discussionMessageDateFilter.input;
            datepickerRef.current.value = discussionMessageDateFilter.datepicker;
        }

        handleTypeChange();
    }, [discussionMessageDateFilter]);

    return (
        <div className="card">
            <div className="card-body">
                <div className="row">
                    <div className="col-4">
                        <label className="form-control settings-label-text">Last Message Date</label>
                    </div>
                    <div className="col-2">
                        <select ref={operatorSelectRef} onChange={handleChange} className="form-control settings-input">
                            <option selected value=""></option>
                            <option value="before">Before</option>
                            <option value="after">After</option>
                            <option value="on">On</option>
                        </select>
                    </div>
                    <div className="col-3">
                        <select ref={typeSelectRef} onChange={handleChange} className="form-control settings-input">
                            <option selected value=""></option>
                            <option value="static">Static</option>
                            <option value="today+">Today +</option>
                            <option value="today-">Today -</option>
                        </select>
                    </div>
                    <div className="col-3">
                        <div style={datepickerStyle}>
                            <DatePicker ref={datepickerRef} handleChange={handleChange}/>
                        </div>
                        <div style={inputStyle}>
                            <input ref={inputRef} onChange={handleChange} type="number" className="form-control settings-input" placeholder="1"/>
                        </div>
                    </div>
                </div>
            </div>  
        </div>
    );
}

export default DiscussionMessageDateFilter;