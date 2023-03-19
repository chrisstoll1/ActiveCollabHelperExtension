import { formatUnixTimestamp } from '../../utils/formatUnixTimestamp';
import '../../assets/css/components/Text/ProjectHeader.css';

function ProjectHeader(props) {
    function handleRedirect() {
        props.redirect(props.projectURL);
    }

    return (
        <div className="project-header d-flex justify-content-between">
            <div className="project-title">
                <div className="project-name-wrapper">
                    <h5 onClick={handleRedirect}>
                        <i className="material-icons project-title-icon">link</i>
                        <span className='project-name'>{props.project.name}</span>
                    </h5>
                </div>
                <div className="project-subtitle">
                    <i className="material-icons project-header-icon">schedule</i>
                    <span>{formatUnixTimestamp(props.project.last_active)}</span>
                    {(props.project.leader) ? 
                        <span className='project-header-icon-wrapper'>
                            <i className="material-icons project-header-icon">person</i>
                            <span>{props.project.leader}</span>
                        </span>
                    :
                        null
                    }
                    {(props.project.category) ?
                        <span className='project-header-icon-wrapper'>
                            <i className="material-icons project-header-icon">label_important</i>
                            <span>{props.project.category}</span>
                        </span>
                    :
                        null
                    }
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
                </div>
            </div>
            <div className="project-header-right">
                <i className="material-icons mute-project-icon">notifications</i>
            </div>
        </div>
    );
}

export default ProjectHeader;