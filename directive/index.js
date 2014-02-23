'use strict';

var util = require('util');
var SubGenerator = require('../sub-generator.js');
var cgUtils = require('../utils.js');

var DirectiveGenerator = module.exports = function DirectiveGenerator( /*args, options, config*/ ) {

  SubGenerator.apply(this, arguments);
};

util.inherits(DirectiveGenerator, SubGenerator);

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

  var filename, sourcejs;

  if (this.needpartial) {

    filename = 'directive/' + this.slugname + '/' + this.slugname;
    sourcejs = 'directive.js';

    this.template('directive.html', filename + '.html');
    this.template('directive.less', filename + '.less');
    cgUtils.addToFile('css/app.less', '@import "../' + filename + '.less";', cgUtils.DIRECTIVE_LESS_MARKER, '', this);
  } else {

    filename = 'directive/' + this.slugname;
    sourcejs = 'directive_simple.js';
  }

  this.template(sourcejs, filename + '.js');
  this.template('spec.js', filename + '-spec.js');
  cgUtils.addToFile('index.html', '<script class="app" src="' + filename + '.js"></script>', cgUtils.DIRECTIVE_JS_MARKER, '  ', this);
};
