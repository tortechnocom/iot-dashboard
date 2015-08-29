/**
 * Home
 */

$(document).ready(function () {
    clientTime = new Date().getTime();
    clientId = "global:" + clientTime;
    client = new Paho.MQTT.Client(location.hostname, Number(location.port), clientId);
    client.onConnectionLost = onConnectionLost;
    client.onMessageArrived = onMessageArrived;
    client.connect({
        onSuccess : onConnect,
        keepAliveInterval: 120
    });
});
function onConnect() {
    topic = "iot/global";
    client.subscribe(topic);
    console.log("Subscibed Topic: " + topic);
}
// called when the client loses its connection
function onConnectionLost(responseObject) {
    if (responseObject.errorCode !== 0) {
        console.log("onConnectionLost: " + responseObject.errorMessage);
    }
}

// called when a message arrives
function onMessageArrived(message) {
    if (message.payloadString) {
        console.log(new Date().getTime() + " - " + message.payloadString);
        if (message.payloadString) {
            console.log(new Date().getTime() + " - " + message.payloadString);
            $("#messages").html(message.payloadString.split("=")[1]);
        }
    }
}
