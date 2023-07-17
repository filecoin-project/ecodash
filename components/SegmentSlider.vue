<template>
  <div
    id="segment-slider-main"
    ref="segmentSlider"
    @keyup.left="setSliderContent(selected - 1)"
    @keyup.right="setSliderContent(selected + 1)">
    <div class="main-container">

      <div class="grid-noGutter-middle">
        <div class="col-3">
          <SegmentSliderSlider
            v-if="chartItems"
            :selected-seg="selected"
            :container-height="containerHeight"
            :enable-image-alt="enableImageAlt"
            @update-slider="setSliderContent" />
        </div>
        <div class="col-9">
          <SegmentSliderChart
            v-if="chartItems"
            :chart-items="chartItems"
            :selected-seg="selected"
            :container-height="containerHeight"
            @update-slider="setSliderContent"
            @keyup.left="setSliderContent(selected - 1)"
            @chart-mounted="chartMounted" />
        </div>
      </div>

    </div>
  </div>
</template>

<script>
// ===================================================================== Imports
import { mapGetters } from 'vuex'

import SegmentSliderSlider from '@/components/SegmentSliderSlider'
import SegmentSliderChart from '@/components/SegmentSliderChart'

// =================================================================== Functions
const loadTaxonomies = (instance) => {
  const primary = {}
  const categories = instance.categories
  for (let i = 0; i < categories.length; i++) {
    const key = categories[i].slug
    primary[key] = {
      slug: key,
      label: { text: categories[i].label },
      description: categories[i].description,
      count: 0,
      logos: []
    }
  }
  return primary
}

const createLabels = (instance, projects) => {
  const output = []
  const len = projects.length
  const primary = loadTaxonomies(instance)
  for (let i = 0; i < len; i++) {
    const project = projects[i]
    project.taxonomy.forEach((item) => {
      const category = item.category
      if (item.subcategories.length) {
        primary[category].count += 1
        primary[category].logos.push(project.icon)
      }
    })
  }
  for (const category in primary) {
    primary[category].logos = [...new Set(primary[category].logos)].slice(0, 3)
    output.push(primary[category])
  }
  return output
}

// ====================================================================== Export
export default {
  name: 'SegmentSlider',

  components: {
    SegmentSliderSlider,
    SegmentSliderChart
  },

  data () {
    return {
      selected: 0,
      containerHeight: 440,
      segmentChart: false
    }
  },

  computed: {
    ...mapGetters({
      siteContent: 'global/siteContent',
      settings: 'global/settings',
      projects: 'projects/projects'
    }),
    chartItems () {
      return createLabels(this, this.projects)
    },
    categories () {
      return this.siteContent.taxonomy.categories
    },
    enableImageAlt () {
      return this.settings.visibility.mediaAltAtts
    }
  },

  watch: {
    segmentChart (val) {
      if (val) {
        this.$emit('init')
      }
    }
  },

  methods: {
    setSliderContent (seg) {
      if (seg < 0) { seg = this.chartItems.length - 1 }
      const mod = seg % this.chartItems.length
      this.selected = mod
    },
    chartMounted () {
      this.segmentChart = true
    }
  }
}
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
#segment-slider-main {
  font-weight: 500;
  font-size: $fontSize_Small;
  line-height: 1.4;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
}
.main-container {
  display: flex;
  position: relative;
  flex-wrap: wrap-reverse;
  justify-content: space-between;
  @include small{
    background-color: $white;
    @include oceanBorderGradient;
  }
}
</style>
