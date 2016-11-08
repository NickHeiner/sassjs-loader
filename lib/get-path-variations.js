'use strict';

var sassJs = require('sass.js'),
    path = require('path');

module.exports = getPathVariations;

// It's a little funny to take the path module to use as an argument,
// but it's a way easier way to test this function in posix/win32 environments
// rather than actually setting up a Windows environment, or messing with Node
// globals to trick it into using using the win32 instead of posix path module.
//
// This function exists to work around https://github.com/medialize/sass.js/issues/69. 
function getPathVariations(filePath, rawPath) {
    var pathToUse = rawPath || path, 
        pathVariations = sassJs.getPathVariations(pathToUse.basename(filePath));

    return pathVariations.map(function(pathVariation) {
        return pathToUse.join(pathToUse.dirname(filePath), pathVariation);
    });
}