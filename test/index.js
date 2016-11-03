'use strict';

const test = require('ava'),
    path = require('path'),
    webpack = require('webpack'),

    fs = require('fs'),
    
    packageJson = require('../package'),
    pathToSassjsLoader = path.join(__dirname, '..', packageJson.main),
    pathToEntrySass = path.join(__dirname, 'fixtures', 'index.scss');

test('Basic sass', function(t) {
    t.plan(1);
    webpack({
        entry: 'raw!' + pathToSassjsLoader + '!' + pathToEntrySass
    }, function(err, stats) {
        if (err) {
            t.fail(err);
        }

        const expectedContents = fs.readFileSync(__dirname, 'expected', 'basic.css');

        t.is(stats.toString(), expectedContents);
    });
});
