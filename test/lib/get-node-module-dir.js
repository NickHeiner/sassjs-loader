'use strict';

var test = require('ava'),
    path = require('path'),
    getNodeModuleDir = require('../../lib/get-node-module-dir');

test('getNodeModuleDir', function(t) {
    t.plan(2);

    t.is(
        getNodeModuleDir(path.join('path', 'to', 'node_modules', 'lodash', 'lodash.js')),
        path.join('path', 'to', 'node_modules')
    );

    t.is(
        getNodeModuleDir('/Users/nth/dev/sassjs-loader/node_modules/bootstrap-sass/assets/javascripts/bootstrap.js'),
        '/Users/nth/dev/sassjs-loader/node_modules'
    );
});
