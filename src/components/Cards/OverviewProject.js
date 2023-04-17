/* global chrome */
import { useNavigate } from 'react-router-dom';
import { formatUnixTimestamp } from '../../utils/formatUnixTimestamp'
import '../../assets/css/components/Cards/OverviewProject.css'
import OverviewTaskBadge from '../Badge/OverviewTaskBadge';
import OverviewDiscussionBadge from '../Badge/OverviewDiscussionBadge';

function OverviewProject(props) {
    const navigate = useNavigate();

    function handleClick() {
        console.log(props.project);
        chrome.storage.local.set({"WorkingProject": JSON.stringify(props.project)});
        navigate('/project');
    }

    return (
        <div className="card card-task card-project" onClick={handleClick}>
            <div className="card-body">
                <div className="card-title overview-project-card-title">
                    <h6 data-filter-by="text" className="H6-filter-by-text overview-project-label">{props.project.name}</h6>
                    <span className="text-small">
                        <i className='last-active-icon material-icons'>schedule</i>
                        {formatUnixTimestamp(props.project.last_active)}
                        {(props.project.label) ?  
                            <span>
                                <span className='inline-bullet'>&#8226;</span>
                                <span className="project-status-label-text">
                                    {props.project.label}
                                </span>
                            </span>
                        : 
                            null
                        }
                    </span>
                </div>
                <div className="card-meta">
                    <div className="card-options">
                        <div className="stacked-badges">
                            <div className="stacked-badge-item">
                                <OverviewDiscussionBadge project={props.project} />
                            </div>
                            <div className="stacked-badge-item">
                                <OverviewTaskBadge project={props.project} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default OverviewProject;

