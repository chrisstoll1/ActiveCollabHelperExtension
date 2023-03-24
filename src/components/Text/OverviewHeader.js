import '../../assets/css/components/Text/OverviewHeader.css';

function OverviewHeader(props) {
    const { filteredProjects, projects } = props;

    function projectsCoutner() {
        let counterText;
        if (filteredProjects.length === projects.length) {
            counterText = `(${projects.length})`;
        } else {
            counterText = `(${filteredProjects.length} of ${projects.length})`;   
        }
        return counterText;
    }

    return (
        <div className="overview-header">
            <h5 className="inline-element">
                Projects
            </h5>
            <div className='overview-counter-text text-muted inline-element'>
                {' '}
                {projectsCoutner()}
            </div>
        </div>
    )
}

export default OverviewHeader;