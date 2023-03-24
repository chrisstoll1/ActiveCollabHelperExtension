import { formatUnixTimestamp } from '../../utils/formatUnixTimestamp';
import '../../assets/css/components/Text/ProjectHeader.css';
import { OverlayTrigger, Popover } from 'react-bootstrap';

function ProjectHeader(props) {
    function handleRedirect() {
        props.redirect(props.projectURL);
    }

    const popover = (
        <Popover id="popover-basic">
          <Popover.Header as="h3">Mute Project Button</Popover.Header>
          <Popover.Body>
            This is a button that will mute the project. This feature is not yet implemented. See the <a href="https://github.com/chrisstoll1/ActiveCollabHelperExtension/issues/11" target="_blank" rel="noreferrer">issue</a> for more information.
          </Popover.Body>
        </Popover>
      );

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
                </div>
            </div>
            <div className="project-header-right">
                <OverlayTrigger trigger={['click']} placement="bottom" overlay={popover}>
                    <i className="material-icons mute-project-icon">notifications</i>
                </OverlayTrigger>
                {(props.project.label) ?  
                    <div className="project-status-label-text">
                        <span>
                            {props.project.label}
                        </span>
                    </div>
                : 
                    null
                }
            </div>
        </div>
    );
}

export default ProjectHeader;