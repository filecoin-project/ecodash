/* eslint-disable */
/*
//  This script is used to check whether subcategories are correctly nested within categories and match specific definitions from taxonomy.json
//
//  This script is intended to be run from the root of the repo
//  Usage (node 16): `node scripts/check-taxonomies.js`
//
*/

'use strict';

const fs = require('fs');
const path = require('path');

// Get the taxonomy data
const taxonomyJson = fs.readFileSync('./content/data/taxonomy.json', 'utf8');
const taxonomy = JSON.parse(taxonomyJson);
const taxonomySubcategories = {};

// Prepare a mapping of categories to subcategories
taxonomy.categories.forEach(cat => {
  taxonomySubcategories[cat.slug] = cat.subcategories.map(subcat => subcat.slug);
});

// Read all project files
const projectFiles = fs.readdirSync('./content/projects/');
let errorOccurred = false;

projectFiles.forEach(file => {
  // Skip non-json files
  if (path.extname(file) !== '.json') return;

  const projectJson = fs.readFileSync(`./content/projects/${file}`, 'utf8');
  const project = JSON.parse(projectJson);
  let subcategoryCount = 0;

  project.taxonomy.forEach(tax => {
    subcategoryCount += tax.subcategories.length;

    tax.subcategories.forEach(subcat => {
      if (!taxonomySubcategories[tax.category].includes(subcat)) {
        console.error(`🚫 Subcategory issue: Invalid subcategory ${subcat} for category ${tax.category} in file ${file}, must be one of: ${taxonomySubcategories[tax.category].join(', ')}`);
        errorOccurred = true;
      }
    });
  });

  if (subcategoryCount > 2) {
    console.error(`🚫 Subcategory issue: Invalid number of subcategories in file ${file}, you canot use more than two subcategories.`);
    errorOccurred = true;
  }
});

if (errorOccurred) {
  console.error('🚫 Error: Invalid taxonomy data found');
  process.exit(1);
} else {
  console.log('✅ Success: All project files have valid subcategories!');
}
