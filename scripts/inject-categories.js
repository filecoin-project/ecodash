/* eslint-disable */
/*
//  This script is used to inject subcsategories into projects in the repo, based on a list
//  This script is intended to be run from the root of the repo
//  Usage (node 16): `node inject-categories.js`
//
*/

const fs = require('fs');
const path = require('path');

// Hardcoded CSV content for the time being, should be replaced
const csvContent = [
  ["web3-cloud-drive.json", "enterprise-solutions"],
  ["data-cold-storage.json", "enterprise-solutions"],
  ["starboard-ventures.json", "network-explorers-and-reputation"],
  ["polyphene.json", "developer-tools-and-other"],
  ["legacy.json", "communication-and-social"],
  ["cloudslit.json", "data-retrieval"],
  ["filet.json", "leasing-and-staking"],
  ["icefiredb.json", "developer-tools-and-other"],
  ["filmine.json", "leasing-and-staking"],
  ["glif.json", "wallets-identity-and-authentication"],
  ["h2o-data.json", "data-curation-and-monetization"],
  ["origin-storage.json", "data-storage-and-management"],
  ["ken-labs.json", "developer-tools-and-other"],
  ["banyan.json", "enterprise-solutions"],
  ["lighthouse-storage.json", "data-storage-and-management"],
  ["zondax.json", "network-explorers-and-reputation"],
  ["venus-ipfs-force.json", "developer-tools-and-other"],
  ["valist.json", "developer-tools-and-other"],
  ["ownership-labs.json", "arts-and-collectibles"],
  ["digital-mob.json", "developer-tools-and-other"],
  ["filswan.json", "enterprise-solutions"],
  ["filedrive.json", "developer-tools-and-other"],
  ["huddle-01.json", "communication-and-social"],
  ["fleek.json", "publishing-and-news"],
  ["mona.json", "arts-and-collectibles"],
  ["sinso.json", "developer-tools-and-other"],
  ["opensea.json", "arts-and-collectibles"],
  ["numbers-protocol.json", "photo-and-video"],
  ["op-games.json", "gaming"],
  ["magic-eden.json", "arts-and-collectibles"],
  ["espa.json", "enterprise-solutions"],
  ["dlabs.json", "developer-tools-and-other"],
  ["ipfs.json", "data-storage-and-management"],
  ["doingud.json", "arts-and-collectibles"],
  ["blockscience.json", "education-and-science"],
  ["chingari.json", "photo-and-video"],
  ["coinfeeds.json", "infrastructure-and-other"],
  ["curio.json", "arts-and-collectibles"],
  ["chainsafe-files.json", "data-storage-and-management"],
  ["protofire.json", "developer-tools-and-other"],
  ["metamask.json", "wallets-identity-and-authentication"],
  ["ledger.json", "wallets-identity-and-authentication"],
  ["myel.json", "data-retrieval"],
  ["hedera-hts-demo.json", "developer-tools-and-other"],
  ["slate.json", "ai-productivity-and-utilities"],
  ["math-wallet.json", "wallets-identity-and-authentication"],
  ["vivid-labs.json", "photo-and-video"],
  ["starling.json", "publishing-and-news"],
  ["eternum.json", "data-storage-and-management"],
  ["pinata.json", "data-storage-and-management"],
  ["filscout.json", "network-explorers-and-reputation"],
  ["livepeer.json", "data-storage-and-management"],
  ["internet-archive.json", "governance-daos-and-public-goods"],
  ["estuary.json", "data-storage-and-management"],
  ["ocean-protocol.json", "data-curation-and-monetization"],
  ["atoms-org.json", "education-and-science"],
  ["infinitescroll.json", "developer-tools-and-other"],
  ["matrix-storage.json", "data-storage-and-management"],
  ["orbitdb.json", "developer-tools-and-other"],
  ["nethereum.json", "developer-tools-and-other"],
  ["boto.json", "ai-productivity-and-utilities"],
  ["filecoin-foundation.json", "governance-daos-and-public-goods"],
  ["nftbase.json", "data-storage-and-management"],
  ["easy-nft.json", "data-storage-and-management"],
  ["chainsafe.json", "infrastructure-and-other"],
  ["glif-wallet.json", "wallets-identity-and-authentication"],
  ["p2p-validator.json", "leasing-and-staking"],
  ["decrypt.json", "publishing-and-news"],
  ["cid-gravity.json", "data-storage-and-management"],
  ["chestr.json", "network-explorers-and-reputation"],
  ["ceramic-network-idx.json", "data-storage-and-management"],
  ["coinomi.json", "wallets-identity-and-authentication"],
  ["fission.json", "developer-tools-and-other"],
  ["jigstack.json", "infrastructure-and-other"],
  ["nucypher.json", "privacy-and-security"],
  ["metaverse-ai.json", "communication-and-social"],
  ["the-graph.json", "network-explorers-and-reputation"],
  ["mintgate.json", "arts-and-collectibles"],
  ["kanon.json", "arts-and-collectibles"],
  ["kotal.json", "developer-tools-and-other"],
  ["zora.json", "arts-and-collectibles"],
  ["iamtoken.json", "wallets-identity-and-authentication"],
  ["the-mona.json", "arts-and-collectibles"],
  ["nftwitch.json", "data-storage-and-management"],
  ["nft-storage.json", "data-storage-and-management"],
  ["opera.json", "ai-productivity-and-utilities"],
  ["blockrocket.json", "developer-tools-and-other"],
  ["tachyon.json", "governance-daos-and-public-goods"],
  ["filescan.json", "network-explorers-and-reputation"],
  ["trust-wallet.json", "wallets-identity-and-authentication"],
  ["filfox.json", "network-explorers-and-reputation"],
  ["athena-explorer.json", "network-explorers-and-reputation"]
];

