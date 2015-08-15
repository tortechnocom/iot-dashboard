require("./default.js");

/**
 * MqttMessage Schema
 */

var MqttMessageSchema = new Schema({
    client: { type: String, default: '' },
    message: { type: String, default: '' },
    topic: {type: String, default: ''}
});
MqttMessageSchema.plugin(timestamps);
MqttMessageSchema.path("client");
MqttMessageSchema.path("message");
MqttMessageSchema.path("topic");

mongoose.model('MqttMessage', MqttMessageSchema);