/* eslint-disable */
/*
//  This script is used to make all the images in the projects directory follow a standard naming convention
//  This script is intended to be run from the root of the repo
//  Usage (node 16): `node standardize-images.js`
//
*/

const fs = require('fs');
const path = require('path');

const projectDir = path.resolve(__dirname, '../content/projects');
const imageDir = path.resolve(__dirname, '../static/images/projects');

let usedImages = [];

// Read all files in the project directory
fs.readdirSync(projectDir).forEach(file => {
  if (path.extname(file) === '.json') {
    const filePath = path.join(projectDir, file);
    let data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    // Get old image name
    const oldImageName = data.icon;
    const newImageName = `icon-${path.parse(file).name}${path.extname(oldImageName)}`;

    // Add new image name to the list of used images
    usedImages.push(newImageName);

    // Update image name in JSON
    data.icon = newImageName;

    // Write updated data back to the file
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    
    console.log(`Updated image name in ${file} from ${oldImageName} to ${newImageName}`);
    
    // Rename the actual image file
    fs.renameSync(path.join(imageDir, oldImageName), path.join(imageDir, newImageName));

    console.log(`Renamed image file from ${oldImageName} to ${newImageName}`);
  }
});

// Read all files in the image directory
let allImages = fs.readdirSync(imageDir);

// Find any images that aren't used
let unusedImages = allImages.filter(image => !usedImages.includes(image));

console.log("Unused images: ", unusedImages);
