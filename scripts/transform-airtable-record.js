/* eslint-disable */

// Strips http(s) to use // and let the client determine the protocol
const removeProtocol = (url) => {
  return url?.replace(/^https?:\/\//, '//')
}
  
// strip url of all protocol details and remove trailing slashes
const beautifyUrl = (url) => {
return url?.replace(/^https?:\/\//, '').replace(/\/$/, '')
}
// This function transforms the raw record data that was filled into the Airtable database into the format
// needed by the UI. A lot of the logic was copied from the Airtable utomation that would do this transformation
// and populate the record.json field.
// The target schema and return value of this should adhere to: https://github.com/ipfs-shipyard/nuxt-module-ecosystem-directory/blob/main/content/data/project-schema.json
// This is intended to replace and eliminate the Airtable transformation
exports.transformAirtableRecord = (record, { iconFileName }) => {
const socialMediaPlatforms = ["Github", "Twitter", "Linkedin", "Facebook", "Discord", "Instagram"];

// These fields should be grabbed for tags
const tagFields = ['Top-level Category', 'Software Type', 'Storage Type', 'Tooling Used', 'Pipleline'];

// Start with the base object
const transformed = {
    display: true,
    since: record.Since,
    icon: iconFileName || '',
    name: record['Project Name'] || '',
    org: record['Company Name'] || '',
    description: record['Short Description'] || '',
    website: record['Website(s)'] || '',
    social: [],
    taxonomy: [
    { category: "finance", subcategories: [] },
    { category: "media-and-entertainment", subcategories: [] },
    { category: "tooling-and-productivity", subcategories: [] },
    { category: "storage-and-cloud-services", subcategories: [] },
    { category: "education-science-public-goods", subcategories: [] }
    ],
    tags: []
};

// Add Github if provided
if (record['Repo(s)']) {
    transformed.social.push({ github: record['Repo(s)'] });
}

// Extract the tag fields
for (const tagField of tagFields) {
    if (record[tagField]) {
    const tags = record[tagField]
        .map(tag => tag.toLowerCase().trim().replace(/[\s]+/g, '-')) // Convert to kebab-case
        .filter(tag => tag !== ""); // Remove empty tags
    transformed.tags.push(...tags);
    }
}

return transformed;
};



function getProjectNameSlug(name) {
console.log("Name before calling getProjectNameSlug: ", name);
if (!name || typeof name !== 'string') {
    console.error('Invalid project name');
    return;
}

return name
    .toLowerCase()
    .replace(/[^a-zA-Z0-9\s\.]/gi, '')
    .replace(/[\s\.]+/g, '-')
}

exports.getProjectNameSlug = getProjectNameSlug
