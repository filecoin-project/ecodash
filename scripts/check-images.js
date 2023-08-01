/* eslint-disable */
/*
//  This script is used to check if icons used by projects exist, are square, and don't exceed 500px in width (raster formats only)
//
//  This script is intended to be run from the root of the repo
//  Usage (node 16): `node scripts/check-images.js`
//
*/

'use strict';

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const glob = require('glob');

const projectFiles = glob.sync('content/projects/*.json');
const imageFolder = 'static/images/projects/';
let successCount = 0;

projectFiles.forEach(file => {
  const project = JSON.parse(fs.readFileSync(file));
  const imagePath = path.join(imageFolder, project.icon);

  if (!fs.existsSync(imagePath)) {
    console.error(`🚫 Image issue: Image file ${imagePath} does not exist for project ${file}`);
    process.exit(1);
  }

  sharp(imagePath)
    .metadata()
    .then(({ width, height, format }) => {
      if (width !== height) {
        console.error(`🚫 Image issue: Image file ${imagePath} is not a square for project ${file}`);
        process.exit(1);
      }

      if (['jpeg', 'png', 'gif'].includes(format) && width > 512) {
        console.error(`🚫 Image issue: Raster image file ${imagePath} is more than 500px wide for project ${file}`);
        process.exit(1);
      }

      successCount++;
      if (successCount === projectFiles.length) {
        console.log("✅ Success: All images are valid!");
      }
    })
    .catch(err => {
      console.error(`🚫 Image issue: An error occurred while processing image ${imagePath} for project ${file}: ${err}`);
      process.exit(1);
    });
});
