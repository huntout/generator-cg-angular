'use strict';

var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');

var CgangularGenerator = module.exports = function CgangularGenerator(args, options /*, config*/ ) {
  yeoman.generators.Base.apply(this, arguments);

  this.argument('appname', {
    type: String,
    required: false
  });
  this.appname = this.appname || path.basename(process.cwd());
  this.appname = this._.camelize(this._.slugify(this._.humanize(this.appname)));

  this.on('end', function() {
    this.installDependencies({
      skipInstall: options['skip-install']
    });
  });

  this.pkg = JSON.parse(this.readFileAsString(path.join(__dirname, '../package.json')));
};

util.inherits(CgangularGenerator, yeoman.generators.Base);

CgangularGenerator.prototype.askFor = function askFor() {
  var cb = this.async();

  var prompts = [{
    name: 'appname',
    message: 'What would you like the angular app/module name to be?',
    default: this.appname
  }];

  this.prompt(prompts, function(props) {
    this.appname = props.appname;

    cb();
  }.bind(this));
};

CgangularGenerator.prototype.app = function app() {
  this.directory('skeleton/', './');
  this.template('skeleton/js/setup.js', './js/setup.js');
  this.template('skeleton/bower.json', './bower.json');
  this.template('skeleton/Gruntfile.js', './Gruntfile.js');
  this.template('skeleton/index.html', './index.html');
  this.template('skeleton/package.json', './package.json');
  this.template('skeleton/README.md', './README.md');
};
