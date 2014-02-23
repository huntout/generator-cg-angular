'use strict';

var util = require('util');
var SubGenerator = require('../sub-generator.js');
var cgUtils = require('../utils.js');

var ServiceGenerator = module.exports = function ServiceGenerator( /*args, options, config*/ ) {

  SubGenerator.apply(this, arguments);
};

util.inherits(ServiceGenerator, SubGenerator);

ServiceGenerator.prototype.files = function files() {
  var filename = 'service/' + this.name;

  this.template('service.js', filename + '.js');
  this.template('spec.js', filename + '-spec.js');

  cgUtils.addToFile('index.html', '<script class="app" src="' + filename + '.js"></script>', cgUtils.SERVICE_JS_MARKER, '  ', this);
};
