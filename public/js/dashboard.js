/**
 * Dashboard
 */

$(document).ready(function () {
    $('#new-thing-dialog').on('hidden.bs.modal', function (e) {
        document.NewThing.reset();
        $(".alert.alert-danger").html("");
        $(".alert.alert-danger").css("display", "none");
    });
    $("#submit-new-thing").click(function () {
        data = $(document.NewThing).serialize();
        $.ajax({
            type: "POST",
            async: false,
            url: "things/create",
            data: data,
            dataType: "json",
            success: function (data) {
                if (data.errors) {
                    $(".alert.alert-danger").html("");
                    $(".alert.alert-danger").css("display", "block");
                    for (key in data.errors) {
                        $(".alert.alert-danger").append(data.errors[key].message + "<br/>");
                    }
                } else {
                    $(".alert.alert-danger").html("");
                    $(".alert.alert-danger").css("display", "none");
                    location.reload();
                }
            },
            error: function (xhr,status,error) {
                console.log(xhr.responseJSON);
            }
        });
    });
    var set = false;
    $("input[thing-type=switch]").each(function () {
            bindSwitch(this);
    });
});
var clientList = [];
function bindSwitch (obj) {
    var thingId = $(obj).attr("id");
    userId = $(obj).attr("user-id");
    clientId = "t:" + userId + ":" + thingId
    clientList[thingId] = new Paho.MQTT.Client("192.168.0.74", 8000, clientId);
    // set callback handlers
    clientList[thingId].onConnectionLost = onConnectionLost;
    clientList[thingId].onMessageArrived = onMessageArrived;
    clientList[thingId].connect({
        onSuccess : function () {onConnect(thingId)},
        userName: "test",
        password: "1234",
        keepAliveInterval: 120
    });
    $(obj).bind({
        click: function () {
            sendMqtt($(this).attr("id"));
            topic = "iot/" + $(this).attr("id");
            sendHttpMqtt(topic);
        }
    });
}

function onConnect(thingId) {
    console.log("Client [" + clientId + "] is connected");
    topic = "iot/" + thingId;
    clientList[thingId].subscribe(topic);
    console.log("Subscriped Topic : " + topic);
    sendMqtt(thingId);
}
// called when the client loses its connection
function onConnectionLost(responseObject) {
    if (responseObject.errorCode !== 0) {
        console.log("onConnectionLost: " + responseObject.errorMessage);
    }
    $("input[thing-type=switch]").each(function () {
        bindSwitch(this);
    });
}

// called when a message arrives
function onMessageArrived(message) {
    console.log(new Date().getTime() + " " + message.payloadString);
}

function sendMqtt(thingId) {
    status = "OFF";
    if ($("#" + thingId).is(":checked")) status = "ON"
    message = new Paho.MQTT.Message(status);
    topic = "iot/" + thingId;
    message.destinationName = topic;
    clientList[thingId].send(message);
}
function sendHttpMqtt(topic) {
    status = "OFF";
    if ($("#" + topic.split("/")[1]).is(":checked")) status = "ON"
    message = status;
    _csrf = document.NewThing._csrf.value;
    $.ajax({
        type: "POST",
        async: false,
        url: "mqtt/publish",
        data: {topic: topic, message: message, _csrf: _csrf},
        dataType: "json",
        success: function (data) {
            console.log(data);
        },
        error: function (xhr,status,error) {
            console.log(xhr.responseJSON);
        }
    });
}
