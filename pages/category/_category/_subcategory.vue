<template>
  <div :class="`page page-${tag} container`">

    <HeroHeader
      :content="subcategory"
      :back-button="true"
      :heading-cta="true" />

    <section class="project-list">
      <div class="grid">
        <div class="col-6">
          <CardListBlock
            :cards="cardColumnOne"
            class="left" />
        </div>
        <div class="col-6">
          <CardListBlock
            :cards="cardColumnTwo"
            class="right" />
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

// =================================================================== Functions
const getSubcategoryProjects = (subcategory, projects) => {
  const filtered = []
  const len = projects.length
  for (let i = 0; i < len; i++) {
    const project = projects[i]
    let memberships = []
    project.taxonomy.forEach((cat) => {
      memberships = memberships.concat(cat.subcategories)
    })
    if (memberships.includes(subcategory)) {
      filtered.push(project)
    }
  }
  return filtered
}

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
      const obj = {}
      if (this.activeCategory) {
        const route = this.$route
        if (route.params.subcategory) {
          const subcategories = this.activeCategory.subcategories
          const subcategory = subcategories.find(cat => cat.slug === route.params.subcategory)
          if (subcategory) {
            obj.heading = subcategory.label
            obj.subheading = subcategory.description
            obj.slug = subcategory.slug
          }
        }
      }
      return obj
    },
    subcategoryProjects () {
      const slug = this.subcategory.slug
      if (slug) {
        return getSubcategoryProjects(slug, this.projects)
      }
      return []
    },
    cardColumnOne () {
      const len = this.subcategoryProjects.length
      if (len) { return this.subcategoryProjects.slice(0, Math.ceil(len / 2)) }
      return []
    },
    cardColumnTwo () {
      const len = this.subcategoryProjects.length
      if (len) { return this.subcategoryProjects.slice(Math.ceil(len / 2), len) }
      return []
    }
  }
}
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
.project-list {
  margin-bottom: toRem(100);
}

::v-deep .hero-header {
  .heading-cta {
    @include small {
      display: none;
    }
  }
}

.subcategory {
  margin-bottom: toRem(30);
}
</style>
