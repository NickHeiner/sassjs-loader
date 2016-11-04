'use strict';

const test = require('ava'),
    assertCssEqual = require('./utils/assert-css-equal');

test('Basic sass', function(t) {
    t.plan(1);

    return assertCssEqual(t, 'basic');    
});

test('Imports', function(t) {
    t.plan(1);

    return assertCssEqual(t, 'import');    
});
