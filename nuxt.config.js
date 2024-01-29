/* eslint require-await: "off" */
// /////////////////////////////////////////////////////////// Variables & Setup
// -----------------------------------------------------------------------------
const env = process.env.SERVER_ENV

const baseUrls = {
  development: 'https://localhost',
  production: 'https://filecoinecosystem.io'
}

const sitePort = 21000

const plausible = {
  include: true,
  trackLocalhost: false, // true if testing locally
  domain: 'filecoinecosystem.io'
}

export default {
  // //////////////////////////////////////////// Static Site Generation Options
  // ---------------------------------------------------------------------------
  target: 'static',
  // ///////////////////////////////////////////////////// Runtime Configuration
  // ---------------------------------------------------------------------------
  // ---------------------------------------------------------- [Runtime] Public
  publicRuntimeConfig: {
    siteUrl: env === 'development' ? `${baseUrls[env]}:${sitePort}` : baseUrls[env],
    countlyAppKey: process.env.COUNTLY_APP_KEY,
    countlySiteUrl: process.env.COUNTLY_SITE_URL,
    nodeEnv: process.env.NODE_ENV,
    plausible: { ...plausible }
  },
  // --------------------------------------------------------- [Runtime] Private
  privateRuntimeConfig: {},
  // /////////////////////////////////////////////////////////// Server & Render
  // ---------------------------------------------------------------------------
  server: {
    port: sitePort,
    host: process.env.NODE_ENV !== 'development' ? '0.0.0.0' : 'localhost'
  },
  render: {
    bundleRenderer: {
      runInNewContext: false
    }
  },
  // /////////////////////////////////////////////////////// Headers of the Page
  // ---------------------------------------------------------------------------
  head: {
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon/favicon.ico' }
    ],
    script: process.env.NODE_ENV === 'production' || plausible.trackLocalhost
      ? [
          {
            hid: 'plausible',
            src: 'https://plausible.io/js/script.outbound-links.js',
            'data-domain': 'filecoinecosystem.io',
            async: true,
            defer: true
          }
        ]
      : []
  },
  // ////////////////////////////////////////// Customize the progress-bar color
  // ---------------------------------------------------------------------------
  loading: {
    color: '#292929',
    height: '4px'
  },
  // /////////////////////////////////////////////////////////// Global CSS/SCSS
  // ---------------------------------------------------------------------------
  css: [
    '~/assets/scss/main.scss' // theme
  ],
  styleResources: {
    scss: [
      '~/assets/scss/utilities.scss' // theme
    ]
  },
  // /////////////////////////////////////////////////////// Nuxt.js Dev Modules
  // ---------------------------------------------------------------------------
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    '@nuxtjs/eslint-module'
  ],
  // /////////////////////////////////////////////////////////// Nuxt.js Modules
  // ---------------------------------------------------------------------------
  modules: [
    '~/modules/zero',
    '~/modules/ecosystem-directory',
    '~/modules/nuxt-module-plausible',
    // Doc: https://github.com/nuxt-community/style-resources-module/
    '@nuxtjs/style-resources',
    // Doc: https://github.com/agency-undone/nuxt-module-ipfs
    '@agency-undone/nuxt-module-ipfs'
  ],
  // ///////////////////////////////////////////////////////////// [Module] Zero
  // ---------------------------------------------------------------------------
  zero: {
    core: {
      include: true,
      toaster: {
        display: 10,
        timeout: 5000
      }
    },
    filters: {
      include: true
    },
    pagination: {
      include: true
    }
  },
  // ////////////////////////////////////////////////////////// [Module] Countly
  // ---------------------------------------------------------------------------
  // Doc: https://support.count.ly/hc/en-us/articles/360037441932-Web-analytics-JavaScript
  countly: {
    initialize: false, // if set to false, Countly will be DISABLED
    debug: process.env.NODE_ENV === 'development',
    disableInDevelopment: true,
    suppressErrorLogs: true
  },
  // /////////////////////////////////// Plugins to load before mounting the App
  // ---------------------------------------------------------------------------
  plugins: [],
  // /////////////////////////////////////////////////////// Router + Middleware
  // ---------------------------------------------------------------------------
  router: {
    base: process.env.NODE_ENV === 'development' ? '/' : '/ipfs/hash/'
    // extendRoutes (routes, resolve) {}
  },
  // /////////////////////////////////////////////////////// Build configuration
  // ------------------------------------------------ Extend webpack config here
  build: {
    html: {
      minify: {
        collapseWhitespace: true
      }
    },
    // ---------------------------------------------------------- Hot Middleware
    hotMiddleware: {
      client: {
        overlay: false
      }
    },
    // -------------------------------------------------------------- Extensions
    extend (config, ctx) {
      config.optimization.minimize = false
      config.module.rules.push({
        test: /\.md$/,
        use: 'raw-loader'
      })
    }
  }
}
