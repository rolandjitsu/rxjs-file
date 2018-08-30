# RxJS File

> A small package with a couple of [File](https://developer.mozilla.org/en-US/docs/Web/API/File) utils for [RxJS](https://rxjs-dev.firebaseapp.com/).

[![Travis (.org) branch](https://img.shields.io/travis/rolandjitsu/rxjs-file/master.svg?style=flat-square)](https://github.com/rolandjitsu/rxjs-file)


# Table of Contents

* [Installation](#installation)
* [Usage](#usage)
* [Contribute](#contribute)


### Installation
--------------
You can install this package from [NPM](https://www.npmjs.com):
```bash
npm add rxjs rxjs-file
```

Or with [Yarn](https://yarnpkg.com/en):
```bash
yarn add rxjs rxjs-file
```

**NOTE**: You need to make sure that [tslib](https://github.com/Microsoft/tslib) is available as well (due to async/await).


### Usage
---------
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


### Contribute
--------------
If you wish to contribute, please use the following guidelines:
* Use [Conventional Commits](https://conventionalcommits.org)
* Use `[ci skip]` in commit messages to skip a build
