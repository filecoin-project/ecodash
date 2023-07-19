/* eslint-disable */
/*
//  This script is used to check for projects that do not have at least one subcategory, and are therefore excluded from the classification
//  This script is intended to be run from the root of the repo
//  Usage (node 16): `node scripts/missing-classification.js`
//
*/

'use strict';

const fs = require('fs');
const path = require('path');

const PROJECTS_DIR = path.join(__dirname, '..', 'content', 'projects');

// Function to check if a project has at least one subcategory.
const hasSubcategories = (project) => {
  return project.taxonomy.some(category => category.subcategories.length > 0);
};

// Function to handle each project file.
const handleFile = (file) => {
  const filePath = path.join(PROJECTS_DIR, file);
  if (path.extname(filePath) === '.json') {
    const data = fs.readFileSync(filePath);
    const project = JSON.parse(data);

    if (!hasSubcategories(project)) {
      console.log(`Project "${project.name}" does not have at least one subcategory.`);
    }
  }
};

// Read all files from the projects directory.
fs.readdir(PROJECTS_DIR, (err, files) => {
  if (err) {
    console.error(`Could not list the directory: ${err}`);
  } else {
    files.forEach(handleFile);
  }
});
