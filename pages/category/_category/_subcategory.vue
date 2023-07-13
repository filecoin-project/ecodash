<template>
  <div :class="`page page-${tag} container`">

    <HeroHeader
      v-if="subcategory"
      :content="subcategory"
      :categories="false"
      :back-button="backButton"
      :heading-cta="true" />

    <section class="project-list">
      <div class="grid">
        <div class="col-6">
          <CardListBlock :cards="cardColumnOne" />
        </div>
        <div class="col-6">
          <CardListBlock :cards="cardColumnTwo" />
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
      projects: 'projects/projects'
    }),
    categories () {
      return this.siteContent.taxonomy.categories
    },
    activeCategory () {
      const route = this.$route
      if (route.params.category) {
        const categories = this.categories
        if (categories) {
          const active = categories.find(cat => cat.slug === route.params.category)
          if (active) { return active }
        }
      }
      return false
    },
    subcategory () {
      if (this.activeCategory) {
        const route = this.$route
        if (route.params.subcategory) {
          // const category = this.category
          // const active = category.subcategories.find(cat => cat.slug === route.params.subcategory)
          return {
            heading: 'Bridges and Oracles',
            subheading: 'Lörem ipsum lar tepp astrotes polig ressa, kroning. Plasade hing. Dovis pseudovis konde ohins. Profiering prens sarar. Löse egoskapet dobur än yhinat pydoda i länade.'
          }
        }
      }
      return false
    },
    backButton () {
      if (this.activeCategory) {
        return {
          text: `Back to ${this.activeCategory.label}`,
          url: `/category/${this.activeCategory.slug}`
        }
      }
      return false
    },
    cardColumnOne () {
      return this.projects.slice(0, 5)
    },
    cardColumnTwo () {
      return this.projects.slice(5, 8)
    }
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
