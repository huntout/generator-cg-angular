'use strict';

var util = require('util');
var yeoman = require('yeoman-generator');
var path = require('path');
var cgUtils = require('./utils.js');

var SubGenerator = module.exports = function SubGenerator( /*args, options, config*/ ) {

  yeoman.generators.NamedBase.apply(this, arguments);

  var pkg = cgUtils.pkg();
  this.appname = pkg.name;
  this.assets = path.dirname(pkg.main);
  this.destinationRoot(this.assets);
};

util.inherits(SubGenerator, yeoman.generators.NamedBase);
