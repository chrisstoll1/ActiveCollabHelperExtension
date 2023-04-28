import { useContext } from "react";
import { OverviewFilter, SetOverviewFilter, ProjectFilter, SetProjectFilter, TaskListFilter, SetTaskListFilter } from '../../context/ExtStateContext';
import '../../assets/css/components/Navbar/Filter.css';
import { useLocation } from "react-router-dom";

function Filter() {
    const overviewFilter = useContext(OverviewFilter);
    const setOverviewFilter = useContext(SetOverviewFilter);
    const projectFilter = useContext(ProjectFilter);
    const setProjectFilter = useContext(SetProjectFilter);
    const taskListFilter = useContext(TaskListFilter);
    const setTaskListFilter = useContext(SetTaskListFilter);
    const location = useLocation();
    const isSettingsPage = location.pathname === "/settings" || location.pathname === "/project/settings" || location.pathname === "/taskList/settings";
    const filterValue = location.pathname === "/" ? overviewFilter : location.pathname === "/project" ? projectFilter : taskListFilter;

    function handleFilterChange(value) {
        if (location.pathname === "/"){
            setOverviewFilter(value);
        }
        if (location.pathname === "/project"){
            setProjectFilter(value);
        }
        if (location.pathname === "/taskList"){
            setTaskListFilter(value);
        }
    }

    return (
        <div className="navbar-filter">
            {isSettingsPage ? null :
                <div className="input-group input-group-round">
                <div className="input-group-prepend filter-input">
                    <span className="input-group-text">
                        <i className="material-icons filter-icon">search</i>
                    </span>
                </div>
                <input value={filterValue} onChange={event => handleFilterChange(event.target.value)} type="search" className="form-control filter-list-input filter-input" placeholder="Search" aria-label="Filter"/>
                </div>
            }
        </div>
    );
}

export default Filter;