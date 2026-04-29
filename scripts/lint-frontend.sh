#!/bin/sh
# Receives git-relative paths (frontend/src/...) from lint-staged.
# Strips the 'frontend/' prefix and runs eslint from within frontend/.
set -e
files=""
for f in "$@"; do
  files="$files ${f#frontend/}"
done
# shellcheck disable=SC2086
cd frontend && ./node_modules/.bin/eslint --fix $files
