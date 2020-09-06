# RxJS File

> A small package with a couple of [File](https://developer.mozilla.org/en-US/docs/Web/API/File) utils for [RxJS](https://rxjs-dev.firebaseapp.com/).

[![npm](https://img.shields.io/npm/v/rxjs-file.svg?style=flat-square)](https://www.npmjs.com/package/rxjs-file)
[![GitHub Workflow Status](https://img.shields.io/github/workflow/status/rolandjitsu/rxjs-file/Test?label=tests&style=flat-square)](https://github.com/rolandjitsu/rxjs-file/actions?query=workflow%3ATest)
[![Coveralls github branch](https://img.shields.io/coveralls/github/rolandjitsu/rxjs-file/master?style=flat-square)](https://coveralls.io/github/rolandjitsu/rxjs-file?branch=master)


# Table of Contents

* [Installation](#installation)
* [Usage](#usage)
* [Contribute](#contribute)


### Installation
----------------
You can install this package from [NPM](https://www.npmjs.com):
```bash
npm add rxjs rxjs-file
```

Or with [Yarn](https://yarnpkg.com/en):
```bash
yarn add rxjs rxjs-file
```

#### CDN
For CDN, you can use [unpkg](https://unpkg.com):

[https://unpkg.com/rxjs-file/dist/bundles/rxjs-file.umd.min.js](https://unpkg.com/rxjs-file/dist/bundles/rxjs-file.umd.min.js)

The global namespace for rxjs-file is `rxjsFile`:
```js
const {toArrayBuffer} = rxjsFile;

toArrayBuffer(file)
    .subscribe(buffer => {
        // Do something with the buffer 
    });
```


### Usage
---------

#### ES6
Read a file as [ArrayBuffer](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer):
```ts
import {toArrayBuffer} from 'rxjs-file';

toArrayBuffer(file)
    .subscribe(buffer => {
        // Do something with the buffer 
    });
```

Read the file as ArrayBuffer in chunks:
```ts
import {toArrayBuffer} from 'rxjs-file';

toArrayBuffer(file, {chunkSize: 1000 /* bytes */})
    .subscribe(chunk => {
        // Do something with each chunk
    });
```

Read a file as text:
```ts
import {toString} from 'rxjs-file';

toString(file)
    .subscribe(str => {
        // Do something with the string
    });
```

#### CommonJS
Read a file as ArrayBuffer:
```ts
const {toArrayBuffer} = require('rxjs-file');

toArrayBuffer(file)
    .subscribe(buffer => {
        // Do something with the buffer 
    });
```

### Contribute
--------------
If you wish to contribute, please use the following guidelines:
* Use [Conventional Commits](https://conventionalcommits.org)
* Use `[ci skip]` in commit messages to skip a build
