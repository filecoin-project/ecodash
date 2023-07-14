/*
 *
 * 📦 [Module] Filters
 *
 */

const camelize = (string) => {
  return string.replace(/-./g, word => word[1].toUpperCase())
}

// ///////////////////////////////////////////////////////////////////// Imports
// -----------------------------------------------------------------------------
// ///////////////////////////////////////////////////////////////////// General
import Path from 'path'
import Fs from 'fs'

// ///////////////////////////////////////////////////////////////////// Plugins
const plugins = [
  {
    src: Path.resolve(__dirname, 'plugins/index.js'),
    filename: 'zero/filters/index.js'
  }
]

// /////////////////////////////////////////////////////////////////// Functions
// -----------------------------------------------------------------------------
// /////////////////////////////////////////////////////////// compileComponents
const compileComponents = (instance) => {
  return new Promise((next) => {
    const componentsDir = `${instance.options.rootDir}/components`
    plugins.forEach((plugin) => {
      // Need to pass component name list to global-components.js, which subsequently
      // loads all the module components as global ones for app-wide use
      if (plugin.filename === 'zero/filters/global-components.js') {
        plugin.options = []
        const components = Fs.readdirSync(`${__dirname}/components`).filter(file => file !== '.DS_Store')
        components.forEach((component) => {
          const name = component.split('.')[0]
          let override
          try {
            override = Fs.readFileSync(`${componentsDir}/${component}`)
            override = `${componentsDir}/${component}`
          } catch (e) {
            override = false
          }
          const path = override || Path.resolve(__dirname, `components/${component}`)
          plugin.options.push({ name, path })
        })
      }
    })
    next()
  })
}

// //////////////////////////////////////////////////////////////// compileStore
const compileStore = (instance) => {
  return new Promise((next) => {
    const contentDir = instance.options.rootDir
    plugins.forEach((plugin) => {
      if (plugin.filename === 'zero/filters/index.js') {
        plugin.options = []
        const storePath = Path.resolve(__dirname, 'store')
        const stores = Fs.readdirSync(storePath).filter(store => store !== '.DS_Store')
        stores.forEach((store) => {
          const path = Path.resolve(storePath, store)
          plugin.options.push({
            name: camelize(store.split('.')[0]),
            path,
            content: Fs.readFileSync(path) + ''
          })
        })
      }
    })
    next()
  })
}

// ///////////////////////////////////////////////////////////// registerPlugins
const registerPlugins = (instance, next) => {
  plugins.forEach((plugin) => {
    instance.addPlugin(plugin)
  })
  if (next) { return next() }
}

// ///////////////////////////////////////////////////////////////////// Liftoff
// -----------------------------------------------------------------------------
export default async function (instance) {
  if (instance.options.zero.filters.include) {
    await compileStore(instance)
    registerPlugins(instance, () => {
      console.log(`📦 [Module] Filters`)
    })
  }
}
