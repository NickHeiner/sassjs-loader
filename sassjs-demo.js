var sassJs = require('sass.js');

sassJs.importer(function(request, done) {
    console.log(request);
    done();
});

sassJs.compile('@import "foo"', {inputPath: '/nested/directory/path'}, function(result) {
    console.log('compiled', result);
});