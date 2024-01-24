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
const registerPlugins = (instance, next) => {
  // eslint-disable-next-line promise/param-names
  return new Promise((next) => {
    plugins.forEach((plugin) => {
      instance.addPlugin(plugin)
    })
    if (next) { return next() }
  })
}

// ///////////////////////////////////////////////////////////////////// Liftoff
// -----------------------------------------------------------------------------
export default async function () {
  if (this.options.plausible.include) {
    await registerPlugins(this, () => {
      console.log('📦 [Module] Plausible')
    })
  }
}
