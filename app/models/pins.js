'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Pin = new Schema({
    caption : String,
    url : String,
});




module.exports = mongoose.model('Pin', Pin);
