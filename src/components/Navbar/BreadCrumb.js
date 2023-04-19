import { useLocation, useNavigate } from "react-router-dom";

function BreadCrumb(){
    const location = useLocation();
    const navigate = useNavigate();
    const breadcrumbMap = {
        "/": ["Overview"],
        "/settings": ["Overview", "Settings"],
        "/login": ["Overview", "Login"],
        "/project": ["Overview", "Project"],
        "/project/settings": ["Overview", "Project", "Settings"],
        "/taskList": ["Overview", "Project", "TaskList"],
        "/taskList/settings": ["Overview", "Project", "TaskList", "Settings"]
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
        let page = pathMap[path];
        
        if (path === "Settings"){
            if (location.pathname === "/project/settings") {
                page = "/project/settings";
            }
            if (location.pathname === "/taskList/settings") {
                page = "/taskList/settings";
            }
        }

        navigate(page);
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