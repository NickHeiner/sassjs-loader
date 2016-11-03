'use strict';

const test = require('ava'),
    path = require('path'),
    webpack = require('webpack'),
    q = require('q'),
    fs = require('fs'),
    tmp = require('tmp'),
    
    packageJson = require('../package'),
    pathToSassjsLoader = path.join(__dirname, '..', packageJson.main),
    pathToEntrySass = path.join(__dirname, 'fixtures', 'basic.scss');

test('Basic sass', function(t) {
    t.plan(1);

    return q.ninvoke(tmp, 'file')
        .then(function(filePath) {
            return q.nfcall(webpack, {
                entry: 'raw!' + pathToSassjsLoader + '!' + pathToEntrySass,
                output: {path: filePath} 
            });
        })
        .then(function(stats) {
            const expectedContents = fs.readFileSync(path.join(__dirname, 'expected', 'basic.css'), 'utf8');

            t.is(stats.toString(), expectedContents);
        }).catch(function(err) {
            t.fail(err);
        });
});
