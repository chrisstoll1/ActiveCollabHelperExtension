/*global chrome*/
import { useState } from 'react';
import Checkbox from './Checkbox';

function Settings() {
    return (
        <div class="main-body">
            <div class="card">
                <div class="card-body">
                    <div class="row">
                        <div class="col-2"></div>
                        <div class="col-4">
                            <h6>Actions</h6>
                            <button class="btn btn-danger" type="button">Delete Token</button>
                        </div>
                        <div class="col-4">
                            <h6>Filters</h6>
                            <Checkbox 
                                id="dated-tasks"
                                label="Show Projects with Dated Tasks"
                            />
                            <Checkbox 
                                id="unresponded-discussions"
                                label="Show Projects with Unresponded Discussions"
                            />
                            <Checkbox 
                                id="salesforce-outdated"
                                label="Show Projects with Outdated Salesforce Data"
                            />
                        </div>
                        <div class="col-2"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Settings;