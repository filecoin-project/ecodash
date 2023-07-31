#!/bin/bash
set -e

for file in $(git diff --name-only --diff-filter=AM $GITHUB_BEFORE..$GITHUB_AFTER | grep "content/projects/.*\.json"); do
  npx ajv-cli validate -s scripts/schema-constraints.json -d "$file" || exit 1
done