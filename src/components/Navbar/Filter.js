import { useContext } from "react";
import { BodyFilter, SetBodyFilter } from '../../store/ExtStateContext';
import './Filter.css';

function Filter() {
    const setBodyFilter = useContext(SetBodyFilter);
    const bodyFilter = useContext(BodyFilter);

    return (
        <filter>
            <div class="input-group input-group-round">
            <div class="input-group-prepend filter-input">
                <span class="input-group-text">
                <i class="material-icons">filter_list</i>-
                </span>
            </div>
            <input value={bodyFilter} onChange={event => setBodyFilter(event.target.value)} type="search" class="form-control filter-list-input filter-input" placeholder="Filter" aria-label="Filter"/>
            </div>
        </filter>
    );
}

export default Filter;

