'use strict';

var sassJs = require('sass.js'),
    path = require('path');

module.exports = getPathVariations;

function getPathVariations(filePath, rawPath) {
    var pathToUse = rawPath || path, 
        pathVariations = sassJs.getPathVariations(pathToUse.basename(filePath));

    return pathVariations.map(function(pathVariation) {
        return pathToUse.join(pathToUse.dirname(filePath), pathVariation);
    });
}