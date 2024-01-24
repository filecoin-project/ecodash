/*
 *
 * 🔌 [Plugin | NuxtModulePlausible] Methods
 *
 */

console.log(`🔌 [Plugin | Plausible] Plausible`)

// ///////////////////////////////////////////////////////////////////// Imports
// -----------------------------------------------------------------------------
import Config from '@/nuxt.config'

// ////////////////////////////////////////////////////////////////////// Export
// -----------------------------------------------------------------------------
export default ({ app }) => {

  // Do not fire Plausible if not in production mode
  if (process.env.NODE_ENV !== 'production') {
    return
  }

  let isInitialPageLoad = true

  app.router.afterEach((to, from) => {

    // Ignore initial page because it's fired in the head
    if (isInitialPageLoad) {
      isInitialPageLoad = false
      return
    }

    // Check if we're on client-side
    if (process.client) {
      // Track virtual navigation changes
      window.plausible = window.plausible || function() {
        (window.plausible.q = window.plausible.q || []).push(arguments)
      }
      window.plausible('pageview', {
        url: `https://ecosystem.filecoin.io${to.fullPath}`
      })
    }
  })
}
