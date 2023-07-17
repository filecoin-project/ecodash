<template>
  <div id="segment-slider-card" class="slider-container">
    <div
      v-hammer:swipe.horizontal="onSwipe"
      class="slider-card"
      :style="cardHeight">

      <div class="slide-nav">
        <Button
          type="button"
          class="nav-arrow focus-visible"
          @clicked="incrementSelection(selectedSeg - 1)">
          <template #icon-before>
            <PrevArrowIcon />
          </template>
        </Button>
        <h3
          :key="`${heading}-medium`"
          ref="navTitle"
          class="title-between-buttons transition-content">
          {{ heading }}
        </h3>
        <Button
          type="button"
          class="nav-arrow focus-visible"
          @clicked="incrementSelection(selectedSeg + 1)">
          <template #icon-before>
            <NextArrowIcon />
          </template>
        </Button>
      </div>

      <div
        :key="heading"
        class="transition-content">

        <div ref="content">
          <h3 class="heading">
            {{ heading }}
          </h3>
          <div class="description">
            {{ description }}
          </div>
        </div>

        <div v-if="logos" class="logo-wrapper">
          <img
            v-for="item in logos"
            :key="item.path"
            :src="$relativity(`/images/projects/${item.path}`)"
            :alt="enableImageAlt ? item.alt : null" />
        </div>

      </div>

      <div class="view-all-wrapper">
        <Button
          type="cta"
          tag="button"
          text="View Category"
          class="view-all-button"
          @clicked="jump2Filters" />
      </div>

    </div>
  </div>
</template>

<script>
// ===================================================================== Imports
import { mapGetters, mapActions } from 'vuex'

import NextArrowIcon from '@/components/icons/NextArrowIcon'
import PrevArrowIcon from '@/components/icons/PrevArrowIcon'
import Button from '@/modules/zero/core/components/Button'

// ====================================================================== Export
export default {
  name: 'SegmentSliderSlider',

  components: {
    NextArrowIcon,
    PrevArrowIcon,
    Button
  },

  props: {
    selectedSeg: {
      type: Number,
      default: 0
    },
    containerHeight: {
      type: Number,
      default: 440
    },
    enableImageAlt: {
      type: Boolean,
      required: false,
      default: true
    },
    heightPadding: {
      type: Number,
      required: false,
      default: 109 // card top and bottom padding + margin & height of logos
    }
  },

  data () {
    return {
      resize: false,
      contentHeight: false
    }
  },

  computed: {
    ...mapGetters({
      siteContent: 'global/siteContent',
      routeQuery: 'filters/routeQuery',
      segmentCollection: 'core/segmentCollection'
    }),
    currentCategory () {
      if (this.selectedSeg in this.segmentCollection) {
        return this.segmentCollection[this.selectedSeg]
      }
      return {}
    },
    heading () {
      return this.currentCategory.label ? this.currentCategory.label.text : ''
    },
    description () {
      return this.currentCategory.description ? this.currentCategory.description : ''
    },
    logos () {
      if (this.currentCategory.hasOwnProperty('logos')) {
        return this.currentCategory.logos
      }
      return false
    },
    cardHeight () {
      if (this.contentHeight) {
        return `height: ${this.contentHeight + this.heightPadding}px;`
      }
      return 'height: unset;'
    }
  },

  mounted () {
    this.resize = () => { this.resetContentHeight() }
    window.addEventListener('resize', this.resize)
  },

  beforeDestroy () {
    if (this.resize) { window.removeEventListener('resize', this.resize) }
  },

  updated () {
    this.resetContentHeight()
  },

  methods: {
    ...mapActions({
      setRouteQuery: 'filters/setRouteQuery',
      setFilterPanelOpen: 'filters/setFilterPanelOpen'
    }),
    incrementSelection (seg) {
      this.$emit('update-slider', seg)
    },
    jump2Filters () {
      const category = this.currentCategory
      const slug = category.slug
      this.setRouteQuery({ key: 'filters', data: 'enabled' })
      this.setRouteQuery({ key: 'tags', data: slug })
      this.setFilterPanelOpen(true)
      if (this.$Countly) {
        this.$Countly.trackEvent('Segment Chart | View All Button Clicked', {
          label: category.label,
          slug: category.slug
        })
      }
    },
    onSwipe (e) {
      if (e.type === 'swipeleft') {
        this.incrementSelection(this.selectedSeg + 1)
      } else if (e.type === 'swiperight') {
        this.incrementSelection(this.selectedSeg - 1)
      }
    },
    resetContentHeight () {
      this.$nextTick(() => {
        let h
        if (window.matchMedia('(max-width: 64rem)').matches) {
          h = this.$refs.content.offsetHeight + this.$refs.navTitle.offsetHeight
        } else {
          h = this.$refs.content.offsetHeight
        }
        if (this.contentHeight !== h) {
          this.contentHeight = h
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
// ////////////////////////////////////////////////////////////////////// Slider
#segment-slider-card {
  position: relative;
}

.slider-card {
  position: relative;
  width: 100%;
  height: 100%;
  padding: toRem(26) toRem(18);
  align-items: center;
  transition: height ease 200ms;
  @include borderRadius_Medium;
  @include oceanBorderGradient;
  border-width: 2px;
  background-color: $blackSapphire;
  color: $white;
  @include small {
    border: none;
    padding-top: 0;
  }
}

.transition-content {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  overflow: hidden;
}

.heading,
.description {
  @include small {
    padding: 0 2.875rem;
  }
}

.heading {
  font-size: 1rem;
  font-weight: 600;
  line-height: leading(15, 16);
  letter-spacing: 0.26px;
  margin-bottom: toRem(30);
  @include small {
    font-size: toRem(13);
    line-height: leading(15, 13);
    margin-bottom: 1rem;
  }
}

.description {
  font-size: toRem(14);
  font-weight: 400;
  line-height: leading(21, 14);
  letter-spacing: 0.25px;
  margin-bottom: 2rem;
  @include small {
    font-size: toRem(13);
    line-height: leading(19, 13);
    letter-spacing: 0.18px;
    margin-bottom: 0.75rem;
  }
}

.view-all-wrapper {
  position: absolute;
  top: calc(100% - 0.5rem);
  left: calc(50% + 0.5rem);
  transform: translateX(-50%);
}

.view-all-button {
  z-index: 1;
}

.logo-wrapper {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin-bottom: 1.25rem;
  img {
    &:first-child {
      margin-left: 0;
    }
    &:last-child {
      margin-right: 0;
    }
  }
  > img {
    margin: 0 0.75rem;
    width: toRem(37);
    height: toRem(37);
  }
}

.title-between-buttons {
  display: none;
}

.slide-nav {
  display: none;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-top: 1rem;
  margin-bottom: 0.75rem;
  @include small {
    position: absolute;
    top: 1.875rem;
    left: 1.125rem;
    width: calc(100% - 2.25rem);
    display: flex;
    justify-content: space-between;
    margin-top: 0;
  }
}

.nav-arrow {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  border: none;
  &:focus {
    outline: none;
  }
  ::v-deep .icon {
    display: flex;
    width: toRem(9.5);
    height: toRem(13);
  }
}

.noselect {
  user-select: none;
}
// ////////////////////////////////////////////////////////////////// Animations
.transition-content {
  animation: fadein 500ms ease;
}

@keyframes fadein {
  0%   { opacity: 0; }
  100% { opacity: 1; }
}

.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all .25s ease;
}
.slide-fade-enter-from,
.slide-fade-leave-to {
  opacity: 0;
}
</style>
