#!/bin/bash
set -e

ICON_ERRORS=0
SCHEMA_ERRORS=0
TAXONOMY_ERRORS=0
FILE_NAME_ERRORS=0

# Perform schema validation with AJV
for file in $(git diff --name-only --diff-filter=AM HEAD^..HEAD | grep "content/projects/.*\.json"); do
  npx ajv-cli validate -s scripts/schema-constraints.json -d "$file" || SCHEMA_ERRORS=$((SCHEMA_ERRORS+1))
done

if [[ "$SCHEMA_ERRORS" -ne "0" ]]; then
  echo "🚫 $SCHEMA_ERRORS schema validation errors found"
  exit 1
fi

# Further validate whether subcategories are used correctly and adhere to taxonomy definitions
node scripts/check-taxonomies.js || TAXONOMY_ERRORS=$((TAXONOMY_ERRORS+1))

if [[ "$TAXONOMY_ERRORS" -ne "0" ]]; then
  echo "🚫 $TAXONOMY_ERRORS taxonomy errors found"
  exit 1
fi

# Further validate whether icons exist, are square and do not exceed 500px
node scripts/check-images.js || ICON_ERRORS=$((ICON_ERRORS+1))

if [[ "$ICON_ERRORS" -ne "0" ]]; then
  echo "🚫 $ICON_ERRORS icon errors found"
  exit 1
fi

# Check new file names for kebab-case
for file in $(git diff --name-only --diff-filter=A HEAD^..HEAD | grep "content/projects/.*\.json"); do
  base=$(basename "$file")
  if ! [[ $base =~ ^[a-z0-9\-]+\.json$ ]]; then
    echo "File name error: $base is not in kebab-case format"
    FILE_NAME_ERRORS=$((FILE_NAME_ERRORS+1))
  fi
done

if [[ "$FILE_NAME_ERRORS" -ne "0" ]]; then
  echo "🚫 $FILE_NAME_ERRORS json file names must be in kebab case"
  exit 1
fi
