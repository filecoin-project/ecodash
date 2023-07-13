<template>
  <div :class="`page page-${tag} container`">

    <HeroHeader
      :content="hero"
      :categories="categories" />

    <section class="project-list">
      <div class="grid">
        <div
          v-for="subcategory in subcategories"
          :key="subcategory.heading"
          class="col-6 subcategory">
          <CardListBlock
            :heading="subcategory.heading"
            :cards="subcategory.projects"
            :list-total="subcategory.count"
            :cta="{ text: subcategory.heading, slug: subcategory.slug }" />
        </div>
      </div>
    </section>

  </div>
</template>

<script>
// ===================================================================== Imports
import { mapGetters } from 'vuex'
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
    },
    activeCategory () {
      const route = this.$route
      if (route.params.category) {
        const active = this.categories.find(cat => cat.slug === route.params.category)
        return active
      }
      return false
    },
    subcategories () {
      if (this.activeCategory) {
        const subcategories = []
        const headings = ['Bridges and Oracles', 'Infrastructure & Other', 'Leasing & Staking', 'Exchanges & Swaps']
        const slugs = ['bridges-and-cracles', 'infrastructure-other', 'leasing-staking', 'exchanges-swaps']
        // const subcategories = this.activeCategory.subcategories
        for (let i = 0; i < 4; i++) {
          const column = this.projects.slice(i * 5, (i + 1) * 5)
          subcategories.push({
            heading: headings[i],
            slug: slugs[i],
            count: column.length,
            projects: column
          })
        }
        return subcategories
      }
      return []
    }
  }
}
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
.project-list {
  // margin-bottom: toRem(100);
}

.subcategory {
  margin-bottom: toRem(30);
}
</style>
