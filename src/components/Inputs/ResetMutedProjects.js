import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Col, Row, Table } from "react-bootstrap";
import { setChromeBadge } from "../../utils/setChromeBadge";
import '../../assets/css/components/Inputs/ResetMutedProjects.css';

function ResetMutedProjects() {
    const navigate = useNavigate();
    const [mutedProjectsList, setMutedProjectsList] = useState([]);

    const fetchProjects = async () => {
        let projectsResponse = await chrome.storage.local.get(["ACProjects"]);
        let projects = JSON.parse(projectsResponse.ACProjects);
        let mutedResponse = await chrome.storage.sync.get(["MuteStates"]);
        let mutedProjects = mutedResponse.MuteStates;

        let tempMutedProjectsList = [];
        for (let mutedProject in mutedProjects) {
            tempMutedProjectsList.push(projects.find(project => project.id === parseInt(mutedProject)));
        }
        tempMutedProjectsList = tempMutedProjectsList.filter(project => project !== undefined);
        setMutedProjectsList(tempMutedProjectsList);
    }

    useEffect(() => {
        fetchProjects();
    }, []);

    chrome.runtime.onMessage.addListener(async (request) => {
        if (request.event === "settings_reset"){
            fetchProjects();
            getProjectsAndRefreshChromeBadge();
        }
    });

    function handleNavigation(project) {
        chrome.storage.local.set({"WorkingProject": JSON.stringify(project)});
        navigate('/project');
    }

    function getProjectsAndRefreshChromeBadge() {
        chrome.storage.local.get(["ACProjects"]).then((result) => {
            let projects = JSON.parse(result.ACProjects);
            setChromeBadge(projects);
        });
    }

    return (
        <Col>
            <Row className={mutedProjectsList.length === 0 ? 'warning-text' : ''}>
                {mutedProjectsList.length === 0 ? 
                    <div>No Muted Projects</div> :
                    <div className="scrollable-table">
                        <Table>
                            <tbody>
                                {
                                    mutedProjectsList.map((project) => {
                                        return (
                                            <tr>
                                                <td onClick={() => handleNavigation(project)} className="muted-project">
                                                    {project.name}
                                                </td>
                                                <td className="small-col">
                                                    <i className="material-icons unmute-button" onClick={() => {
                                                        chrome.storage.sync.get(['MuteStates'], function(result) {
                                                            if (result.MuteStates) {
                                                                delete result.MuteStates[project.id];
                                                                chrome.storage.sync.set(result);
                                                            }
                                                        });
                                                        setMutedProjectsList(mutedProjectsList.filter(mutedProject => mutedProject.id !== project.id));
                                                        getProjectsAndRefreshChromeBadge();
                                                    }}>close</i>
                                                </td>
                                            </tr>
                                        );    
                                    })
                                }
                            </tbody>
                        </Table>
                    </div>
                }
            </Row>
        </Col>
    );
}

export default ResetMutedProjects;