// Read the taxonomy file and parse its json
const taxonomyFilePath = path.join(__dirname, '..', 'content', 'data', 'taxonomy.json');
const taxonomy = JSON.parse(fs.readFileSync(taxonomyFilePath, 'utf-8'));

// Convert the CSV content and the taxonomy to more usable formats
const projectSubcatMapping = Object.fromEntries(csvContent);
const subcatCatMapping = Object.fromEntries(
  taxonomy.categories.flatMap(category => 
    category.subcategories.map(subcategory => 
      [subcategory.slug, category.slug]
    )
  )
);

let processedFilesCount = 0;
let unchangedFiles = [];

// Function to iterate through each file
function processFile(filename, filePath) {
  const subcategory = projectSubcatMapping[filename];
  if (!subcategory) {
    unchangedFiles.push(filename);
    return;
  }

  const category = subcatCatMapping[subcategory];
  if (!category) {
    unchangedFiles.push(filename);
    return;
  }

  // Read the file and parse the JSON
  const projectJson = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

  // Add the subcategory to the appropriate category in the taxonomy
  for (const catObj of projectJson.taxonomy) {
    if (catObj.category === category) {
      catObj.subcategories.push(subcategory);
      break;
    }
  }

  // Write the updated JSON back to the file
  fs.writeFileSync(filePath, JSON.stringify(projectJson, null, 2) + "\n");
  processedFilesCount++;
  console.log(`Processed file: ${filename}`);
}

// Function to read and process all files in a directory
function processFilesInDirectory(dirPath) {
  const files = fs.readdirSync(dirPath);

  console.log(`Found ${files.length} files/directories`);

  files.forEach(file => {
    if (path.extname(file) === '.json') {
      const filePath = path.join(dirPath, file);
      processFile(file, filePath);
    }
  });

  console.log(`Processed ${processedFilesCount} out of ${files.length} files`);
  console.log(`Unchanged files: \n${unchangedFiles.join('\n')}`);
}

// Directory containing the project JSON files
const projectDirectory = path.join(__dirname, '..', 'content', 'projects');

processFilesInDirectory(projectDirectory);
