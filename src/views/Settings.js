/*global chrome*/
import { useState, useEffect } from 'react';
import '../assets/css/views/Settings.css';
import { useEffectOnlyOnUpdate } from '../hooks/UseEffectOnlyOnUpdate'
import Checkbox from '../components/Inputs/Checkbox';
import DeleteTokenButton from '../components/Inputs/DeleteTokenButton';
import ResetSettingsButton from '../components/Inputs/ResetSettingsButton';
import { DiscussionMessageSenderFilterContext, SetDiscussionMessageSenderFilterContext, DiscussionMessageDateFilterContext, SetDiscussionMessageDateFilterContext, SettingsTogglesContext, SetSettingsTogglesContext} from '../context/SettingsContext';
import { setChromeBadge } from '../utils/setChromeBadge';
import { Accordion, Card, Button } from 'react-bootstrap';
import SettingsFilterAccordion from '../components/Cards/SettingsFilterAccordion';

function Settings() {
    const [discussionMessageSenderFilter, setDiscussionMessageSenderFilter] = useState({});
    const [discussionMessageDateFilter, setDiscussionMessageDateFilter] = useState({});
    const [settingsToggles, setSettingsToggles] = useState({});

    useEffectOnlyOnUpdate(() => {        
        let settings = {
            discussionMessageSenderFilter: discussionMessageSenderFilter,
            discussionMessageDateFilter: discussionMessageDateFilter,
            settingsToggles: settingsToggles
        };

        console.log(settings);
        chrome.storage.sync.set({"user_settings": settings});

        // Update Chrome Badge using setChromeBadge
        chrome.storage.local.get(["ACProjects"]).then(async (result) => {
            const projects = JSON.parse(result.ACProjects);
            if (Object.keys(projects).length !== 0){
                await setChromeBadge(projects);
            }
        });

    }, [discussionMessageSenderFilter, discussionMessageDateFilter, settingsToggles]);

    useEffect(() => {
        chrome.storage.sync.get("user_settings", function(result) {
            if (result.user_settings) {
                setDiscussionMessageSenderFilter(result.user_settings.discussionMessageSenderFilter);
                setDiscussionMessageDateFilter(result.user_settings.discussionMessageDateFilter);
                setSettingsToggles(result.user_settings.settingsToggles);
            }
        });
    }, []);

    chrome.runtime.onMessage.addListener(async (request) => {
        if (request.event === "settings_reset"){
            chrome.storage.sync.get("user_settings", function(result) {
                if (result.user_settings) {
                    setDiscussionMessageSenderFilter(result.user_settings.discussionMessageSenderFilter);
                    setDiscussionMessageDateFilter(result.user_settings.discussionMessageDateFilter);
                    setSettingsToggles(result.user_settings.settingsToggles);
                }
            });
        }
    });


    return (
        <div className="main-body">
            <DiscussionMessageSenderFilterContext.Provider value={discussionMessageSenderFilter}>
                <SetDiscussionMessageSenderFilterContext.Provider value={setDiscussionMessageSenderFilter}>
                    <DiscussionMessageDateFilterContext.Provider value={discussionMessageDateFilter}>
                        <SetDiscussionMessageDateFilterContext.Provider value={setDiscussionMessageDateFilter}>
                            <SettingsTogglesContext.Provider value={settingsToggles}>
                                <SetSettingsTogglesContext.Provider value={setSettingsToggles}>

                                    <SettingsFilterAccordion/>

                                    <div className="card">
                                        <div className="card-body">
                                            <div className="row">
                                                <div className="col-12">
                                                    
                                                    <div className="row">
                                                        <div className="col-12">
                                                            <h5 className="settings-title">Options</h5>
                                                            <hr className="mt-4"/>
                                                        </div>
                                                    </div>

                                                    <div className="card">
                                                        <div className="card-body">
                                                            <div className="row">
                                                                <div className="col-4">
                                                                    <label className="form-control settings-label-text">Debug</label>
                                                                </div>
                                                                <div className="col-8">
                                                                    <Checkbox id="debug" label=""/>       
                                                                </div>
                                                            </div>
                                                        </div>  
                                                    </div>
                                            
                                                    <div className="card">
                                                        <div className="card-body">
                                                            <div className="row">
                                                                <div className="col-4">
                                                                    <label className="form-control settings-label-text">Sign Out of ActiveCollab</label>
                                                                </div>
                                                                <div className="col-8">
                                                                    <DeleteTokenButton/>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="card">
                                                        <div className="card-body">
                                                            <div className="row">
                                                                <div className="col-4">
                                                                    <label className="form-control settings-label-text">Reset All Settings</label>
                                                                </div>
                                                                <div className="col-8">
                                                                    <ResetSettingsButton/>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                </SetSettingsTogglesContext.Provider>
                            </SettingsTogglesContext.Provider>
                        </SetDiscussionMessageDateFilterContext.Provider>
                    </DiscussionMessageDateFilterContext.Provider>
                </SetDiscussionMessageSenderFilterContext.Provider>
            </DiscussionMessageSenderFilterContext.Provider>
        </div>
    );
}

export default Settings;