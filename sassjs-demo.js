var sassJs = require('sass.js'),
    path = require('path');

sassJs.importer(function(request, done) {
    console.log(request);
    done();
});

sassJs.compile(
    '@import "posix"', 
    {
        inputPath: path.posix.join('nested', 'directory', 'file.scss')
    }, function() {});

sassJs.compile(
    '@import "win32"', 
    {
        inputPath: path.win32.join('nested', 'directory', 'file.scss')
    }, function() {});