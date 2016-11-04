'use strict';

var test = require('ava'),
    assertCssEqual = require('./utils/assert-css-equal');

test('Basic sass', function(t) {
    t.plan(1);

    return assertCssEqual(t, 'basic');    
});

test('Partial import', function(t) {
    t.plan(1);

    return assertCssEqual(t, 'import');    
});

test('Full file name import', function(t) {
    t.plan(1);

    return assertCssEqual(t, 'import', 'import-full-name');    
});

test('Import with .sass extension', function(t) {
    t.plan(1);

    return assertCssEqual(t, 'import', 'import-sass');    
});
