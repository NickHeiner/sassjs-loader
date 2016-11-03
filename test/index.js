'use strict';

const test = require('ava'),
    path = require('path'),
    webpack = require('webpack'),
    q = require('q'),
    fs = require('fs'),
    tmp = require('tmp'),
    _ = require('lodash'),
    cssParse = require('css-parse'),
    
    packageJson = require('../package'),
    pathToSassjsLoader = path.join(__dirname, '..', packageJson.main),
    pathToEntrySass = path.join(__dirname, 'fixtures', 'basic.scss');

test('Basic sass', function(t) {
    t.plan(1);

    function validateCssAst(cssString) {
        try {
            return cssParse(cssString.replace('\\n', '\n'));
        } catch (e) {
            t.fail('Could not parse css: "' + cssString + '" because of error "' + e + '"');
        }
    }

    return q.ninvoke(tmp, 'dir')
        .then(function(filePath) {
            return q.nfcall(webpack, {
                entry: 'raw!' + pathToSassjsLoader + '!' + pathToEntrySass,
                output: {filename: path.basename(filePath), path: path.dirname(filePath)} 
            });
        })
        .then(function(stats) {
            if (stats.hasErrors()) {
                const err = new Error('Webpack compile error');
                err.compilationErrors = stats.compilation.errors;
                throw err;
            }

            if (stats.hasWarnings()) {
                const err = new Error('Webpack compile warning');
                err.compilationWarnings = stats.compilation.warnings;
                throw err;
            }

            const actual = stats.toJson().modules[0].source, 
                actualCss = actual.slice(18, -3), // hackity hack hack
                expectedCss = fs.readFileSync(path.join(__dirname, 'expected', 'basic.css'), 'utf8');

            console.log(JSON.stringify(validateCssAst(actualCss), null, 2));
            console.log(JSON.stringify(validateCssAst(expectedCss), null, 2));

            t.deepEqual(validateCssAst(actualCss), validateCssAst(expectedCss));
        }).catch(function(err) {
            const errorMessage = _([err, err.compilationErrors, err.compilationWarnings])
                .compact()
                .map(function(errPart) {
                    return errPart.toString() 
                })
                .join('\n');

            t.fail(errorMessage);
        });
});
