'use strict';

var sassJs = require('sass.js');

module.exports = function(content) {
    var callback = this.async();
    sassJs.compile(content, function(result) {
        if (!result.status) {
            callback(null, result.text);
        } else {
            callback(result);
        }
    });
};
