import { useLocation, useNavigate } from "react-router-dom";

function BreadCrumb(){
    const location = useLocation();
    const navigate = useNavigate();
    const breadcrumbMap = {
        "/": ["Overview"],
        "/settings": ["Overview", "Settings"],
        "/login": ["Overview", "Login"],
        "/project": ["Overview", "Project"],
        "/taskList": ["Overview", "Project", "TaskList"],
    };    
    const pathMap = {
        "Overview": "/",
        "Settings": "/settings",
        "Login": "/login",
        "Project": "/project",
        "TaskList": "/taskList",
    };

    function BreadcrumbClick(path) {
        console.log(path);
        console.log(pathMap[path]);
        navigate(pathMap[path]);
    }    

    return (
        <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
                {breadcrumbMap[location.pathname].map((state, index) => {
                    return (
                        <li
                            key={index}
                            className="breadcrumb-item"
                            onClick={() => BreadcrumbClick(state)}
                        >
                            {state}
                        </li>
                    );
                })}
            </ol>
        </nav>
    );    
}

export default BreadCrumb;