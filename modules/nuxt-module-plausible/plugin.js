/*
 *
 * 🔌 [Plugin | NuxtModulePlausible] Methods
 *
 */

// ///////////////////////////////////////////////////////////////////// Imports
// -----------------------------------------------------------------------------
import Config from '@/nuxt.config'

console.log('🔌 [Plugin | Plausible] Plausible')

// ////////////////////////////////////////////////////////////////////// Export
// -----------------------------------------------------------------------------
export default ({ app }) => {
  // Do not fire Plausible if not in production mode
  // unless tracking localhost is explicitly enabled in the config
  if (process.env.NODE_ENV !== 'production') {
    if (!Config.plausible.trackLocalhost) {
      return
    }
  }

  let isInitialPageLoad = true

  app.router.afterEach((to) => {
    // Ignore initial page because it's fired in the head
    if (isInitialPageLoad) {
      isInitialPageLoad = false
      return
    }

    // Check if we're on client-side
    if (process.client) {
      // Track virtual navigation changes
      window.plausible = window.plausible || function () {
        (window.plausible.q = window.plausible.q || []).push(arguments)
      }
      window.plausible('pageview', {
        url: `https://filecoinecosystem.io${to.fullPath}`
      })
    }
  })
}
