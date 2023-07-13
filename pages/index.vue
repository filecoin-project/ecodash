<template>
  <div :class="`page page-${tag} container`">

    <HeroHeader
      :content="hero"
      :categories="categories" />

    <div class="grid">
      <div class="col-6">
        <CardListBlock :cards="cardColumnOne" />
      </div>
      <div class="col-6">
        <CardListBlock :cards="cardColumnTwo" />
      </div>
    </div>

    <section class="section-segment-slider">
      <div class="grid">
        <div class="col-12">
          <h3 class="heading">
            Explore Projects
          </h3>
          <SegmentSlider />
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
import SegmentSlider from '@/components/SegmentSlider'
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
//     } else {
//       instance.mountSegmentAndFeaturedSliders()
//     }
//   } else {
//     instance.mountSegmentAndFeaturedSliders()
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

const initResize = (instance) => {
  clearTimeout(instance.timeOutFunction)
  instance.timeOutFunction = setTimeout(() => {
    instance.resetSectionHeight()
  }, 150)
}

// ====================================================================== Export
export default {
  name: 'IndexPage',

  components: {
    HeroHeader,
    SegmentSlider,
    CardListBlock
  },

  layout: 'base',

  data () {
    return {
      tag: 'home',
      sectionHeight: 0,
      segmentSlider: false,
      featuredSlider: false,
      resize: false,
      timeOutFunction: null
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
      routeQuery: 'filters/routeQuery',
      filterPanelOpen: 'filters/filterPanelOpen',
      taxonomyLabels: 'filters/taxonomyLabels',
      projects: 'projects/projects'
    }),
    settings () {
      return this.siteContent.settings
    },
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
    gridOrListView () {
      if (this.settings.visibility.defaultView === 'list') {
        return true
      }
      return false
    },
    filterSectionHeading () {
      if (this.settings.visibility.indexHeadingEntityCount) {
        const heading = this.pageData.section_filter.heading
        const arr = heading.split(' ')
        const index = arr.findIndex((word) => {
          return (
            word === this.settings.nomenclature.entityTermPlural ||
            word === this.settings.nomenclature.entityTerm
          )
        })
        arr.splice(index, 0, this.projects.length)
        return arr.join(' ')
      }
      return this.pageData.section_filter.heading
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

  mounted () {
    // parseURLParams(this)
    this.resize = () => { this.$nextTick(() => { initResize(this) }) }
    window.addEventListener('resize', this.resize)
  },

  beforeDestroy () {
    if (this.resize) { window.removeEventListener('resize', this.resize) }
    this.clearRouteQuery()
  },

  methods: {
    ...mapActions({
      setRouteQuery: 'filters/setRouteQuery',
      clearRouteQuery: 'filters/clearRouteQuery',
      setFilterPanelOpen: 'filters/setFilterPanelOpen',
      clearAllTags: 'filters/clearAllTags'
    }),
    mountSegmentAndFeaturedSliders () {
      if (this.settings.visibility.segmentChart) {
        if (!this.segmentSlider) { this.segmentSlider = true }
      }
      if (this.settings.visibility.featuredSlider) {
        if (!this.featuredSlider) { this.featuredSlider = true }
      }
      if (this.filterPanelOpen) { this.setFilterPanelOpen(false) }
      this.setRouteQuery({ key: 'filters', data: '' })
      this.clearAllTags()
      this.resetSectionHeight()
    },
    collapseSegmentAndFeaturedSliders () {
      if (this.segmentSlider) {
        this.segmentSlider = false
      }
      if (this.featuredSlider) {
        this.featuredSlider = false
      }
      this.sectionHeight = 0
      window.scrollTo(0, 0)
    },
    resetSectionHeight () {
      if (this.$refs.collapsibleSection.firstElementChild) {
        setTimeout(() => {
          this.sectionHeight = Math.ceil(this.$refs.collapsibleSection.firstElementChild.clientHeight)
        }, 300)
      }
    }
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

.section-segment-slider {
  .heading {
    font-size: toRem(22);
    font-weight: 600;
    line-height: leading(36, 22);
    letter-spacing: 0.48px;
  }
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