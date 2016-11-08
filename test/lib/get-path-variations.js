'use strict';

var test = require('ava'),
    path = require('path'),
    getPathVariations = require('../../lib/get-path-variations');

test('posix path variations', function(t) {
    t.plan(1);

    t.deepEqual(
        getPathVariations(path.posix.join('path', 'to', 'imported'), path.posix),
        [
            'path/to/imported',
            'path/to/_imported',
            'path/to/_imported.scss',
            'path/to/_imported.sass',
            'path/to/_imported.css',
            'path/to/imported.scss',
            'path/to/imported.sass',
            'path/to/imported.css'
        ]
    );
});

test('win32 path variations', function(t) {
    t.plan(1);

    t.deepEqual(
        getPathVariations(path.win32.join('path', 'to', 'imported'), path.win32),
        [
            'path\\to\\imported',
            'path\\to\\_imported',
            'path\\to\\_imported.scss',
            'path\\to\\_imported.sass',
            'path\\to\\_imported.css',
            'path\\to\\imported.scss',
            'path\\to\\imported.sass',
            'path\\to\\imported.css'
        ]
    );
});
