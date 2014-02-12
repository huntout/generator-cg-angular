'use strict';

var util = require('util');
var yeoman = require('yeoman-generator');
var path = require('path');
var cgUtils = require('../utils.js');

var FilterGenerator = module.exports = function FilterGenerator( /*args, options, config*/ ) {

  yeoman.generators.NamedBase.apply(this, arguments);

  try {
    this.appname = require(path.join(process.cwd(), 'package.json')).name;
  } catch (e) {
    this.appname = 'Cant find name from package.json';
  }

};

util.inherits(FilterGenerator, yeoman.generators.NamedBase);

FilterGenerator.prototype.files = function files() {
  this.template('filter.js', 'filter/' + this.name + '.js');
  this.template('spec.js', 'filter/' + this.name + '-spec.js');

  cgUtils.addToFile('index.html', '<script class="app" src="filter/' + this.name + '.js"></script>', cgUtils.FILTER_JS_MARKER, '  ', this);
};
