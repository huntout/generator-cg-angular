'use strict';

var util = require('util');
var SubGenerator = require('../sub-generator.js');
var cgUtils = require('../utils.js');

var FilterGenerator = module.exports = function FilterGenerator( /*args, options, config*/ ) {

  SubGenerator.apply(this, arguments);
};

util.inherits(FilterGenerator, SubGenerator);

FilterGenerator.prototype.files = function files() {
  this.template('filter.js', 'filter/' + this.name + '.js');
  this.template('spec.js', 'filter/' + this.name + '-spec.js');

  cgUtils.addToFile('index.html', '<script class="app" src="filter/' + this.name + '.js"></script>', cgUtils.FILTER_JS_MARKER, '  ', this);
};
