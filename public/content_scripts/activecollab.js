function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
}

console.log("activecollab.js loaded from ActiveCollab Helper Extension");
var PHPSESSID = getCookie("PHPSESSID");
console.log("PHPSESSID: " + PHPSESSID);
var activecollab_user_instances = getCookie("activecollab_user_instances");
console.log("activecollab_user_instances: " + activecollab_user_instances);

console.log("Sending token to ActiveCollab Helper Extension service worker");
try {
  chrome.runtime.sendMessage({event: "activecollab_token", token: PHPSESSID, instance: activecollab_user_instances});
  console.log("Token sent succsessfully");
} catch (error) {
  console.log("An Error Occurred while sending the token: " + error);
}