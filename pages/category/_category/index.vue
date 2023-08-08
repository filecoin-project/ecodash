<template>
  <div :class="`page page-${tag} container`">

    <HeroHeader
      :content="hero"
      :categories="categories"
      :show-category-info="true" />

    <section class="project-list">
      <div class="grid">
        <div
          v-for="(subcategory, i) in subcategories"
          :key="subcategory.heading"
          class="col-6_sm-12 subcategory">
          <CardListBlock
            :heading="subcategory.heading"
            :cards="subcategory.projects"
            :list-total="subcategory.count"
            :cta="{ text: subcategory.heading, path: subcategory.path }"
            :fold-columns="small"
            :limit="small ? 6 : 5"
            :randomize="randomizeProjects"
            :class="i % 2 === 0 ? 'left' : 'right'" />
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
const checkForSmallBreakpoint = (instance) => {
  if (window.matchMedia('(max-width: 53.125rem)').matches) {
    if (!instance.small) {
      instance.small = true
    }
  } else {
    if (instance.small) {
      instance.small = false
    }
  }
}

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
      tag: 'category',
      small: false,
      resize: false
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
      settings: 'global/settings',
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
        const array = []
        const subcategories = this.activeCategory.subcategories
        const len = subcategories.length
        for (let i = 0; i < len; i++) {
          const categorySlug = this.activeCategory.slug
          const subcategory = subcategories[i]
          const column = getSubcategoryProjects(subcategory.slug, this.projects)
          if (column.length) {
            array.push({
              heading: subcategory.label,
              path: `/category/${categorySlug}/${subcategory.slug}`,
              count: column.length,
              projects: column
            })
          }
        }
        return array
      }
      return []
    },
    randomizeProjects () {
      return this.settings.visibility.randomizeProjects
    }
  },

  mounted () {
    checkForSmallBreakpoint(this)
    this.resize = () => { checkForSmallBreakpoint(this) }
    window.addEventListener('resize', this.resize)
  },

  beforeDestroy () {
    if (this.resize) { window.removeEventListener('resize', this.resize) }
  }
}
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
.subcategory {
  margin-bottom: toRem(30);
}

::v-deep .card-list-block {
  @include small {
    margin: 0 -0.5rem !important;
  }
}
</style>
