'use strict';

var util = require('util');
var yeoman = require('yeoman-generator');
var path = require('path');
var cgUtils = require('../utils.js');
var chalk = require('chalk');
var _ = require('underscore');

_.str = require('underscore.string');
_.mixin(_.str.exports());

var PartialGenerator = module.exports = function PartialGenerator( /*args, options, config*/ ) {

  yeoman.generators.NamedBase.apply(this, arguments);

  try {
    this.appname = require(path.join(process.cwd(), 'package.json')).name;
  } catch (e) {
    this.appname = 'Cant find name from package.json';
  }

};

util.inherits(PartialGenerator, yeoman.generators.NamedBase);

PartialGenerator.prototype.askFor = function askFor() {
  var cb = this.async();

  var prompts = [{
    name: 'route',
    message: 'Enter your route name (i.e. /mypartial/:id).  If you don\'t want a route added for you, leave this empty.'
  }];

  this.prompt(prompts, function(props) {
    this.route = props.route;

    cb();
  }.bind(this));
};

PartialGenerator.prototype.files = function files() {

  this.ctrlname = _.camelize(_.classify(this.name)) + 'Ctrl';

  this.template('partial.js', 'partial/' + this.name + '/' + this.name + '.js');
  this.template('partial.html', 'partial/' + this.name + '/' + this.name + '.html');
  this.template('partial.less', 'partial/' + this.name + '/' + this.name + '.less');
  this.template('spec.js', 'partial/' + this.name + '/' + this.name + '-spec.js');

  cgUtils.addToFile('index.html', '<script class="app" src="partial/' + this.name + '/' + this.name + '.js"></script>', cgUtils.PARTIAL_JS_MARKER, '  ');
  this.log.writeln(chalk.green(' updating') + ' %s', 'index.html');

  cgUtils.addToFile('css/app.less', '@import "../partial/' + this.name + '/' + this.name + '.less";', cgUtils.PARTIAL_LESS_MARKER, '');
  this.log.writeln(chalk.green(' updating') + ' %s', 'css/app.less');

  if (this.route && this.route.length > 0) {
    cgUtils.addToFile('js/setup.js', 'when(\'' + this.route + '\', {\n    templateUrl: \'partial/' + this.name + '/' + this.name + '.html\'\n  }).', cgUtils.ROUTE_MARKER, '  ');
    this.log.writeln(chalk.green(' updating') + ' %s', 'js/setup.js');
  }

};
