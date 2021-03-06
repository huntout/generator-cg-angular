'use strict';

var util = require('util');
var yeoman = require('yeoman-generator');
var path = require('path');
var cgUtils = require('./utils.js');

var SubGenerator = module.exports = function SubGenerator( /*args, options, config*/ ) {

  yeoman.generators.NamedBase.apply(this, arguments);

  this.classname = this._.chain(this.name).humanize().classify().value();
  this.slugname = this._.chain(this.name).humanize().slugify().value();
  this.camelname = this._.chain(this.name).humanize().slugify().camelize().value();
  this.dotname = this.slugname.replace('-', '.');

  this.pkg = cgUtils.pkg();
  this.appname = this.pkg.name;
  this.yo = {};
  this.yo.app = path.dirname(this.pkg.main);
  this.destinationRoot(this.yo.app);
};

util.inherits(SubGenerator, yeoman.generators.NamedBase);
