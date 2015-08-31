/**
 * Module dependencies.
 */
require("./default.js");

/**
 * Thing Schema
 */

var ThingSchema = new Schema({
    name: { type: String, default: '' },
    type: { type: String, default: '' },
    user_id: {type: String, default: ''},
    enabled: {type: String, default: 'N'},
    description: {type: String, default: ''},
    switch_status: {type: String, default: 'OFF'}
});
ThingSchema.plugin(timestamps);

ThingSchema.path('name').validate(function (name) {
        return name.length;
    }, 'Name cannot be blank');

ThingSchema.path('type').validate(function (type) {
    return type.length;
}, 'Type cannot be blank');

ThingSchema.path('user_id').validate(function (user_id) {
    return user_id.length;
}, 'User cannot be blank');

ThingSchema.path('enabled').validate(function (enabled) {
    return enabled.length;
}, 'Status cannot be blank');
ThingSchema.path('description').validate(function (description) {
    return true;
}, 'Description cannot be blank');


mongoose.model('Thing', ThingSchema);
