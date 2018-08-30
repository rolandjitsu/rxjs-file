const camelCase = require('camelcase');
const commonjs = require('rollup-plugin-commonjs');
const resolve = require('rollup-plugin-node-resolve');
const sourcemaps = require('rollup-plugin-sourcemaps');
const {uglify} = require('rollup-plugin-uglify');

const name = require('./package.json').name;

const plugins = [
    resolve(),
    commonjs(),
    sourcemaps()
];

if (process.env.UGLIFY) {
    plugins.push(...[
        uglify()
    ]);
}

export default {
    plugins,
    output: {
        name: camelCase(name),
        // The key here is library name,and the value is the the name of the global variable name the window object.
        // See https://github.com/rollup/rollup/wiki/JavaScript-API#globals for more.
        globals: {
            // RxJS
            // https://github.com/ReactiveX/rxjs#cdn
            'rxjs': 'rxjs',
            'rxjs/operators': 'rxjs.operators',
            // TS
            'tslib': 'tslib'
        },
        sourcemap: true
    },
    // List of dependencies
    // See https://github.com/rollup/rollup/wiki/JavaScript-API#external for more.
    external: [
        // RxJS
        'rxjs',
        'rxjs/operators',
        // TS
        'tslib'
    ]
};
