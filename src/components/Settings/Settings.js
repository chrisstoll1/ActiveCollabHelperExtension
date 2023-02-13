/*global chrome*/
import { useState, useRef, useEffect } from 'react';
import './Settings.css';
import { useEffectOnlyOnUpdate } from '../../UseEffectOnlyOnUpdateHook';
import Checkbox from './Checkbox';
import DiscussionMessageDateFilter from './DiscussionMessageDateFilter';
import DiscussionMessageSenderFilter from './DiscussionMessageSenderFilter';
import DeleteTokenButton from './DeleteTokenButton';
import ResetSettingsButton from './ResetSettingsButton';
import { DiscussionMessageSenderFilterContext, SetDiscussionMessageSenderFilterContext, DiscussionMessageDateFilterContext, SetDiscussionMessageDateFilterContext, SettingsTogglesContext, SetSettingsTogglesContext} from './SettingsContext';

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

    return (
        <div class="main-body">
            <DiscussionMessageSenderFilterContext.Provider value={discussionMessageSenderFilter}>
                <SetDiscussionMessageSenderFilterContext.Provider value={setDiscussionMessageSenderFilter}>
                    <DiscussionMessageDateFilterContext.Provider value={discussionMessageDateFilter}>
                        <SetDiscussionMessageDateFilterContext.Provider value={setDiscussionMessageDateFilter}>
                            <SettingsTogglesContext.Provider value={settingsToggles}>
                                <SetSettingsTogglesContext.Provider value={setSettingsToggles}>

                                    <div class="card">
                                        <div class="card-body">
                                            <div class="row">
                                                <div class="col-12">
                                                    
                                                    <div class="row">
                                                        <div class="col-12">
                                                            <h5 class="settings-title">Discussion Filters</h5>
                                                            <hr class="mt-4"/>
                                                        </div>
                                                    </div>
                                            
                                                    <DiscussionMessageSenderFilter/>

                                                    <DiscussionMessageDateFilter/>

                                                    <div class="card">
                                                        <div class="card-body">
                                                            <div class="row">
                                                                <div class="col-4">
                                                                    <label class="form-control settings-label-text">Hide Unflagged Discussions</label>
                                                                </div>
                                                                <div class="col-8">
                                                                    <Checkbox id="hide-unflagged-discussions" label=""/>    
                                                                </div>
                                                            </div>
                                                        </div>  
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="card">
                                        <div class="card-body">
                                            <div class="row">
                                                <div class="col-12">
                                                    
                                                    <div class="row">
                                                        <div class="col-12">
                                                            <h5 class="settings-title">Task Filters</h5>
                                                            <hr class="mt-4"/>
                                                        </div>
                                                    </div>

                                                    <div class="card">
                                                        <div class="card-body">
                                                            <div class="row">
                                                                <div class="col-4">
                                                                    <label class="form-control settings-label-text">Hide Open Tasks</label>
                                                                </div>
                                                                <div class="col-8">
                                                                    <Checkbox id="hide-open-tasks" label=""/>     
                                                                </div>
                                                            </div>
                                                        </div>  
                                                    </div>

                                                    <div class="card">
                                                        <div class="card-body">
                                                            <div class="row">
                                                                <div class="col-4">
                                                                    <label class="form-control settings-label-text">Hide Completed Tasks</label>
                                                                </div>
                                                                <div class="col-8">
                                                                    <Checkbox id="hide-completed-tasks" label=""/>      
                                                                </div>
                                                            </div>
                                                        </div>  
                                                    </div>

                                                    <div class="card">
                                                        <div class="card-body">
                                                            <div class="row">
                                                                <div class="col-4">
                                                                    <label class="form-control settings-label-text">Hide Overdue Tasks</label>
                                                                </div>
                                                                <div class="col-8">
                                                                    <Checkbox id="hide-overdue-tasks" label=""/>     
                                                                </div>
                                                            </div>
                                                        </div>  
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="card">
                                        <div class="card-body">
                                            <div class="row">
                                                <div class="col-12">
                                                    
                                                    <div class="row">
                                                        <div class="col-12">
                                                            <h5 class="settings-title">General</h5>
                                                            <hr class="mt-4"/>
                                                        </div>
                                                    </div>

                                                    <div class="card">
                                                        <div class="card-body">
                                                            <div class="row">
                                                                <div class="col-4">
                                                                    <label class="form-control settings-label-text">Hide Empty Projects</label>
                                                                </div>
                                                                <div class="col-8">
                                                                    <Checkbox id="hide-empty-projects" label=""/>       
                                                                </div>
                                                            </div>
                                                        </div>  
                                                    </div>
                                            
                                                    <div class="card">
                                                        <div class="card-body">
                                                            <div class="row">
                                                                <div class="col-4">
                                                                    <label class="form-control settings-label-text">Sign Out of ActiveCollab</label>
                                                                </div>
                                                                <div class="col-8">
                                                                    <DeleteTokenButton/>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div class="card">
                                                        <div class="card-body">
                                                            <div class="row">
                                                                <div class="col-4">
                                                                    <label class="form-control settings-label-text">Reset All Settings</label>
                                                                </div>
                                                                <div class="col-8">
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