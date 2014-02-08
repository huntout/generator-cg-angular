'use strict';

var util = require('util');
var yeoman = require('yeoman-generator');
var path = require('path');
var cgUtils = require('../utils.js');

var DirectiveGenerator = module.exports = function DirectiveGenerator( /*args, options, config*/ ) {

  yeoman.generators.NamedBase.apply(this, arguments);

  try {
    this.appname = require(path.join(process.cwd(), 'package.json')).name;
  } catch (e) {
    this.appname = 'Cant find name from package.json';
  }

};

util.inherits(DirectiveGenerator, yeoman.generators.NamedBase);

DirectiveGenerator.prototype.askFor = function askFor() {
  var cb = this.async();

  var prompts = [{
    type: 'confirm',
    name: 'needpartial',
    message: 'Does this directive need an external html file (i.e. partial)?',
    default: true
  }];

  this.prompt(prompts, function(props) {
    this.needpartial = props.needpartial;

    cb();
  }.bind(this));
};

DirectiveGenerator.prototype.files = function files() {

  var filename = 'directive/' + this.name + '/' + this.name;

  if (this.needpartial) {
    this.template('directive.js', filename + '.js');
    this.template('directive.html', filename + '.html');
    this.template('directive.less', filename + '.less');
    this.template('spec.js', filename + '-spec.js');

    cgUtils.addToFile('index.html', '<script class="app" src="' + filename + '.js"></script>', cgUtils.DIRECTIVE_JS_MARKER, '  ', this);
    cgUtils.addToFile('css/app.less', '@import "../' + filename + '.less";', cgUtils.DIRECTIVE_LESS_MARKER, '', this);

  } else {
    this.template('directive_simple.js', 'directive/' + this.name + '.js');
    this.template('spec.js', 'directive/' + this.name + '-spec.js');

    cgUtils.addToFile('index.html', '<script class="app" src="directive/' + this.name + '.js"></script>', cgUtils.DIRECTIVE_JS_MARKER, '  ', this);
  }

};
