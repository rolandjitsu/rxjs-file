#!/bin/bash
set -e


# Current script dir
SCRIPTS_DIR=$(cd "$(dirname "$0")" && pwd)

LIB_PATH="${PWD}"
LIB_NAME="${1}"
LIB_MAIN="index.js"

COMPILATION_DIR="${LIB_PATH}/out-tsc"
ES2015_OUTPUT_DIR="${COMPILATION_DIR}/lib-es2015"
ES5_OUTPUT_DIR="${COMPILATION_DIR}/lib-es5"

DIST_DIR="${LIB_PATH}/dist"
DIST_FILENAME="${DIST_DIR}/${LIB_NAME}"


function sanitize_path {
    FIXED_PATH=$(echo ${1} | sed "s#//*#/#g")
    NORMALIZED_PATH="`cd "${FIXED_PATH}"; pwd`"
    echo ${NORMALIZED_PATH}
}


# Build ES2015
printf "\nCompile TS files to ES2015 ..."
$(npm bin)/tsc -p ${LIB_PATH}/tsconfig.json
ES2015_EMIT_DIR=$(sanitize_path ${ES2015_OUTPUT_DIR})
ES2015_EMIT_FILE="${ES2015_EMIT_DIR}/${LIB_MAIN}"

# Rollup ES2015 FESM
printf "\n\nBuild ES5 bundle ..."
$(npm bin)/rollup -c ${LIB_PATH}/rollup.config.js -i "${ES2015_EMIT_FILE}" --output.file "${DIST_FILENAME}.js" --output.format es

# Copy type definition files to dist
printf "\nCopy declaration files to dist ..."
cd ${ES2015_EMIT_DIR}
find . -name \*.d.ts | cpio --quiet -pdm ${DIST_DIR}
cd ${LIB_PATH}

# Build ES5
printf "\n\nCompile TS files to ES5 ..."
$(npm bin)/tsc -p ${LIB_PATH}/tsconfig.es5.json
ES5_EMIT_DIR=$(sanitize_path ${ES5_OUTPUT_DIR})
ES5_EMIT_FILE="${ES5_EMIT_DIR}/${LIB_MAIN}"

# Rollup ES5 FESM, UMD
printf "\n\nBuild UMD bundle ..."
$(npm bin)/rollup -c ${LIB_PATH}/rollup.config.js\
	-i ${ES5_EMIT_FILE}\
	--output.file "${DIST_FILENAME}.umd.js"\
	--output.format umd

printf "\nBuild minified UMD bundle ..."
$(npm bin)/rollup -c ${LIB_PATH}/rollup.config.js\
	-i ${ES5_EMIT_FILE}\
	--output.file "${DIST_FILENAME}.umd.min.js"\
	--output.format umd\
	--environment UGLIFY

printf "\nBuild ES5 bundle ..."
$(npm bin)/rollup -c ${LIB_PATH}/rollup.config.js\
	-i ${ES5_EMIT_FILE}\
	--output.file "${DIST_FILENAME}.es5.js"\
	--output.format es

printf "\n"
