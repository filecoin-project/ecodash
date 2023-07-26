/* eslint-disable */
/**
 *
 * [Script] Airtable Fetch
 *
 */

// ///////////////////////////////////////////////////// Imports + general setup
// -----------------------------------------------------------------------------
const Path = require('path')
const Airtable = require('airtable')
const Fs = require('fs-extra')
const Axios = require('axios')
const Sharp = require('sharp')
const Mime = require('mime')
const { transformAirtableRecord, getProjectNameSlug } = require("./transform-airtable-record")

require('dotenv').config({ path: Path.resolve(__dirname, '../.env') })

Airtable.configure({
  endpointUrl: 'https://api.airtable.com',
  apiKey: process.env.AIRTABLE_API_KEY
})

const PROJECT_DIR_PATH = Path.resolve(__dirname, '../content/projects/')
const IMAGE_DIR_PATH = Path.resolve(__dirname, '../static/images/projects/')

// /////////////////////////////////////////////////////////////////// Functions
// -----------------------------------------------------------------------------
// ---------------------------------------------------------- getAirtableRecords
const getAirtableRecords = () => {
  return new Promise((resolve, reject) => {
    try {
      const base = Airtable.base(process.env.AIRTABLE_BASE_ID)
      base('Main')
      .select({ filterByFormula: 'AND({Include in directory?}, {New directory addition})' })
      .eachPage((records, next) => {
          resolve(records)
      }, function done(err) {
        if (err) { reject(err); }
      });
    } catch (err) {
      reject(err);
    }
  });
}

const getRecordSlug = (record) => {
  return getProjectNameSlug(record.fields['Product/project name'])
}

// ----------------------------------------------------------- diffAmountDeleted
const diffAmountDeleted = async (count) => {
  try {
    let files = await Fs.readdir(PROJECT_DIR_PATH)
    files = files.filter(file => file !== '.DS_Store')
    if (count / files.length <= 0.75) {
      console.log('   ❗️ Greater than 25% of projects were deleted from the Airtable. Cancelling import.')
      process.exit(0)
    }
    return false
  } catch (e) {
    console.log('=============================== [function: diffAmountDeleted]')
    throw e
  }
}

// -------------------------------------------------- deleteSpecificLocalRecords
const deleteSpecificLocalRecords = async (records) => {
    try {
      const slugs = records.map(getRecordSlug)
      const projectFiles = await Fs.readdir(PROJECT_DIR_PATH)
      const imageFiles = await Fs.readdir(IMAGE_DIR_PATH)
      const files = projectFiles
        .filter(file => slugs.includes(Path.basename(file, '.json')))
        .map(file => `${PROJECT_DIR_PATH}/${file}`)
        .concat(
          imageFiles.filter(file => slugs.some(slug => file.startsWith(`icon-${slug}`) || file.startsWith(`logo-${slug}`)))
          .map(file => `${IMAGE_DIR_PATH}/${file}`)
        )
      for (let path of files) {
        if (Fs.existsSync(path)) {
          await Fs.unlink(path).catch(e => { throw e })
        }
      }
    } catch (e) {
      console.log('=========================== [function: deleteSpecificLocalRecords]')
      throw e
    }
}

// ------------------------------------------------------ writeProjectFileToDisk
const writeProjectFileToDisk = async (fileName, transformedProject) => {
  try {
    await Fs.writeFile(
      `${PROJECT_DIR_PATH}/${fileName}.json`,
      JSON.stringify(transformedProject, null, 2)
    )
    return true
  } catch (e) {
    console.log(`   ❗️ [Bad JSON] project: ${fileName}`)
    return false
  }
}


// Check if the record's website returns a valid HTTP response
const isProjectLive = async (record) => {
  try {
    const response = await Axios.get(record.Website)
    return (response.status >= 200 && response.status <= 299)
  } catch (e) {
    return false
  }
}

