'use strict';

var sassJs = require('sass.js'),
    q = require('q'),
    _ = require('lodash'),
    path = require('path'),
    fs = require('fs'),

    getNodeModuleDir = require('./lib/get-node-module-dir'),
    getResolvedPath = require('./lib/get-resolved-path'),
    getPathVariations = require('./lib/get-path-variations');

module.exports = function(content) {
    var callback = this.async();
    var self = this;

    sassJs.importer(function(request, done) {
        // Adapted from
        // eslint-disable-next-line max-len 
        // https://github.com/amiramw/grunt-contrib-sassjs/blob/a65f869df967a4e417c4260fd93239e4f0bc55ee/tasks/sass.js#L11
        if (request.path) {
            done();
        } else if (request.resolved) {
            var resolvedPath = getResolvedPath(request),
                pathVariations = getPathVariations(resolvedPath),

                ostensibleNodeModuleName = _.first(request.current.split(path.sep)),
                rootNodeModulesDir = getRootNodeModulesDir(ostensibleNodeModuleName);

            if (rootNodeModulesDir) {
                Array.prototype.push.apply(
                    pathVariations,
                    getPathVariations(path.join(rootNodeModulesDir, request.current))
                );
            }

            q.all(_.map(pathVariations, function(pathVariation) {
                return q.nfcall(fs.readFile, pathVariation, 'utf-8')
                    .then(function(fileContents) {
                        self.addDependency(pathVariation);
                        return {
                            path: pathVariation,
                            content: fileContents
                        };
                    })
                    .catch(function(err) {
                        /**
                         * ENOENT happens when the file does not exist. That is expected,
                         * because we only expect one of the many path variations to exist.
                         * EISDIR happens when a path variation is also the name of a directory.
                         * This also does not need to be a problem if there's a different path
                         * variation is that is a valid file name.
                         */
                        if (err.code === 'ENOENT' || err.code === 'EISDIR') {
                            return null;
                        }
                        throw err;
                    });
            })).then(function(files) {
                done(_(files).compact().first());
            }).catch(function(err) {
                done({error: JSON.stringify(err)});
            });
        } else {
            done();
        }
    });

    sassJs.compile(content, {inputPath: this.resourcePath}, function(result) {
        if (!result.status) {
            callback(null, result.text);
        } else {
            callback(new Error(result.formatted));
        }
    });
};

function getRootNodeModulesDir(name) {
    try {
        return getNodeModuleDir(require.resolve(name));
    } catch (e) {
        if (e.code === 'MODULE_NOT_FOUND') {
            return null;
        }
        throw e;
    }
}