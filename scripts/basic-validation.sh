#!/bin/bash
set -e

ERRORS=0
for file in $(git diff --name-only --diff-filter=AM ${GITHUB_BEFORE}..${GITHUB_AFTER} | grep "content/projects/.*.json"); do
  npx jsonlint -q "$file" || ERRORS=$((ERRORS+1))
done
if [[ "$ERRORS" -ne "0" ]]; then
  echo "$ERRORS errors found during JSON validation"
  exit 1
fi
