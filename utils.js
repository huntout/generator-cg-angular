'use strict';

var path = require('path');
var fs = require('fs');
var chalk = require('chalk');

exports.updateFile = function(filename, action, generator) {
  try {
    var fullPath = path.resolve(filename);
    var relativePath = path.relative(process.cwd(), fullPath);
    var src = fs.readFileSync(fullPath, 'utf8');
    var out = action(src, generator);

    if (src === out) {
      generator.log.identical(relativePath);
    } else {
      fs.writeFileSync(fullPath, out);
      generator.log.writeln(chalk.green(' updating') + ' %s', relativePath);
    }

  } catch (e) {
    throw e;
  }
};

exports.addToFile = function(filename, lineToAdd, beforeMarker, spacing, generator) {
  exports.updateFile(filename, function(src) {
    return exports.addToString(src, lineToAdd, beforeMarker, spacing);
  }, generator);
};

exports.addToString = function(src, lineToAdd, beforeMarker, spacing) {
  var indexOfMarker = src.indexOf(beforeMarker);
  var allToAdd = lineToAdd + '\n' + spacing;
  var indexOfAdd = src.indexOf(allToAdd);

  if (indexOfAdd + allToAdd.length !== indexOfMarker) {
    src = src.slice(0, indexOfMarker) + allToAdd + src.slice(indexOfMarker);
  }

  return src;
};

exports.DIRECTIVE_LESS_MARKER = '/* Add Directive LESS Above */';
exports.DIRECTIVE_JS_MARKER = '<!-- Add New Directive JS Above -->';
exports.FILTER_JS_MARKER = '<!-- Add New Filter JS Above -->';
exports.SERVICE_JS_MARKER = '<!-- Add New Service JS Above -->';
exports.PARTIAL_LESS_MARKER = '/* Add Partial LESS Above */';
exports.PARTIAL_JS_MARKER = '<!-- Add New Partial JS Above -->';
exports.ROUTE_MARKER = '/* Add New Routes Above */';
exports.ROUTE_SEGMENT_MARKER = '/* Add New Route Segments Above */';
