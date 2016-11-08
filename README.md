# sassjs-loader [![Build Status](https://travis-ci.org/NickHeiner/sassjs-loader.svg?branch=master)](https://travis-ci.org/NickHeiner/sassjs-loader)

A webpack loader for [sass.js](https://www.npmjs.com/package/sass.js).

## Why would I want to use this?
Honestly, you probably don't, and should use [sass-loader](https://github.com/jtangelder/sass-loader) instead. This is only good for people who can't use [node-sass](https://www.npmjs.com/package/node-sass). Perhaps your corporate firewall blocks the node-sass executable binary, or perhaps it won't run on your system. 

## Installation

```
$ npm install --save-dev sassjs-loader webpack sass.js
```

It's expected that you'll install the right versions of `webpack` and `sass.js`. Look in the `devDependencies` in [`package.json`](./package.json) to see what versions this tool was built with.

For Node.js version compatibility, check [`.travis.yml`](./.travis.yml#L2).

## Usage

This is a standard Webpack loader, so you can use it the same way you'd use any other loader as described in the [Webpack documentation](https://webpack.github.io/docs/using-loaders.html).

## Developing

PRs welcome! 

`npm install` and `npm test` work the standard way.

Please be mindful of maintaining the Node.js version compatibility specified in [`.travis.yml`](./.travis.yml#L2). PRs will not be accepted if Travis tests are not passing.
