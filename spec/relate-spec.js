var expect = require('chai').expect;
var Relate = require('../lib/relate');
var mongoose = require('mongoose');
var chainFactory = require('./chain-factory');
var TestA = require('./test-a-model');

describe('Mongoose Relations', function () {
	it('will will get the value for a path', function (done) {
		chainFactory(function (err, results) {
			if (err) return done(err);

			expect(results.a.relations.testB.testC.name).to.eq('eureka!');

			//Query by it!
			TestA.findOne({
				'relations.testB.testC.name': 'eureka!'
			}).exec(function (err, result) {
				expect(result.relations.testB.testC.name).to.eq('eureka!');
				expect(result.relations.testB.title).to.eq('Bee');
				done();
			});

		});
	});
});