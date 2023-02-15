import DatePicker from './DatePicker';

function DiscussionMessageDateFilter() {
    return (
        <div class="card">
            <div class="card-body">
                <div class="row">
                    <div class="col-4">
                        <label class="form-control settings-label-text">Last Message Date</label>
                    </div>
                    <div class="col-2">
                        <select class="form-control settings-input">
                            <option selected value="before">Before</option>
                            <option value="after">After</option>
                            <option value="on">On</option>
                        </select>
                    </div>
                    <div class="col-3">
                        <select class="form-control settings-input">
                            <option selected value="before">Static</option>
                            <option value="after">Today +</option>
                            <option value="on">Today -</option>
                        </select>
                    </div>
                    <div class="col-3">
                        <DatePicker/>
                    </div>
                </div>
            </div>  
        </div>
    );
}

export default DiscussionMessageDateFilter;