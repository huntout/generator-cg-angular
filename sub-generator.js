'use strict';

var util = require('util');
var yeoman = require('yeoman-generator');
var path = require('path');

var SubGenerator = module.exports = function SubGenerator( /*args, options, config*/ ) {

  yeoman.generators.NamedBase.apply(this, arguments);

  var pkg;
  try {
    pkg = require(path.join(process.cwd(), 'package.json'));
    this.appname = pkg.name;
    this.assets = path.dirname(pkg.main || 'index.html');
  } catch (e) {
    this.appname = 'Cant find name from package.json';
    this.assets = '.';
  }

  this.destinationRoot(this.assets);
};

util.inherits(SubGenerator, yeoman.generators.NamedBase);
