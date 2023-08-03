let isInitialPageLoad = true

export default function ({ route }) {
  // Ignore initial page because it's fired in the head
  if (isInitialPageLoad) {
    isInitialPageLoad = false
    return
  }

  // Track virtual navigation changes
  window.plausible = window.plausible || function() {
    (window.plausible.q = window.plausible.q || []).push(arguments)
  }
  window.plausible('pageview', {
    url: `https://ecosystem.filecoin.io${route.fullPath}`
  })
}
