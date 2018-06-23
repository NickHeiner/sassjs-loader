'use strict';

var test = require('ava'),
  path = require('path'),
  readFile = require('../../lib/read-file');

test.cb('readFile existing file', function (t) {
  t.plan(1);

  readFile(path.join(__dirname, '..', 'fixtures', '_imported.scss'))
    .then(function (fileContent) {
      if (fileContent === '$imported: 10px;') {
        t.pass();
      }
      t.end();
    });
});

test.cb('readFile nonexisting file', function(t) {
  t.plan(1);

  readFile(path.join(__dirname, 'bogus', 'path'))
    .catch(function (error) {
      if (error.code === 'ENOENT') {
        t.pass();
      }
      t.end();
    });
})

test.cb('readFile reading folder', function(t) {
  t.plan(1);

  readFile(path.join(__dirname, '..', 'fixtures', 'dir'))
    .catch(function (error) {
      if (error.code === 'EISDIR') {
        t.pass();
      }
      t.end();
    });
})