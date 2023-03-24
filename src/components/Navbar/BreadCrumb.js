import { useContext } from "react";
import { ExtState, SetExtState } from '../../context/ExtStateContext';

function BreadCrumb(){
    const setExtState = useContext(SetExtState);
    const extState = useContext(ExtState);
    const breadcrumbMap = {
        "Overview": ["Overview"],
        "Settings": ["Overview", "Settings"],
        "Login": ["Overview", "Login"],
        "Project": ["Overview", "Project"],
        "TaskList": ["Overview", "Project", "TaskList"]
    };

    function  BreadcrumbClick(state){
        setExtState(state);
    }

    return (
        <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
                {breadcrumbMap[extState].map((state, index)=>{
                    return <li key={index} className="breadcrumb-item" onClick={() => BreadcrumbClick(state)}>{state}</li>
                })}
            </ol>
        </nav>
    );
}

export default BreadCrumb;