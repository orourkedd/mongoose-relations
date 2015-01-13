'use strict';

var mongoose = require('mongoose');
var async = require('async');
var parser = require('./path-parser');

var Relate = function () {

};

Relate.prototype.buildPath = function (parsedPath) {
	var path = [];

	for (var i in parsedPath) {
		path.push({
			property: parsedPath[i].property,
			model: parsedPath[i].model,
			finder: parsedPath[i].finder ? parsedPath[i].finder : this.finder,
			idField: parsedPath[i].idField
		});
	}

	return path;
};

Relate.prototype.finder = function (documentCache, root, step, done) {
	//Get the model for the step
	var model = this.getModel(step.model);

	var key = step['model'] + ':' + root[step.property];

	//if in cache, return from here
	var doc;
	if (doc = documentCache[key]) {
		return done(null, doc);
	}

	var id = root[step.property];

	if (!id) {
		return done(null, null);
	}

	var criteria = {};
	criteria[step.idField || '_id'] = id;

	model.findOne(criteria).exec(function (err, result) {
		if (result) {
			documentCache[key] = result;
		}

		done(err, result);
	});
};

Relate.prototype.getModel = function (name) {
	return mongoose.models[name];
};

Relate.prototype.getValue = function (documentCache, root, path, done, index) {
	var self = this;
	index || (index = 0);

	var step = path[index];

	//If this is the end of the path, ie the property.
	if (!step.model) {
		return done(null, root[step.property]);
	}

	step.finder.call(this, documentCache, root, step, function (err, result) {
		if (err) {
			return done(err);
		}

		if (!result) {
			return done();
		}

		self.getValue(documentCache, result, path, done, index + 1);
	});
};

Relate.prototype.setValue = function (root, path, value) {
	root.relations || (root.relations = {})
	var node = root.relations;
	for (var i in path) {
		if (i == path.length - 1) {
			node[path[i].property] = value;
			break;
		} //end if
		node[path[i].property] || (node[path[i].property] = {})
		node = node[path[i].property]
	} //end for
};

Relate.prototype.setValueFromPath = function (documentCache, root, path, done) {
	var self = this;

	//Check if the path is a string
	if (typeof path === 'string') {
		path = parser.parseStringPath(path);
	}

	path = this.buildPath(path);

	this.getValue(documentCache, root, path, function (err, value) {
		if (err) {
			return done(err);
		}

		self.setValue(root, path, value);
		done();
	});
};

Relate.prototype.paths = function (schema, paths) {
	var relate = this;

	schema.relations = paths;

	//Add relations property to schema if needed
	if (!schema.paths.relations) {
		schema.add({
			relations: mongoose.Schema.Types.Mixed
		});
	}

	//Add middleware to schema
	schema.pre('save', function (next) {
		var self = this;
		//a temporary document cache to prevent multiple queries for the same object
		//this cache should be garbage collected after this middleware is run
		var documentCache = {};
		var queue = [];

		//iterate over all paths defined in model.relations
		for (var i in schema.relations) {

			//create callbacks in closures for async
			var callback = (function (path) {
				return function (aCallback) {

					//parse the path and set the value on the model
					relate.setValueFromPath(documentCache, self, path, function (err) {
						aCallback(err);
					});
				};
			})(schema.relations[i]);

			//Add the callback to the async queue
			queue.push(callback);
		}

		//run the path parsers
		async.series(queue, function (err, results) {
			if (err) {
				return next(err);
			}

			next();
		});
	}); //end middleware
}; //end Relate.prototype.paths

module.exports = new Relate();