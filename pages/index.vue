<template>
  <div :class="`page page-${tag} container`">

    <HeroHeader
      :content="hero"
      :categories="categories" />

    <section class="project-list">
      <div class="grid">
        <div class="col-6">
          <CardListBlock
            :cards="cardColumnOne"
            :randomize="randomizeProjects"
            class="left" />
        </div>
        <div class="col-6">
          <CardListBlock
            :cards="cardColumnTwo"
            :randomize="randomizeProjects"
            class="right" />
        </div>
      </div>
    </section>

  </div>
</template>

<script>
// ===================================================================== Imports
import { mapGetters, mapActions } from 'vuex'
// import CloneDeep from 'lodash/cloneDeep'

import HeroHeader from '@/components/HeroHeader'
import CardListBlock from '@/components/CardListBlock'

// =================================================================== Functions
// const parseURLParams = (instance, next) => {
//   const cloned = CloneDeep(instance.$route.query)
//   instance.clearRouteQuery()
//   if (cloned.hasOwnProperty('filters')) {
//     if (cloned.filters === 'enabled') {
//       if (!window.matchMedia('(max-width: 53.125rem)').matches) {
//         instance.setFilterPanelOpen(true)
//       }
//       instance.setRouteQuery({
//         key: 'filters',
//         data: cloned.filters
//       })
//       if (!cloned.hasOwnProperty('tags')) {
//         instance.clearAllTags()
//       }
//     }
//   }
//   if (cloned.hasOwnProperty('tags')) {
//     const tags = cloned.tags.split(',')
//     const slug = tags.filter(tag => instance.taxonomyLabels.hasOwnProperty(tag)).join(',')
//     instance.setRouteQuery({
//       key: 'tags',
//       data: slug
//     })
//   }
//   if (cloned.hasOwnProperty('results')) {
//     const results = cloned.results
//     if (!results.isNaN) {
//       if (results > 0) {
//         instance.setRouteQuery({
//           key: 'results',
//           data: parseInt(results)
//         })
//       }
//     }
//   }
//   if (cloned.hasOwnProperty('sort-by')) {
//     instance.setRouteQuery({
//       key: 'sort-by',
//       data: cloned['sort-by']
//     })
//   }
//   if (cloned.hasOwnProperty('display-type')) {
//     instance.setRouteQuery({
//       key: 'display-type',
//       data: cloned['display-type']
//     })
//   }
//   instance.$nextTick(() => {
//     setRouteQueryPage(instance, cloned)
//   })
// }
// const setRouteQueryPage = (instance, cloned) => {
//   if (cloned.hasOwnProperty('page')) {
//     const page = cloned.page
//     if (!page.isNaN) {
//       if (page > 0) {
//         instance.setRouteQuery({
//           key: 'page',
//           data: parseInt(page)
//         })
//       }
//     }
//   }
// }

// ====================================================================== Export
export default {
  name: 'IndexPage',

  components: {
    HeroHeader,
    CardListBlock
  },

  layout: 'base',

  data () {
    return {
      tag: 'home'
    }
  },

  async fetch ({ store, req }) {
    await store.dispatch('global/getBaseData', { key: 'core' })
    await store.dispatch('global/getBaseData', { key: 'index' })
    await store.dispatch('projects/getProjects')
  },

  head () {
    const title = this.seo.title
    const description = this.seo.description
    const image = this.seo.og_image
    const url = this.seo.og_url
    const structuredData = {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: title,
      abstract: description,
      mainEntity: {
        '@type': 'WebSite',
        name: 'IPFS',
        url: this.generalPageData.navigation.index.href
      },
      image,
      url
    }
    return {
      title,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: description
        },
        { hid: 'og:title', property: 'og:title', content: title },
        { hid: 'og:description', property: 'og:description', content: description },
        { hid: 'og:site_name', property: 'og:site_name', content: this.seo.og_site_name },
        { hid: 'og:url', property: 'og:url', content: url },
        { hid: 'og:type', property: 'og:type', content: this.seo.og_type },
        { hid: 'og:image', property: 'og:image', content: image },
        { hid: 'twitter:card', name: 'twitter:card', content: 'summary_large_image' },
        { hid: 'twitter:title', name: 'twitter:title', content: title },
        { hid: 'twitter:description', name: 'twitter:description', content: description },
        { hid: 'twitter:image', name: 'twitter:image', content: image }
      ],
      link: [
        { rel: 'canonical', href: url },
        { rel: 'alternate', hreflang: 'en', href: url },
        { rel: 'alternate', hreflang: 'x-default', href: url }
      ],
      __dangerouslyDisableSanitizers: ['script'],
      script: [{ innerHTML: JSON.stringify(structuredData), type: 'application/ld+json' }]
    }
  },

  computed: {
    ...mapGetters({
      siteContent: 'global/siteContent',
      settings: 'global/settings',
      routeQuery: 'filters/routeQuery',
      filterPanelOpen: 'filters/filterPanelOpen',
      taxonomyLabels: 'filters/taxonomyLabels',
      projects: 'projects/projects'
    }),
    // SEO
    seo () {
      return this.$GetSeo(this.tag)
    },
    // Page Content
    generalPageData () {
      return this.siteContent.general
    },
    pageData () {
      return this.siteContent.index.page_content
    },
    hero () {
      return this.pageData.hero
    },
    categories () {
      return this.siteContent.taxonomy.categories
    },
    cardColumnOne () {
      const halflength = Math.ceil(this.projects.length / 2)
      return this.projects.slice(0, halflength)
    },
    cardColumnTwo () {
      const halflength = Math.ceil(this.projects.length / 2)
      return this.projects.slice(halflength, this.projects.length)
    },
    randomizeProjects () {
      return this.settings.visibility.randomizeProjects
    }
  },

  watch: {
    '$route' (route) {
      if (this.$Countly) {
        this.$Countly.trackEvent('Query Param Debug', route.query)
      }
      if (route.query.filters === 'enabled') {
        this.collapseSegmentAndFeaturedSliders()
      }
    }
  },

  // mounted () {
  //   parseURLParams(this)
  // },

  // beforeDestroy () {
  //   this.clearRouteQuery()
  // },

  methods: {
    ...mapActions({
      setRouteQuery: 'filters/setRouteQuery',
      clearRouteQuery: 'filters/clearRouteQuery',
      setFilterPanelOpen: 'filters/setFilterPanelOpen',
      clearAllTags: 'filters/clearAllTags'
    })
  }
}
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
.page {
  @include small {
    position: relative;
  }
}

.project-list {
  margin-bottom: toRem(100);
}

// ///////////////////////////////////////////////////////////////// Transitions
.fade {
  &-enter-active {
    transition: opacity 500ms 500ms;
  }
  &-leave-active {
    transition: opacity 500ms;
  }
  &-enter-to,
  &-leave {
    opacity: 1;
  }
  &-enter,
  &-leave-to {
    opacity: 0;
  }
}

.collapsible-section {
  overflow: hidden;
  transition: height 500ms 500ms;
}
</style>
