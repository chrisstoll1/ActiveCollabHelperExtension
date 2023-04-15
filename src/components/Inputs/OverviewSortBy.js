/* global chrome */
import { useContext, useCallback } from 'react';
import '../../assets/css/components/Inputs/OverviewSortBy.css';
import Dropdown from 'react-bootstrap/Dropdown'
import { SortDirection, SetSortDirection, SortOption, SetSortOption } from '../../context/OverviewContext'

function OverviewSortBy() {
    const sortDirection = useContext(SortDirection);
    const setSortDirection = useContext(SetSortDirection);
    const sortOption = useContext(SortOption);
    const setSortOption = useContext(SetSortOption);
    let sortCache = {
        "Direction": sortDirection,
        "Option": sortOption
    };

    const arrowIconClass = () => {
        if (sortDirection === "ASC"){
            return "material-icons sortby-icon-arrow-asc";
        }else{
            return "material-icons sortby-icon-arrow-desc";
        }
    }

    function handleArrowClick(){
        let direction;
        if (sortDirection === "ASC"){
            setSortDirection("DESC");
            direction = "DESC";
        }else{
            setSortDirection("ASC");
            direction = "ASC";
        }
        sortCache.Direction = direction;
        chrome.storage.local.set({"SortCache": JSON.stringify(sortCache)});
    }

    const handleSortOptionClick = useCallback((sortbyOption) => {
        setSortOption(sortbyOption);
        setSortDirection("ASC");
        sortCache.Option = sortbyOption;
        chrome.storage.local.set({"SortCache": JSON.stringify(sortCache)});
    }, []);

    return (
        <span className='sortby-wrapper'>
            <Dropdown onSelect={handleSortOptionClick} drop="down-centered">
                <Dropdown.Toggle as="span" id="sortby-dropdown" className="sort-container">
                    <i className="material-icons sortby-icon">sort</i>
                    <span className="sortby-text">
                    Sort By <span className="sortby-text-item">{sortOption}</span>
                    </span>
                </Dropdown.Toggle>

                <Dropdown.Menu className="sortby-options">
                    <Dropdown.Item className="sortby-option" eventKey="Default">Default</Dropdown.Item>
                    <Dropdown.Item className="sortby-option" eventKey="Name">Name</Dropdown.Item>
                    <Dropdown.Item className="sortby-option" eventKey="Active Date">Active Date</Dropdown.Item>
                    <Dropdown.Item className="sortby-option" eventKey="Discussion Count">Discussion Count</Dropdown.Item>
                    <Dropdown.Item className="sortby-option" eventKey="Task Count">Task Count</Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>

            {(sortOption !== "Default") ? <i className={arrowIconClass()} onClick={handleArrowClick}>south</i> : null}
            
        </span>
    );
}

export default OverviewSortBy;