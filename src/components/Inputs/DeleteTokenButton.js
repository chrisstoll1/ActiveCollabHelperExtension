/* global chrome */
function DeleteTokenButton(){
    function deleteToken(){
        chrome.runtime.sendMessage({event: "delete_token"});
    }

    return (
        <button type="button" class="btn btn-danger" onClick={deleteToken}>Delete Token</button>
    );
}

export default DeleteTokenButton;