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
  }, {
    name: 'assets',
    message: 'What would you like the assets folder to be?',
    default: '.'
  }];

  this.prompt(prompts, function(props) {
    this.appname = props.appname;
    this.assets = props.assets;

    cb();
  }.bind(this));
};

CgangularGenerator.prototype.app = function app() {
  this.directory('skeleton/', '.');
  this.directory('assets/', this.assets);
  if (this.assets !== '.') {
    this.write('index.html', this._.template('<script>\nlocation.href = \'<%= assets %>/\';\n</script>\n', this));
  }
};
