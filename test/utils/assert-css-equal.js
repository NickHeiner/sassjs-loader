'use strict';

var cssParse = require('css-parse'),
    traverse = require('traverse'),
    qFs = require('q-io/fs'),

    path = require('path'),
    packageJson = require('../../package'),
    pathToSassjsLoader = path.join(__dirname, '..', '..', packageJson.main),

    webpack = require('webpack'),
    q = require('q'),
    tmp = require('tmp'),
    _ = require('lodash');

module.exports = assertCssEqual;
module.exports.assertCssEqualFile = assertCssEqualFile;

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
    return getExpectationPathNoExt(fileName) + '.css';
}

function getExpectationPathNoExt(fileName) {
    return path.join(__dirname, '..', 'expected', fileName);
}

function assertCssEqual(t, expectedFileName, rawFixtureName) {
    var fixtureName = rawFixtureName || expectedFileName;
    return Promise.all([
        generateCss(t, fixtureName),
        qFs.read(getExpectationPath(expectedFileName))
    ]).then(function(css) {
        var actualCss = css[0],
            expectedCss = css[1];

        t.deepEqual(validateCssAst(t, actualCss), validateCssAst(t, expectedCss));
    });
}

function assertCssEqualFile(t, fixtureName, expectedFileName) {
    return Promise.all([
        generateCss(t, fixtureName),
        qFs.read(getExpectationPathNoExt(expectedFileName))
    ]).then(function(css) {
        var actualCss = css[0],
            expectedCss = css[1];

        t.deepEqual(actualCss, expectedCss);
    });
}

function generateCss(t, fileName) {
    return q.ninvoke(tmp, 'file')
        .spread(function(filePath) {
            return q.nfcall(webpack, {
                entry: 'raw!' + pathToSassjsLoader + '!' + getFixturePath(fileName),
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

            var actual = stats.toJson().modules[0].source;

            return actual.slice(18, -3); // hackity hack hack
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