<template>
  <div id="segment-slider-card" class="slider-container">
    <div
      v-hammer:swipe.horizontal="onSwipe"
      class="slider-card"
      :style="cardHeight">

      <div class="slide-nav">
        <button
          class="nav-arrow focus-visible"
          @click="incrementSelection(selectedSeg - 1)">
          <Shipyard_PrevArrowIcon
            width="10"
            height="15" />
        </button>

        <h3
          :key="`${heading}-medium`"
          ref="navTitle"
          class="title-between-buttons transition-content">
          {{ heading }}
        </h3>

        <button
          class="nav-arrow focus-visible"
          @click="incrementSelection(selectedSeg + 1)">
          <Shipyard_NextArrowIcon
            width="10"
            height="15" />
        </button>
      </div>

      <div :key="heading" class="transition-content">
        <div ref="content">
          <div class="title-large-screen">
            <h3>
              {{ heading }}
            </h3>
          </div>

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
        <button
          class="view-all button noselect focus-visible"
          @click="jump2Filters">
          {{ filterToggleButtonText }}
        </button>
      </div>

    </div>
  </div>
</template>

<script>
// ===================================================================== Imports
import { mapGetters, mapActions } from 'vuex'
// ====================================================================== Export
export default {
  name: 'ShipyardSegmentSliderSlider',
  props: {
    selectedSeg: {
      type: Number,
      default: 0
    },
    parentCategory: {
      type: String,
      required: true
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
      default: 200
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
    filterToggleButtonText () {
      return this.siteContent.index.page_content.segment_slider.filter_toggle_button_text
    },
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

.slider-container {
  min-width: 16rem;
  flex: 1 1 10rem;
  display: flex;
  align-items: center;
}
.slider-card {
  position: relative;
  padding: 0.5rem;
  width: 100%;
  min-width: 14rem;
  align-items: center;
  transition: height ease 200ms;
  @include borderRadius_Medium;
  @include oceanBorderGradient;
  @include small {
    border: none;
  }
  h3 {
    font-family: $font_Primary;
    font-size: $fontSize_Small;
    font-weight: $fontWeight_SemiBold;
    letter-spacing: $letter_SpacingRegular;
    line-height: $leading_Small;
    color: $blackSapphire;
    @include leading_Regular;
    font-weight: 500;
    @include small {
      @include fontSize_Small;
    }
  }
}
.transition-content {
  animation: fadein 500ms ease;
}
@keyframes fadein {
  0%   { opacity: 0; }
  100% { opacity: 1; }
}
.title-large-screen {
  margin-bottom: 1rem;
  @include leading_Regular;
  @include medium {
    display: none;
  }
}
.title-between-buttons {
  display: none;
  @include medium {
    display: inline;
  }
}
.description {
  padding: 0 0.25rem;
  margin-bottom: 2rem;
  font-family: $font_Secondary;
  font-size: $fontSize_Small;
  font-weight: $fontWeight_Regular;
  letter-spacing: 0;
  line-height: $leading_Small;
  color: $darkGrey;
  @include small {
    max-width: 50%;
    margin-left: auto;
    margin-right: auto;
  }
  @include tiny {
    max-width: 100%;
    margin-left: auto;
    margin-right: auto;
  }
}
.slide-nav {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-top: 1rem;
  margin-bottom: 0.75rem;
  @include small {
    justify-content: space-between;
    max-width: 50%;
    margin-left: auto;
    margin-right: auto;
  }
  @include tiny {
    max-width: unset;
  }
}
.nav-arrow {
  @include borderRadius_Medium;
  display: flex;
  padding: 0.25rem;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin: 0.5rem;
  border: none;
  font-weight: 900;
  width: 3.75rem;
  @include small {
    width: auto;
  }
  &:focus {
    outline: none;
  }
}
.logo-wrapper {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 80%;
  max-width: 300px;
  margin: 0 auto;
  margin-bottom: 0;
  img {
    &:first-child {
      margin-left: 0;
    }
    &:last-child {
      margin-right: 0;
    }
  }
}
.logo-wrapper {
  > img {
    margin: 0 0.75rem;
    width: auto;
    max-width: 25%;
    max-height: 2.5rem;
  }
}
.view-all-wrapper {
  position: absolute;
  left: 8px;
  right: 0;
  width: 10rem;
  bottom: -1.75rem;
  z-index: 1;
  @include tripleLayer;
  border: 0px;
  @include medium {
    left: calc(50% - 1.75rem);
    bottom: -3rem;
    transform: translateX(-50%);
  }
  &:before {
    margin: 0 auto;
    width: calc(100% - 2px);
    height: calc(100% - 2px);
    top: 5px;
    left: 27px;
    background-color: $jaguar;
  }
  &:after {
    margin: 0 auto;
    width: calc(100% - 2px);
    height: calc(100% - 2px);
    top: 10px;
    left: 32px;
    transition: 250ms ease-out;
    @include oceanBlueGradient;
  }
  .view-all {
    margin: 0 auto;
    padding: 0.25rem 0;
    width: 10rem;
    height: 30px;
    top: 0px;
    left: 36px;
    font-weight: $fontWeight_Medium !important;
    text-align: center;
    transform: translateY(50%);
    transition: 250ms ease-out;
    @include cardText;
    background-color: $jaguar !important;
    border: 2px solid white;
    // @include medium {
    //   transform: translateY(-75%);
    // }
    &:hover {
      transition: 250ms ease-in;
    }
    &:focus {
      outline: none;
    }
  }
  &:hover {
    &:after {
      top: 6px;
      left: 28px;
    }
    button {
      top: -9px;
      left: 28px;
    }
  }
}
.noselect {
  user-select: none;
}
// ////////////////////////////////////////////////////////////////// Animations
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all .25s ease;
}
.slide-fade-enter-from,
.slide-fade-leave-to {
  opacity: 0;
}
</style>
