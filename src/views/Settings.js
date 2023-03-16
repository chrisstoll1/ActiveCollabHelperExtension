/*global chrome*/
import { useState, useEffect } from 'react';
import '../assets/css/views/Settings.css';
import { useEffectOnlyOnUpdate } from '../hooks/UseEffectOnlyOnUpdate'
import Checkbox from '../components/Inputs/Checkbox';
import DiscussionMessageDateFilter from '../components/Inputs/DiscussionMessageDateFilter';
import DiscussionMessageSenderFilter from '../components/Inputs/DiscussionMessageSenderFilter';
import DeleteTokenButton from '../components/Inputs/DeleteTokenButton';
import ResetSettingsButton from '../components/Inputs/ResetSettingsButton';
import { DiscussionMessageSenderFilterContext, SetDiscussionMessageSenderFilterContext, DiscussionMessageDateFilterContext, SetDiscussionMessageDateFilterContext, SettingsTogglesContext, SetSettingsTogglesContext} from '../context/SettingsContext';

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
        chrome.storage.sync.set({"user_settings": settings});
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

                                    <div className="card">
                                        <div className="card-body">
                                            <div className="row">
                                                <div className="col-12">
                                                    
                                                    <div className="row">
                                                        <div className="col-12">
                                                            <h5 className="settings-title">Discussion Filters</h5>
                                                            <hr className="mt-4"/>
                                                        </div>
                                                    </div>
                                            
                                                    <DiscussionMessageSenderFilter/>

                                                    <DiscussionMessageDateFilter/>

                                                    <div className="card">
                                                        <div className="card-body">
                                                            <div className="row">
                                                                <div className="col-4">
                                                                    <label className="form-control settings-label-text">Hide Unflagged Discussions</label>
                                                                </div>
                                                                <div className="col-8">
                                                                    <Checkbox id="hide-unflagged-discussions" label=""/>    
                                                                </div>
                                                            </div>
                                                        </div>  
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="card">
                                        <div className="card-body">
                                            <div className="row">
                                                <div className="col-12">
                                                    
                                                    <div className="row">
                                                        <div className="col-12">
                                                            <h5 className="settings-title">Task Filters</h5>
                                                            <hr className="mt-4"/>
                                                        </div>
                                                    </div>

                                                    <div className="card">
                                                        <div className="card-body">
                                                            <div className="row">
                                                                <div className="col-4">
                                                                    <label className="form-control settings-label-text">Hide Open Tasks</label>
                                                                </div>
                                                                <div className="col-8">
                                                                    <Checkbox id="hide-open-tasks" label=""/>     
                                                                </div>
                                                            </div>
                                                        </div>  
                                                    </div>

                                                    <div className="card">
                                                        <div className="card-body">
                                                            <div className="row">
                                                                <div className="col-4">
                                                                    <label className="form-control settings-label-text">Hide Completed Tasks</label>
                                                                </div>
                                                                <div className="col-8">
                                                                    <Checkbox id="hide-completed-tasks" label=""/>      
                                                                </div>
                                                            </div>
                                                        </div>  
                                                    </div>

                                                    <div className="card">
                                                        <div className="card-body">
                                                            <div className="row">
                                                                <div className="col-4">
                                                                    <label className="form-control settings-label-text">Hide Overdue Tasks</label>
                                                                </div>
                                                                <div className="col-8">
                                                                    <Checkbox id="hide-overdue-tasks" label=""/>     
                                                                </div>
                                                            </div>
                                                        </div>  
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="card">
                                        <div className="card-body">
                                            <div className="row">
                                                <div className="col-12">
                                                    
                                                    <div className="row">
                                                        <div className="col-12">
                                                            <h5 className="settings-title">General</h5>
                                                            <hr className="mt-4"/>
                                                        </div>
                                                    </div>

                                                    <div className="card">
                                                        <div className="card-body">
                                                            <div className="row">
                                                                <div className="col-4">
                                                                    <label className="form-control settings-label-text">Hide Empty Projects</label>
                                                                </div>
                                                                <div className="col-8">
                                                                    <Checkbox id="hide-empty-projects" label=""/>       
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

            <div className="d-flex justify-content-end">
                <div className="p-2">
                    <small>ActiveCollab Helper Extension v0.0.1</small>
                </div>
            </div>
        </div>
    );
}

export default Settings;