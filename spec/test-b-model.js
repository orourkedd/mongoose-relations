var mongoose = require('mongoose');

testBSchema = new mongoose.Schema({
	testC: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'TestC'
	},
	title: String,
	dob: Date
});

module.exports = mongoose.model('TestB', testBSchema);