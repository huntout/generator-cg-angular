'use strict';

var util = require('util');
var yeoman = require('yeoman-generator');
var path = require('path');
var cgUtils = require('../utils.js');
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

PartialGenerator.prototype.askForRoute = function askForRoute() {
  var cb = this.async();

  var paramsFromRoute = function paramsFromRoute(route) {
    var a = _.words(route, '/');
    a = _.filter(a, function(n) {
      return _.startsWith(n, ':');
    });
    a = _.map(a, function(n) {
      return _.strRight(n, ':');
    });
    return a;
  };

  var prompts = [{
    name: 'route',
    message: 'Enter your route (i.e. /mypartial/:id).  If you don\'t want a route added for you, leave this empty.'
  }];

  this.prompt(prompts, function(props) {
    this.route = props.route;
    this.routeParams = paramsFromRoute(props.route);

    cb();
  }.bind(this));
};

PartialGenerator.prototype.askForRouteMore = function askForRouteMore() {
  var cb = this.async();
  var route = this.route;
  var routeParams = this.routeParams;

  var prompts = [{
    name: 'routeName',
    message: 'Enter your route name (i.e. home.mypartial).',
    when: function() {
      return !_.isEmpty(route);
    }
  }, {
    type: 'checkbox',
    name: 'routeDependencies',
    message: 'Select your route dependencies.',
    choices: routeParams,
    when: function() {
      return routeParams.length > 0;
    }
  }];

  this.prompt(prompts, function(props) {
    this.routeName = props.routeName;
    this.routeDependencies = props.routeDependencies;

    cb();
  }.bind(this));
};

PartialGenerator.prototype.files = function files() {

  var filename = 'partial/' + this.name + '/' + this.name;

  this.ctrlname = _.camelize(_.classify(this.name)) + 'Ctrl';

  this.template('partial.js', filename + '.js');
  this.template('partial.html', filename + '.html');
  this.template('partial.less', filename + '.less');
  this.template('spec.js', filename + '-spec.js');

  cgUtils.addToFile('index.html', '<script class="app" src="' + filename + '.js"></script>', cgUtils.PARTIAL_JS_MARKER, '  ', this);
  cgUtils.addToFile('css/app.less', '@import "../' + filename + '.less";', cgUtils.PARTIAL_LESS_MARKER, '', this);

  if (!_.isEmpty(this.route)) {

    cgUtils.updateFile('js/setup.js', function(src, self) {

      var route = _.template('  .when(\'<%= route %>\', \'<%= routeName %>\')', self);

      var routeMarker = [
        '$routeSegmentProvider',
        '  ' + cgUtils.ROUTE_MARKER,
        '  ;',
        ''
      ].join('\n');

      var routeSegment = function routeSegment() {
        self = _.clone(self);

        self.routeName = _.words(self.routeName, '.');

        self.segment = self.routeName.pop();

        self.within = _.map(self.routeName, function(n) {
          return '.within(\'' + n + '\')';
        }).join('');

        self.dependencies = _.map(self.routeDependencies, function(n) {
          return '\'' + n + '\'';
        }).join(', ');

        var a = ['    templateUrl: \'partial/<%= name %>/<%= name %>.html\''];
        if (!_.isEmpty(self.dependencies)) {
          a.push('    dependencies: [<%= dependencies %>]');
        }

        return _.template([
          '$routeSegmentProvider<%= within %>.segment(\'<%= segment %>\', {',
          a.join(',\n'),
          '  });',
          ''
        ].join('\n'), self);
      };

      if (src.indexOf(cgUtils.ROUTE_MARKER) < 0) {
        src = cgUtils.addToString(src, routeMarker, cgUtils.ROUTE_SEGMENT_MARKER, '  ');
      }
      src = cgUtils.addToString(src, route, cgUtils.ROUTE_MARKER, '  ');
      src = cgUtils.addToString(src, routeSegment(), cgUtils.ROUTE_SEGMENT_MARKER, '  ');

      return src;

    }, this);
  }
};
