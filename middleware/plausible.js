let isInitialPageLoad = true

export default function (context) {
  // Ignore initial page because it's fired in the head
  if (isInitialPageLoad) {
    isInitialPageLoad = false
    return
  }

  // Exclude server side
  if (process.client) {
    // Track virtual navigation changes
    window.plausible = window.plausible || function() {
      (window.plausible.q = window.plausible.q || []).push(arguments)
    }
    window.plausible('pageview', {
      url: `https://ecosystem.filecoin.io${context.route.fullPath}`
    })
  }
}
