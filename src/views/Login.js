/* global chrome */
import { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { SetRefreshing, IsRefreshing } from '../context/ExtStateContext';
import '../assets/css/views/Login.css'
import Loading from '../components/Background/Loading';

function Login(){
    var url_path = `https://app.activecollab.com`;
    const setRefreshing = useContext(SetRefreshing);
    const isRefreshing = useContext(IsRefreshing);
    const navigate = useNavigate();

    function redirect() {
        window.open(url_path, "_blank");
    }

    // on login page refresh on load
    useEffect(() => {
        chrome.runtime.sendMessage({event: "refresh"});
        setRefreshing(true);
    }, []);

    chrome.runtime.onMessage.addListener((request, sender, reply) => {
        if (request.event === "updated"){
            navigate("/");
        }
    });

    return(
        <div>
            {(isRefreshing) ? 
                <Loading/>
            :
                <div className="row justify-content-center login">
                    <div className="col-xl-5 col-lg-6 col-md-7">
                        <div className="text-center">
                            <h1 className="h2">No Token 🤔</h1>
                            <p className="lead">Token does not exist or is invalid</p>
                            <button className="btn btn-lg btn-block ac-button" role="button" type="submit" onClick={redirect}> 
                                Open ActiveCollab
                            </button>
                            <small>Open up ActiveCollab and sign in to grab a new one</small>
                        </div>
                    </div>
                </div>
            }
        </div>
    );
}

export default Login;