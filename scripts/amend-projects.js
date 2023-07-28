/* eslint-disable */
/*
//  This script that can be used to modify the contents of project json files in bulk
//  (Currently configured to fix a typo in a category name, but can be used to edit project data in any way)
//
//  This script is intended to be run from the root of the repo
//  Usage (node 16): `node scripts/inject-categories.js`
//
*/

'use strict';

const fs = require('fs');
const path = require('path');
const util = require('util');

const readdir = util.promisify(fs.readdir);
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

const directoryPath = path.join(__dirname, '../content/projects');

readdir(directoryPath)
  .then(files => {
    files.forEach(file => {
      if (path.extname(file) === '.json') {
        const filePath = path.join(directoryPath, file);
        readFile(filePath, 'utf8')
          .then(data => {
            const jsonData = JSON.parse(data);
            let hasChanged = false;
            jsonData.taxonomy = jsonData.taxonomy.map(taxonomyItem => {
              // Fix typo in category name (specific use case, can be altered for other use cases)
              if (taxonomyItem.category === 'education-science-and-public-goods') {
                taxonomyItem.category = 'education-science-and-public-goods';
                hasChanged = true;
              }
              return taxonomyItem;
            });
            if (hasChanged) {
              console.log(`Updated project: ${jsonData.name}`);

              return writeFile(filePath, JSON.stringify(jsonData, null, 2) + '\n', 'utf8');
            }
          })
          .catch(err => console.log(err));
      }
    });
  })
  .catch(err => console.log(`Error reading directory: ${err}`));
