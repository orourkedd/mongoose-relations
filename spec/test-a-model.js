var mongoose = require('mongoose');
var relate = require('../lib/relate');
var parser = require('../lib/path-parser');

testASchema = new mongoose.Schema({
	testB: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'TestB'
	}
});

relate.paths(testASchema, [
	'testB.testC.name',
	'testB.title',
	'testB.dob'
]);

module.exports = mongoose.model('TestA', testASchema);