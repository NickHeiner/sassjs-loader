'use strict';

const sassJs = require('sass.js');

module.exports = function(content) {
    const callback = this.async();
    sassJs.compile(content, function(result) {
        if (!result.status) {
            callback(null, result.text);
        } else {
            callback(result);
        }
    });
};
