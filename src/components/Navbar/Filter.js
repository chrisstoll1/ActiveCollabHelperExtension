import { useContext } from "react";
import { ExtState, OverviewFilter, SetOverviewFilter, ProjectFilter, SetProjectFilter, TaskListFilter, SetTaskListFilter } from '../../context/ExtStateContext';
import '../../assets/css/components/Navbar/Filter.css';

function Filter() {
    const extState = useContext(ExtState);
    const overviewFilter = useContext(OverviewFilter);
    const setOverviewFilter = useContext(SetOverviewFilter);
    const projectFilter = useContext(ProjectFilter);
    const setProjectFilter = useContext(SetProjectFilter);
    const taskListFilter = useContext(TaskListFilter);
    const setTaskListFilter = useContext(SetTaskListFilter);

    const filterValue = extState === "Overview" ? overviewFilter : extState === "Project" ? projectFilter : taskListFilter;

    function handleFilterChange(value) {
        if (extState === "Overview"){
            setOverviewFilter(value);
        }
        if (extState === "Project"){
            setProjectFilter(value);
        }
        if (extState === "TaskList"){
            setTaskListFilter(value);
        }
    }

    return (
        <filter>
            <div class="input-group input-group-round">
            <div class="input-group-prepend filter-input">
                <span class="input-group-text">
                <i class="material-icons">filter_list</i>-
                </span>
            </div>
            <input value={filterValue} onChange={event => handleFilterChange(event.target.value)} type="search" class="form-control filter-list-input filter-input" placeholder="Filter" aria-label="Filter"/>
            </div>
        </filter>
    );
}

export default Filter;

