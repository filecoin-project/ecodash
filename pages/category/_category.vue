<template>
  <div :class="`page page-${tag} container`">

    <HeroHeader
      :content="hero"
      :categories="categories" />

  </div>
</template>

<script>
// ===================================================================== Imports
import { mapGetters } from 'vuex'
import CloneDeep from 'lodash/cloneDeep'

import HeroHeader from '@/components/HeroHeader' 

// ====================================================================== Export
export default {
  name: 'CategoryPage',

  components: {
    HeroHeader
  },

  layout: 'base',

  data () {
    return {
      tag: 'category'
    }
  },

  async fetch ({ store, req }) {
    await store.dispatch('global/getBaseData', { key: 'core' })
    await store.dispatch('global/getBaseData', { key: 'category' })
    await store.dispatch('projects/getProjects')
  },

  computed: {
    ...mapGetters({
      siteContent: 'global/siteContent',
      routeQuery: 'filters/routeQuery',
      taxonomyLabels: 'filters/taxonomyLabels',
      projects: 'projects/projects'
    }),
    pageData () {
      return this.siteContent[this.tag].page_content
    },
    hero () {
      return this.pageData.hero
    },
    categories () {
      return this.siteContent.taxonomy.categories
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
