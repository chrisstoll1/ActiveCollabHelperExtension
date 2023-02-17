import '../assets/css/views/Login.css'

function Login(){
    var url_path = `https://app.activecollab.com`;

    function redirect() {
        window.open(url_path, "_blank");
    }

    return(
        <div class="row justify-content-center login">
            <div class="col-xl-5 col-lg-6 col-md-7">
                <div class="text-center">
                    <h1 class="h2">No Token 🤔</h1>
                    <p class="lead">Token does not exist or is invalid</p>
                    <button class="btn btn-lg btn-block ac-button" role="button" type="submit" onClick={redirect}> 
                        Open ActiveCollab
                    </button>
                    <small>Open up ActiveCollab and sign in to grab a new one</small>
                </div>
            </div>
        </div>
    );
}

export default Login;