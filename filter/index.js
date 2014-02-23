'use strict';

var util = require('util');
var SubGenerator = require('../sub-generator.js');
var cgUtils = require('../utils.js');

var FilterGenerator = module.exports = function FilterGenerator( /*args, options, config*/ ) {

  SubGenerator.apply(this, arguments);
};

util.inherits(FilterGenerator, SubGenerator);

FilterGenerator.prototype.files = function files() {
  var filename = 'filter/' + this.slugname;

  this.template('filter.js', filename + '.js');
  this.template('spec.js', filename + '-spec.js');

  cgUtils.addToFile('index.html', '<script class="app" src="' + filename + '.js"></script>', cgUtils.FILTER_JS_MARKER, '  ', this);
};
