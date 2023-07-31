#!/bin/bash
set -e

## Perform schema validation with AJV
for file in $(git diff --name-only --diff-filter=AM $GITHUB_BEFORE..$GITHUB_AFTER | grep "content/projects/.*\.json"); do
  npx ajv-cli validate -s scripts/schema-constraints.json -d "$file" || exit 1
done

## Further validate whether subcategories are used correctly and adhere to taxonomy definitions
node scripts/check-taxonomies.js || exit 1
