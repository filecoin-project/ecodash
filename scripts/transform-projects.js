/* eslint-disable */
/*
//  This script is used to transform the project json data structure from the legacy v1 format to the new v2 format
//  This script is intended to be run from the root of the repo
//  Usage (node 16): `node scripts/transform-projects.js`
//
*/

'use strict';

const fs = require('fs');
const path = require('path');

// transformation function to new data structure
function transformObject(original) {
  const socialMediaPlatforms = ["Github", "Twitter", "Linkedin", "Facebook", "Discord", "Instagram"];

  const transformed = {
    display: original.display || false,
    since: (original.sortNumbers && original.sortNumbers.length > 0) ? original.sortNumbers[0].since : null,
    icon: (original.logo && original.logo.icon) ? original.logo.icon : null,
    name: original.name || '',
    org: (original.org && original.org.length > 0) ? original.org[0] : '',
    description: (original.description && original.description.short) ? original.description.short : '',
    website: (original.primaryCta && original.primaryCta.url) ? original.primaryCta.url.toLowerCase() : '',
    social: [],
    taxonomy: [
      { category: "finance", subcategories: [] },
      { category: "media-and-entertainment", subcategories: [] },
      { category: "tooling-and-productivity", subcategories: [] },
      { category: "storage-and-cloud-services", subcategories: [] },
      { category: "education-science-and-public-goods", subcategories: [] }
    ],
    tags: []
  };

  if (original.links) {
    for (const linkObject of original.links) {
      let platform;
      switch (linkObject.label.toLowerCase()) {
        case 'repo':
          platform = 'Github';
          break;
        case 'website':
        case 'docs':
          platform = null; // skip docs link
          break;
        default:
          platform = linkObject.label;
      }

      if (platform && socialMediaPlatforms.includes(platform) && linkObject.links) {
        for (const link of linkObject.links) {
          let obj = {};
          if (link.url && link.url.trim() !== "") {
            obj[platform.toLowerCase()] = link.url.toLowerCase();
            transformed.social.push(obj);
          }
        }
      }
    }
  }

  if (original.taxonomies) {
    for (const tax of original.taxonomies) {
      if (tax.tags) {
        transformed.tags.push(...tax.tags.filter(tag => tag !== "").map(tag => tag.toLowerCase().replace(/-/g, ' ')));
      }
    }
  }

  return transformed;
}

// function to perform the file reads and overwrites
function convertFilesInDirectory(dirPath) {
  console.log(`Reading directory: ${dirPath}`);
  
  const files = fs.readdirSync(dirPath);

  console.log(`Found ${files.length} files/directories`);

  files.forEach(file => {
    if (path.extname(file) === '.json') {
      console.log(`Processing file: ${file}`);

      const filePath = path.join(dirPath, file);
      const original = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      const transformed = transformObject(original);

      fs.writeFileSync(filePath, JSON.stringify(transformed, null, 2) + "\n");

      console.log(`Successfully processed file: ${file}`);
    }
  });
}

// hardcode paths
const projectDirectory = path.join(__dirname, '..', 'content', 'projects');

console.log(`Script directory: ${__dirname}`);
console.log(`Project directory: ${projectDirectory}`);

convertFilesInDirectory(projectDirectory);