// ----------------------------------------------------------------- resizeImage
const resizeImage = async (data, recordName, imageData, savePath, writeableStream, imageType) => { // imageType = 'icon-square' or 'logo'
  try {
    const width = imageData.width
    const height = imageData.height
    let transformer
    if (imageType === 'icon-square' && (width > 400 || height > 400)) {
      transformer = await Sharp().resize(400)
      data.pipe(transformer).pipe(writeableStream)
    } else if (imageType === 'logo' && (width > 1200 || height > 1200)) {
      transformer = await Sharp().resize(1200)
      data.pipe(transformer).pipe(writeableStream)
    } else {
      data.pipe(writeableStream)
    }
  } catch (e) {
    console.log(`   ❗️ [Image Resize Failed] ${recordName}`)
    throw e
  }
}

// --------------------------------------------------------------- downloadImage
const downloadImage = async (recordName, imageData, savePath, imageType, fileExt) => {
  const writeableStream = Fs.createWriteStream(savePath, { highWaterMark: 64000 })
  writeableStream.on('finish', () => writeableStream.close())
  writeableStream.on('error', (e) => {
    console.log('=========== [function: downloadImage | writeableStream error]')
    if (Fs.existsSync(savePath)) {
      Fs.unlink(savePath)
    }
  })
  try {
    const response = await Axios.get(imageData.url, { responseType: 'stream' })
    if (fileExt !== 'svg') {
      await resizeImage(response.data, recordName, imageData, savePath, writeableStream, imageType)
    } else {
      response.data.pipe(writeableStream)
    }
  } catch (e) {
    console.log(`   ❗️ [Image Download Failed] ${recordName}`)
    if (Fs.existsSync(savePath)) {
      Fs.unlink(savePath)
    }
  }
}

// -------------------------------------------------------- fetchAndProcessImage
const fetchAndProcessImage = async (recordName, imageData, imageType) => {
  try {
    const fileExt = Mime.getExtension(imageData.type)
    const prefix = imageType === 'icon-square' ? 'icon' : 'logo'
    const filename = `${prefix}-${recordName}.${fileExt}`
    const savePath = `${IMAGE_DIR_PATH}/${filename}`
    await downloadImage(recordName, imageData, savePath, imageType, fileExt)
    return filename
  } catch (e) {
    console.log('============================ [function: fetchAndProcessImage]')
    throw e
  }
}

// ---------------------------------------------------------------- isIconSquare
const isIconSquare = (imageData, iconName) => {
  if (imageData.width === imageData.height) {
    return true
  }

  console.log(`   📸 ${iconName} is not square`)
  return false

}

const verifyEnvVars = () => {
  if (!process.env.AIRTABLE_BASE_ID) {
    throw new Error('AIRTABLE_BASE_ID env var is required')
  }

  if (!process.env.AIRTABLE_API_KEY) {
    throw new Error('AIRTABLE_API_KEY env var is required')
  }
}

// ////////////////////////////////////////////////////////////////// Initialize
// -----------------------------------------------------------------------------
const AirtableFetch = async () => {
  console.log('🤖 Airtable fetch started', '\n')
  try {
    verifyEnvVars()
    const records = await getAirtableRecords().catch(e => { throw e; })
    const count = records.length
    await diffAmountDeleted(count)
    await deleteSpecificLocalRecords(records)
    for (let i = 0; i < count; i++) {
      const record = records[i].fields
      const projectSlug = getProjectNameSlug(record['Product/project name'])
      const icons = record['Icon (square)']
      const logos = record['Logo (non-square)']

      let iconFileName, logoFileName
      if (icons) {
        isIconSquare(icons[0], projectSlug)
        iconFileName = await fetchAndProcessImage(projectSlug, icons[0], 'icon-square')
      }
      if (logos) {
        logoFileName = await fetchAndProcessImage(projectSlug, logos[0], 'logo')
      }
      if(!await isProjectLive(record)) {
        console.log(`   🚫 ${record['Product/project name']} url: ${record.Website} appears to be down. Double check the URL and remove from Airtable if unavailable`)
      }
      // Transform from Airtable representation to the directory's schema format
      const transformedProject = transformAirtableRecord(record, { iconFileName, logoFileName })
      const success = await writeProjectFileToDisk(projectSlug, transformedProject)

      if(!success) {
          console.log(`   🚫 ${record['Product/project name']} failed to be saved`) 
      }

    }
    console.log('\n')
    console.log('🏁 Airtable fetch complete')
    process.exit(0)
  } catch (e) {
    console.log('=================================== [function: AirtableFetch]')
    console.log(e)
    process.exit(1)
  }
}

AirtableFetch()
