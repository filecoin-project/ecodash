/*
 *
 * 📦 [Module] IPFS Shipyard Ecosystem Directory
 *
 */

const camelize = (string) => {
  return string.replace(/-./g, word => word[1].toUpperCase())
}

// ///////////////////////////////////////////////////////// Imports & Variables
// -----------------------------------------------------------------------------
// ///////////////////////////////////////////////////////////////////// General
import Path from 'path'
import Fs from 'fs-extra'

import Manifestor from './scripts/manifestor'

// /////////////////////////////////////////////////////////////////////// Pages
const pages = [
  {
    name: 'ecosystem-directory/index',
    path: '/',
    component: 'pages/index.vue',
    chunkName: 'ecosystem-directory/index'
  },
  // {
  //   name: 'ecosystem-directory/project',
  //   path: '/project/:id',
  //   component: 'pages/_project.vue',
  //   chunkName: 'ecosystem-directory/project'
  // },
  {
    name: 'ecosystem-directory/showcase',
    path: '/showcase',
    component: 'pages/_showcase.vue',
    chunkName: 'ecosystem-directory/showcase'
  }
]

// ///////////////////////////////////////////////////////////////////// Plugins
const plugins = [
  {
    src: Path.resolve(__dirname, 'plugins/helpers.js'),
    filename: 'ecosystem-directory/helpers.js'
  },
  {
    src: Path.resolve(__dirname, 'plugins/taxonomy-methods.js'),
    filename: 'ecosystem-directory/taxonomy-methods.js'
  }
]

// ////////////////////////////////////////////////////////////////////// Assets
const ScssUtilitiesPath = Path.resolve(__dirname, 'assets/scss/utilities.scss')
const ScssMainPath = Path.resolve(__dirname, 'assets/scss/main.scss')

// /////////////////////////////////////////////////////////////////// Functions
// -----------------------------------------------------------------------------
// ///////////////////////////////////////////////////////////////// runCheckers
const runCheckers = (instance) => {
  return new Promise((next) => {
    const appRootDir = instance.options.rootDir
    const entities = [
      { type: 'dir', path: `${appRootDir}/static/content` },
      { type: 'dir', path: `${appRootDir}/pages` },
      { type: 'dir', path: `${appRootDir}/components` },
      { type: 'dir', path: `${appRootDir}/store` },
      { type: 'file', path: `${appRootDir}/store/index.js`, data: '// At least one store file must exist in this @/store directory. If you are using a store, you can delete this file. If you are not using a store then this is a required file and should be commited to your git repo. DO NOT DELETE.' }
    ]
    entities.forEach((entity) => {
      const path = entity.path
      if (!Fs.existsSync(path)) {
        if (entity.type === 'dir') {
          Fs.mkdirSync(path)
        } else if (entity.type === 'file') {
          Fs.writeFileSync(path, entity.data)
        }
      }
    })
    next()
  })
}

// ////////////////////////////////////////////////////////////// compileContent
const compileContent = (instance) => {
  return new Promise((next) => {
    const appRootDir = instance.options.rootDir
    const contentDirCore = `${appRootDir}/content`
    const contentDist = `${appRootDir}/static/content`
    const getFile = (path, pathname) => {
      const entities = Fs.readdirSync(path, { withFileTypes: true }).filter(dirent => dirent.name !== '.DS_Store')
      entities.forEach((entity) => {
        const name = entity.name
        if (entity.isDirectory()) {
          if (name !== 'projects') {
            getFile(Path.resolve(`${path}/${name}`), `${pathname}/${name}`)
          }
        } else {
          const split = name.split('.')
          if (split.length === 2 && split[1] === 'json') {
            Fs.writeFileSync(`${contentDist}/core_${name}`, Fs.readFileSync(`${appRootDir}/${pathname}/${name}`))
          }
        }
      })
    }; getFile(contentDirCore, 'content')
    next()
  })
}

// ////////////////////////////////////////////////////////////// registerRoutes
const registerRoutes = (instance) => {
  return new Promise((next) => {
    const settingsPath = Path.resolve(`${instance.options.rootDir}/static/content/core_settings.json`)
    const settings = JSON.parse(Fs.readFileSync(settingsPath))
    // Register base routes/pages
    instance.extendRoutes((routes) => {
      pages.forEach((page) => {
        if (page.path.includes('showcase')) {
          page.path = page.path.replace('/showcase', settings.behavior.showcaseBaseRoute)
        }
        page.component = Path.resolve(`${instance.options.rootDir}/${page.component}`)
        routes.push(page)
      })
    })
    // Here we have almost manually add any other routes that need to be generated for static
    const generate = []
    pages.forEach((page) => {
      if (page.path.includes('showcase')) {
        generate.push({
          route: page.path.replace('/showcase', settings.behavior.showcaseBaseRoute)
        })
      }
    })
    // Register all project pages and import payloads
    instance.options.generate.routes = () => {
      let routes = require(`${instance.options.rootDir}/static/content/category-routes.json`)
      routes = routes.concat(generate)
      return routes
    }
    next()
  })
}

// ///////////////////////////////////////////////////////////// registerPlugins
const registerPlugins = (instance) => {
  return new Promise((next) => {
    // Add all required plugins
    plugins.forEach((plugin) => {
      instance.addPlugin(plugin)
    })
    // Add Countly plugin if required
    const initialize = instance.options.hasOwnProperty('countly') && instance.options.countly.initialize
    if (initialize) {
      // console.log(Path.resolve(__dirname))
      instance.addPlugin({
        src: Path.resolve(__dirname, '../zero/core/plugins/countly.js'),
        filename: 'ecosystem-directory/countly.js'
      })
    }
    next()
  })
}

// ////////////////////////////////////////////////////////////// registerAssets
const registerAssets = (instance) => {
  return new Promise((next) => {
    const styleResources = instance.options.styleResources
    instance.options.css.splice(0, 0, ScssMainPath)
    styleResources.hasOwnProperty('scss') && Array.isArray(styleResources.scss) ?
      instance.options.styleResources.scss.splice(0, 0, ScssUtilitiesPath) :
      instance.options.styleResources.scss = [ScssUtilitiesPath]
    next()
  })
}

// ///////////////////////////////////////////////////////////////////// Liftoff
// -----------------------------------------------------------------------------
export default async function () {
  await runCheckers(this)
  await compileContent(this)
  await Manifestor(this)
  await registerRoutes(this)
  await registerPlugins(this)
  console.log(`📦 [Module] IPFS Shipyard Ecosystem Directory`)
}
