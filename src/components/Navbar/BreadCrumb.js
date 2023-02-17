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
            <ol class="breadcrumb">
                {breadcrumbMap[extState].map((state)=>{
                    return <li class="breadcrumb-item" onClick={() => BreadcrumbClick(state)}>{state}</li>
                })}
            </ol>
        </nav>
    );
}

export default BreadCrumb;