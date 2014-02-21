'use strict';

var util = require('util');
var SubGenerator = require('../sub-generator.js');
var cgUtils = require('../utils.js');

var ServiceGenerator = module.exports = function ServiceGenerator( /*args, options, config*/ ) {

  SubGenerator.apply(this, arguments);
};

util.inherits(ServiceGenerator, SubGenerator);

ServiceGenerator.prototype.files = function files() {
  this.template('service.js', 'service/' + this.name + '.js');
  this.template('spec.js', 'service/' + this.name + '-spec.js');

  cgUtils.addToFile('index.html', '<script class="app" src="service/' + this.name + '.js"></script>', cgUtils.SERVICE_JS_MARKER, '  ', this);
};
