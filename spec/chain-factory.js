var TestA = require('./test-a-model');
var TestB = require('./test-b-model');
var TestC = require('./test-c-model');
var mongoose = require('mongoose');

module.exports = function (done) {
	mongoose.connect('mongodb://localhost/mongooseRelationalTest');
	mongoose.set('debug', true);

	mongoose.connection.on('open', function () {
		c = new TestC({
			name: 'eureka!'
		});

		c.save(function (err) {
			if (err) {
				return done(err);
			}

			b = new TestB({
				testC: c,
				title: 'Bee',
				dob: new Date()
			});
			b.save(function (err) {
				if (err) {
					return done(err);
				}

				a = new TestA({
					testB: b
				});
				a.save(function (err) {
					if (err) {
						return done(err);
					}

					done(null, {
						a: a,
						b: b,
						c: c
					});

				});
			});
		});
	});

};