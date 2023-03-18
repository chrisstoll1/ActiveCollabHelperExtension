import { memo } from "react";
import OverviewProject from "./OverviewProject";

const FilteredProjects = memo(({ filteredProjects }) => {
    return (
        <>
            {filteredProjects.map((project, index) => {
                return <OverviewProject
                    key={index}
                    project={project}
                />
            })}
        </>
    );
});

export default FilteredProjects;