/* eslint-disable */
/*
//  This script is used to standardize the tag array within all the project json files
//  This script is intended to be run from the root of the repo
//  Usage (node 16): `node scripts/tag-standardization.js`
//
*/

'use strict';

const fs = require('fs');
const path = require('path');
const projectDirectory = path.join(__dirname, '..', 'content', 'projects');

fs.readdir(projectDirectory, (err, files) => {
  if (err) {
    console.error('Could not list the directory.', err);
    process.exit(1);
  } 

  files.forEach((file, index) => {
    // Continue to next file if this file is not a JSON file
    if (path.extname(file) !== '.json') return;

    const filePath = path.join(projectDirectory, file);
    fs.readFile(filePath, 'utf8', (err, fileContent) => {
      if (err) {
        console.error(`Error reading file ${filePath}`, err);
        return;
      }

      // Check if file is empty
      if (!fileContent.trim()) {
        console.error(`File ${filePath} is empty`);
        return;
      }

      let json;
      try {
        json = JSON.parse(fileContent);
      } catch(err) {
        console.error(`Error parsing JSON for file ${filePath}`, err);
        return;
      }

      // Content changes to tags
      json.tags = json.tags
        .filter(tag => !["other", "none"].includes(tag)) // remove other and none tags
        .map(tag => tag.replace(/[,\/\-&\(\)]/g, ' ')) // replace special characters
        .map(tag => tag.replace(/\s\s+/g, ' ')) // replace multiple spaces with one
        .map(tag => tag.trim()) // remove leading and trailing spaces
        .map(tag => tag.startsWith("storage apps") || tag.startsWith("storage-apps") ? "storage apps" : tag) // cut anything that follows "storage apps" or "storage-apps"
        .map(tag => tag.includes("token finance") || tag.includes("token-finance") ? "defi" : tag) // replace "token finance" or "token-finance" with "defi"
        .map(tag => tag === "web3 storage" ? "web3.storage" : tag) // replace "web3 storage" with "web3.storage"
        .map(tag => tag === "nft storage" ? "nft.storage" : tag); // replace "nft storage" with "nft.storage"

      // Write cleaned data back to the file
      fs.writeFile(filePath, JSON.stringify(json, null, 2) + "\n", 'utf8', (err) => {
        if (err) console.error(`Error writing file ${filePath}`, err);
      });
    });
  });
});
