'use strict';

var sassJs = require('sass.js'),
    fs = require('fs'),
    path = require('path');

module.exports = function(content) {
    var callback = this.async();

    sassJs.importer(function(request, done) {
        console.log('importer', request);
        var pathToRead = path.join(__dirname, 'test', 'fixtures', '_imported.scss');
        done({
            path: pathToRead,
            content: fs.readFileSync(pathToRead, 'utf8')
        });
    });

    sassJs.compile(content, {inputPath: this.resourcePath}, function(result) {
        if (!result.status) {
            callback(null, result.text);
        } else {
            callback(result);
        }
    });
};
