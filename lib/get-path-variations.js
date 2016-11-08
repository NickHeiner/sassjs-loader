'use strict';

var sassJs = require('sass.js'),
    path = require('path');

module.exports = getPathVariations;

function getPathVariations(filePath) {
    var pathVariations = sassJs.getPathVariations(path.basename(filePath));
    return pathVariations.map(function(pathVariation) {
        return path.join(path.dirname(filePath), pathVariation);
    });
}