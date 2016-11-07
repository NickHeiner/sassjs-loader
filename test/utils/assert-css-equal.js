'use strict';

var cssParse = require('css-parse'),
    traverse = require('traverse'),

    path = require('path'),
    packageJson = require('../../package'),
    pathToSassjsLoader = path.join(__dirname, '..', '..', packageJson.main),

    webpack = require('webpack'),
    q = require('q'),
    fs = require('fs'),
    tmp = require('tmp'),
    _ = require('lodash');

module.exports = assertCssEqual;

function validateCssAst(t, cssString) {
    try {
        return removePosition(cssParse(cssString.replace('\\n', '\n')));
    } catch (e) {
        t.fail('Could not parse css: "' + cssString + '" because of error "' + e + '"');
    }
}

function removePosition(cssAst) {
    return traverse(cssAst).map(function() {
        if (this.key === 'position') {
            this.remove(true);
        }
    });
}

function getFixturePath(fileName) {
    return path.join(__dirname, '..', 'fixtures', fileName + '.scss');
}

function getExpectationPath(fileName) {
    return path.join(__dirname, '..', 'expected', fileName + '.css');
}

function assertCssEqual(t, fileName, rawFixtureName) {
    var fixtureName = rawFixtureName || fileName;
    return q.ninvoke(tmp, 'dir')
        .then(function(filePath) {
            return q.nfcall(webpack, {
                entry: 'raw!' + pathToSassjsLoader + '!' + getFixturePath(fixtureName),
                output: {filename: path.basename(filePath), path: path.dirname(filePath)} 
            });
        })
        .then(function(stats) {
            var err;
            if (stats.hasErrors()) {
                err = new Error('Webpack compile error');
                err.compilationErrors = stats.compilation.errors;
                throw err;
            }

            if (stats.hasWarnings()) {
                err = new Error('Webpack compile warning');
                err.compilationWarnings = stats.compilation.warnings;
                throw err;
            }


            var actual = stats.toJson().modules[0].source, 
                actualCss = actual.slice(18, -3), // hackity hack hack
                expectedCss = fs.readFileSync(getExpectationPath(fileName), 'utf8');

            t.deepEqual(validateCssAst(t, actualCss), validateCssAst(t, expectedCss));
        }).catch(function(err) {
            var errorMessage = _([err, err.compilationErrors, err.compilationWarnings])
                .compact()
                .map(function(errPart) {
                    return errPart.toString() 
                })
                .join('\n');

            t.fail(errorMessage);
        });
}