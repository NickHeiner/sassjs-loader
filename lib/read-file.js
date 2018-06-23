'use strict';

var fs = require('fs'),
  q = require('q');

module.exports = readFile;

function readFile(filePath) {
  return q.Promise(function (resolve, reject) {
    fs.readFile(filePath, 'utf-8', function (error, fileContent) {
      if (error) {
        return reject(error);
      }

      return resolve(fileContent);
    })
  });
}