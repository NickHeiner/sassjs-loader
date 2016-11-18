'use strict';

var test = require('ava'),
    path = require('path'),
    getResolvedPath = require('../../lib/get-resolved-path');

test('posix path', function(t) {
    t.plan(1);

    t.is(getResolvedPath({
        previous: path.posix.join('path', 'to', 'importing-file.scss'),
        current: path.posix.join('dir', 'current.scss')
    }, path.posix), path.posix.resolve('path', 'to', 'dir', 'current.scss'));
});

test('win32 path', function(t) {
    t.plan(1);

    t.is(getResolvedPath({
        previous: path.win32.join('path', 'to', 'importing-file.scss'),
        current: path.win32.join('dir', 'current.scss')
    }, path.win32), path.win32.resolve('path', 'to', 'dir', 'current.scss'));
});
