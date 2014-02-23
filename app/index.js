'use strict';

var util = require('util');
var path = require('path');
var fs = require('fs');
var mkdirp = require('mkdirp');
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var cgUtils = require('../utils.js');

var CgangularGenerator = module.exports = function CgangularGenerator(args, options /*, config*/ ) {
  yeoman.generators.Base.apply(this, arguments);

  this.argument('appname', {
    type: String,
    required: false
  });
  this.appname = this.appname || path.basename(process.cwd());
  this.appname = this._.chain(this.appname).humanize().slugify().camelize().value();

  this.origAssets = path.dirname(cgUtils.pkg().main);

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
    default: this.origAssets
  }];

  this.prompt(prompts, function(props) {
    this.appname = props.appname;
    this.assets = props.assets;

    cb();
  }.bind(this));
};

CgangularGenerator.prototype.moveAssets = function moveAssets() {

  var files, src, dest;
  if (this.origAssets !== this.assets) {
    src = path.join(this.destinationRoot(), this.origAssets);
    dest = path.join(this.destinationRoot(), this.assets);
    mkdirp.sync(dest);
    files = fs.readdirSync(path.join(this.sourceRoot(), 'assets/'))
      .concat('bower_components', 'directive', 'files', 'partial', 'service');
    this._.each(files, function(n) {
      try {
        fs.renameSync(path.join(src, n), path.join(dest, n));
        this.log.writeln(chalk.green('     move') + ' %s/%s to %s/%s', this.origAssets, n, this.assets, n);
      } catch (e) {

      }
    }, this);
    fs.rmdir(src, function() {});
  }
};

CgangularGenerator.prototype.app = function app() {

  this.directory('skeleton/', '.');
  this.directory('assets/', this.assets);
  if (this.assets !== '.') {
    this.write('index.html', this._.template('<script>\nlocation.href = \'<%= assets %>/\';\n</script>\n', this));
  }
};
