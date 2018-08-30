# UID Generator

> A small package for generating cryptographically secure UIDs in the browser, safe for both cookie and URL usage.

[![Travis (.org) branch](https://img.shields.io/travis/rolandjitsu/uid/master.svg?style=flat-square)](https://github.com/rolandjitsu/uid)

This package is a mirror of [uid-safe](https://github.com/crypto-utils/uid-safe), but meant to be used in a browser env.
Additionally, it comes bundled with [TypeScript](https://www.typescriptlang.org) typings.


# Table of Contents

* [Installation](#installation)
* [Usage](#usage)
* [Browser Support](#browser-support)
* [Contribute](#contribute)


### Installation
You can install this package from [NPM](https://www.npmjs.com):
```bash
npm add crypto-uid
```

Or with [Yarn](https://yarnpkg.com/en):
```bash
yarn add crypto-uid
```

**NOTE**: For non ES6 users, you need to make sure that [tslib](https://github.com/Microsoft/tslib) is available.


### Usage
Generate a random UID:
```ts
import uid from 'crypto-uid';
const id = uid(6);
```


### Browser Support
-------------------
You can expect this lib to run wherever [Web Crypto API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API) is supported.


### Contribute
--------------
If you wish to contribute, please use the following guidelines:
* Use [Conventional Commits](https://conventionalcommits.org)
* Use `[ci skip]` in commit messages to skip a build
