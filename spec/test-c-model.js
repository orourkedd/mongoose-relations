var mongoose = require('mongoose');

testCSchema = new mongoose.Schema({
	name: String
});

module.exports = mongoose.model('TestC', testCSchema);