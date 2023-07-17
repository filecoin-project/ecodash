<template>
  <div :class="`page page-${tag} container`">

    <HeroHeader
      :content="resultsHeading"
      :categories="false"
      :back-button="backButton"
      :heading-cta="true" />

    <section
      v-if="resultsCount"
      class="project-list">
      <div class="grid">
        <div class="col-6">
          <CardListBlock :cards="cardColumnOne" class="left" />
        </div>
        <div class="col-6">
          <CardListBlock :cards="cardColumnTwo" class="right" />
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

// ====================================================================== Export
export default {
  name: 'CategoryPage',

  components: {
    HeroHeader,
    CardListBlock
  },

  layout: 'base',

  data () {
    return {
      tag: 'subcategory'
    }
  },

  async fetch ({ store, req }) {
    await store.dispatch('global/getBaseData', { key: 'core' })
    await store.dispatch('projects/getProjects')
  },

  computed: {
    ...mapGetters({
      siteContent: 'global/siteContent',
      routeQuery: 'filters/routeQuery',
      taxonomyLabels: 'filters/taxonomyLabels',
      projects: 'projects/projects',
      filterValue: 'core/filterValue'
    }),
    categories () {
      return this.siteContent.taxonomy.categories
    },
    backButton () {
      return {
        text: 'Back to all categories',
        url: '/'
      }
    },
    resultsHeading () {
      if (this.resultsCount) {
        return { heading: `${this.resultsCount} Results for "${this.filterValue}"` }
      }
      return {
        heading: `No results for "${this.filterValue}"`,
        subheading: 'Please try another query'
      }
    },
    searchQuery () {
      return this.filterValue
    },
    searchResults () {
      const query = this.searchQuery.toLowerCase()
      return this.projects.filter((project) => {
        const matched = project.name.toLowerCase().includes(query) || project.org.join('').toLowerCase().includes(query)
        if (!matched) { return false }
        return project
      })
    },
    cardColumnOne () {
      const len = this.searchResults.length
      if (len) { return this.searchResults.slice(0, Math.ceil(len / 2)) }
      return []
    },
    cardColumnTwo () {
      const len = this.searchResults.length
      if (len) { return this.searchResults.slice(Math.ceil(len / 2), len) }
      return []
    },
    resultsCount () {
      return this.cardColumnOne.length + this.cardColumnTwo.length
    }
  },

  mounted () {
    const query = this.$route.query
    if (query && query.search) {
      this.setFilterValue(query.search)
    }
  },

  methods: {
    ...mapActions({
      setFilterValue: 'core/setFilterValue'
    })
  }
}
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
.project-list {
  margin-bottom: toRem(100);
}

.subcategory {
  margin-bottom: toRem(30);
}
</style>
