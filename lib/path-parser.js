'use strict';

var Parser = function () {};

Parser.prototype.ucFirst = function (string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
};

Parser.prototype.parseStringPath = function (path) {
	var parts = path.split('.');

	var steps = [];
	for (var i in parts) {

		if (i == parts.length - 1) {
			var model = null;
		} else {
			var model = this.ucFirst(parts[i]);
		}

		steps.push({
			property: parts[i],
			model: model
		});
	}

	return steps;
};

module.exports = new Parser();