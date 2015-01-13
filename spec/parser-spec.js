var expect = require('chai').expect;
var Relate = require('../lib/relate');
var mongoose = require('mongoose');
var TestA = require('./test-a-model');
var TestB = require('./test-b-model');
var TestC = require('./test-c-model');
var parser = require('../lib/path-parser');

describe('Parser', function () {
	describe('#parseStringPath', function () {
		it('should parse a string path', function () {
			var path = 'testA.testB.name';
			var parsed = parser.parseStringPath(path);
		});
	});
});