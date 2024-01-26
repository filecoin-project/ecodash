/*
 *
 * 📦 [Module] NuxtModulePlausible
 *
 */

// ///////////////////////////////////////////////////////////////////// Imports
// -----------------------------------------------------------------------------
// ///////////////////////////////////////////////////////////////////// General
import Path from 'path'

// ///////////////////////////////////////////////////////////////////// Plugins
const plugins = [
  {
    src: Path.resolve(__dirname, 'plugin.js'),
    filename: 'nuxt-module-plausible/index.js'
  }
]

// ///////////////////////////////////////////////////////////// registerPlugins
const registerPlugins = (instance) => {
  plugins.forEach((plugin) => {
    instance.addPlugin(plugin)
    console.log('📦 [Module] Plausible')
  })
}

// ///////////////////////////////////////////////////////////////////// Liftoff
// -----------------------------------------------------------------------------
export default function () {
  if (this.options.plausible.include) {
    registerPlugins(this)
  }
}
