'use strict';

var path = require('path'),
    _ = require('lodash');

module.exports = getNodeModuleDir;

function getNodeModuleDir(filePath) {
    var splitPath = filePath.split(path.sep);
    return _.takeWhile(splitPath, function(pathPart, index) {
        return splitPath[index - 1] !== 'node_modules';
    }).join(path.sep);
}