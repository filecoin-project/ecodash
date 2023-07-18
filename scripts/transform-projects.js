const fs = require('fs');
const path = require('path');

function convertObject(original) {
  const socialMediaPlatforms = ["Github", "Twitter", "Linkedin", "Facebook", "Discord", "Instagram"];

  const transformed = {
    display: original.display || false,
    since: (original.sortNumbers && original.sortNumbers.length > 0) ? original.sortNumbers[0].since : null,
    icon: (original.logo && original.logo.icon) ? original.logo.icon : null,
    name: original.name || '',
    org: original.org || [],
    description: (original.description && original.description.short) ? original.description.short : '',
    website: (original.primaryCta && original.primaryCta.url) ? original.primaryCta.url : '',
    social: [],
    taxonomy: [
      { category: "finance", subcategories: [] },
      { category: "media-and-entertainment", subcategories: [] },
      { category: "tooling-and-productivity", subcategories: ["developer-tools-and-other"] },
      { category: "storage-and-cloud-services", subcategories: [] },
      { category: "education-science-public-goods", subcategories: [] }
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
          platform = null; // we don't want to add these to social
          break;
        default:
          platform = linkObject.label;
      }

      if (platform && socialMediaPlatforms.includes(platform) && linkObject.links) {
        for (const link of linkObject.links) {
          let obj = {};
          obj[platform.toLowerCase()] = link.url;
          transformed.social.push(obj);
        }
      }
    }
  }

  if (original.taxonomies) {
    for (const tax of original.taxonomies) {
      if (tax.tags) {
        transformed.tags.push(...tax.tags.filter(tag => tag !== ""));
      }
    }
  }

  return transformed;
}

function convertFilesInDirectory(dirPath) {
  console.log(`Reading directory: ${dirPath}`);
  
  const files = fs.readdirSync(dirPath);

  console.log(`Found ${files.length} files/directories`);

  files.forEach(file => {
    if (path.extname(file) === '.json') {
      console.log(`Processing file: ${file}`);

      const filePath = path.join(dirPath, file);
      const original = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      const transformed = convertObject(original);

      fs.writeFileSync(filePath, JSON.stringify(transformed, null, 2) + "\n");

      console.log(`Successfully processed file: ${file}`);
    }
  });
}

const projectDirectory = path.join(__dirname, '..', 'content', 'projects');

console.log(`Script directory: ${__dirname}`);
console.log(`Project directory: ${projectDirectory}`);

convertFilesInDirectory(projectDirectory);
