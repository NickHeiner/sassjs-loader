'use strict';

var path = require('path');

module.exports = getResolvedPath;

function getResolvedPath(request, rawPath) {
    var pathToUse = rawPath || path;
    return pathToUse.resolve(pathToUse.dirname(request.previous), request.current);
}