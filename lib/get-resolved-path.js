'use strict';

var process = require('process'),
    path = require('path');

module.exports = getResolvedPath;

function getResolvedPath(request) {
    if (process.platform === 'win32') {
        return path.resolve(path.dirname(request.previous), request.current);
    }

    return request.resolved;
}