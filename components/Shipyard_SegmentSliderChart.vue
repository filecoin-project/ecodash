<template>
  <div id="segment-slider-chart" ref="chartFlex" class="chart-container">
    <div ref="segmentsCtn" class="segments-container">

      <div class="chart-title">
        <h3>{{ mobileChartTitle }}</h3>
      </div>

      <div
        v-for="item in segments"
        :key="`dummy-${item.label.text}`"
        ref="dummyLabels"
        class="measure">
        {{ item.label.text }}
      </div>

      <div
        v-if="measured"
        ref="segmentsRow"
        :class="['segments-row', measured ? '' : 'fixed-for-measuring']">

        <div
          v-for="(item, index) in segments"
          :key="index"
          class="segment-wrapper"
          :style="getSegmentStyle(item, index)"
          @click="updateParent(index)">

          <div
            :class="['indicator', 'slot-1', index % 2 === 0 ? 'above' : 'below']"
            :style="`width: ${item.segment.s1.length}px; left: ${item.segment.ihw}px; top: ${getLabelOffset(item, index, 'first')}px;`">
            <template v-if="item.segment.s1.occupied">
              <div class="label">
                {{item.label.text}}
                <div
                  class="stem"
                  :style="`height: ${tiers.first}px;`">
                </div>
              </div>

            </template>
          </div>
          <div
            :class="['indicator', 'slot-2', index % 2 === 0 ? 'above' : 'below']"
            :style="`width: ${item.segment.s2.length}px; left: ${item.segment.ihw}px; top: ${getLabelOffset(item, index, 'second')}px;`">
            <template v-if="item.segment.s2.occupied">
              <span class="label">{{item.label.text}}</span>
              <div
                class="stem"
                :style="`height: 10px;`">
              </div>
            </template>
          </div>
          <div
            :class="['indicator', 'slot-3', index % 2 === 0 ? 'above' : 'below']"
            :style="`width: ${item.segment.s3.length}px; left: ${item.segment.ihw}px; top: ${getLabelOffset(item, index, 'third')}px;`">
            <template v-if="item.segment.s3.occupied">
              <span class="label">{{item.label.text}}</span>
              <div
                class="stem"
                :style="`height: 10px;`">
              </div>
            </template>
          </div>

          <div
            :class="['block-segment', setForegrounded(index), { 'displaced-down': (item.size > 40) && index % 2 === 0 }, { 'displaced-up': (item.size > 40) && index % 2 === 0 }]">
          </div>

        </div>

      </div>

    </div>
  </div>
</template>

<script>
// ===================================================================== Imports
import { mapGetters, mapActions } from 'vuex'
import CloneDeep from 'lodash/cloneDeep'

// =================================================================== Functions
const calculateSegmentAndLabelData = (instance, next) => {
  const dummies = instance.$refs.dummyLabels

  for (let i = 0; i < dummies.length; i++) {
    const rect = dummies[i].getBoundingClientRect()
    const dimensions = {
      width: rect.width,
      height: rect.height,
      offset: Math.random() * instance.random
    }
    Object.assign(instance.segments[i].label, dimensions)

    const num = instance.segments[i].count
    const percent = num / instance.totalProjects
    instance.segments[i].segment = {
      percent: percent * 100,
      ihw: (percent * 572) / 2
    }
  }

  return next()
}

const calculateSlotsData = (instance, next) => {

  const len = instance.segments.length
  for (let i = 0; i < len; i++) {
    const items = instance.segments

    const hasFirstNeighbor = i < len - 2
    items[i].segment.s1 = {
      length: hasFirstNeighbor ? (
        items[i].segment.ihw +
        items[i + 1].segment.ihw * 2 +
        items[i + 2].segment.ihw
      ) : 1000,
      occupied: false
    }

    const hasSecondNeighbor = i < len - 4
    items[i].segment.s2 = {
      length: hasSecondNeighbor ? (
        items[i].segment.ihw +
        items[i + 1].segment.ihw * 2 +
        items[i + 2].segment.ihw * 2 +
        items[i + 3].segment.ihw * 2 +
        items[i + 4].segment.ihw
      ) : 1000,
      occupied: false
    }

    const hasThirdNeighbor = i < len - 6
    items[i].segment.s3 = {
      length: hasThirdNeighbor ? (
        items[i].segment.ihw +
        items[i + 1].segment.ihw * 2 +
        items[i + 2].segment.ihw * 2 +
        items[i + 3].segment.ihw * 2 +
        items[i + 4].segment.ihw * 2 +
        items[i + 5].segment.ihw * 2 +
        items[i + 6].segment.ihw
      ) : 1000,
      occupied: false
    }
  }

  instance.measured = true
  return next()
}

const positionFirstTierLabels = (instance, n, next) => {
  const segments = instance.segments
  for (let i = n; i < segments.length; i = i + 2) {
    if (segments[i].label.width < segments[i].segment.s1.length) {
      segments[i].segment.s1.occupied = true
    }
  }
  return next()
}

const positionSecondTierLabels = (instance, n, next) => {
  const segments = instance.segments
  const modulo = segments.length
  const start = (segments.length - 1 - (!modulo ? n : n ? 0 : 1 ))
  for (let i = start; n <= i; i = i - 2) {
  // for (let i = n; i < segments.length; i = i + 2) {

    const h = Math.max(i - 2, n)
    const j = Math.min(i + 2, start)

    if (
      segments[i].label.width < segments[i].segment.s2.length
      && !segments[i].segment.s1.occupied
      && !segments[h].segment.s2.occupied && !segments[j].segment.s2.occupied
      && !segments[j].segment.s3.occupied
    ) {
      segments[i].segment.s2.occupied = true
    }
  }
  return next()
}

const positionThirdTierLabels = (instance, n) => {
  const segments = instance.segments
  const modulo = segments.length
  const start = (segments.length - 1 - (!modulo ? n : n ? 0 : 1 ))
  for (let i = n; i < segments.length; i = i + 2) {

    const g = Math.max(i - 4, n)
    const h = Math.max(i - 2, n)
    const j = Math.min(i + 2, start)
    const k = Math.min(i + 4, start)

    if (
      segments[i].label.width < segments[i].segment.s3.length
      && !segments[i].segment.s1.occupied
      && !segments[h].segment.s2.occupied && !segments[i].segment.s2.occupied
      && !segments[g].segment.s3.occupied && !segments[h].segment.s3.occupied && !segments[j].segment.s3.occupied && !segments[k].segment.s3.occupied
    ) {
      segments[i].segment.s3.occupied = true
    }
  }
}

const reOrderBasedOnScore = (instance, next) => {
  const segments = instance.segments
  const ordered = []
  for (let i = 0; i < segments.length; i++) {
    const score = -1 * (segments[i].segment.ihw - segments[i].label.width)
    instance.segments[i].score = score
  }

  const ascending = CloneDeep(instance.segments)
  ascending.sort((a, b) => a.score - b.score)

  let last, first
  for (let i = 0; i < ascending.length; i++) {
    if (ascending[i].hasOwnProperty('priority')) {
      if (ascending[i].priority === 'last') {
        last = ascending.splice(i, 1)
        break
      }
    }
  }
  for (let i = 0; i < ascending.length; i++) {
    if (ascending[i].hasOwnProperty('priority')) {
      if (ascending[i].priority === 'first') {
        first = ascending.splice(i, 1)
        break
      }
    }
  }

  const l = ascending.length
  const s = Math.ceil(l / 2)

  const firstHalf = ascending.splice(0, s)
  ascending.reverse();

  for (let i = 0; i < s; i = i + 2) {
    ordered.push(ascending[i])
    if (ascending?.[i + 1]) {
      ordered.push(ascending[i + 1])
    }

    ordered.push(firstHalf[i])
    if (firstHalf?.[i + 1]) {
      ordered.push(firstHalf[i + 1])
    }
  }
  ordered.reverse()

  if (first) { ordered.unshift(first[0]) }
  if (last) { ordered.push(last[0]) }

  instance.measured = true
  instance.segments = ordered
  const col = CloneDeep(instance.segments)
  instance.setSegmentCollection(col)
  return next()
}

// ====================================================================== Export
export default {
  name: 'ShipyardSegmentSliderChart',

  props: {
    chartItems: {
      type: Array,
      default: () => []
    },
    selectedSeg: {
      type: Number,
      default: 0
    }
  },

  data () {
    return {
      segH: 30,
      segments: this.chartItems,
      measured: false,
      timeOutFunction: null,
      random: 10,
      tiers: {
        first: 30,
        second: 60,
        third: 90
      }
    }
  },

  computed: {
    ...mapGetters({
      siteContent: 'global/siteContent',
      segmentCollection: 'core/segmentCollection'
    }),
    segmentSliderContent () {
      return this.siteContent.index.page_content.segment_slider
    },
    mobileChartTitle () {
      return this.segmentSliderContent.mobile_chart_title
    },
    totalProjects () {
      let total = 0
      for (let i = 0; i < this.chartItems.length; i++) {
        total = total + this.chartItems[i].count
      }
      return total
    }
  },

  watch: {
    selectedSeg (val) {
      if (this.$Countly) {
        const segment = this.segmentCollection[val]
        this.$Countly.trackEvent('Segment Chart | Segment Clicked', {
          label: segment.label,
          slug: segment.slug
        })
      }
    }
  },

  mounted () {
    this.$nextTick(() => {
      calculateSegmentAndLabelData(this, () => {
        reOrderBasedOnScore(this, () => {
          calculateSlotsData(this, () => {

            positionFirstTierLabels(this, 0, () => {
              positionSecondTierLabels(this, 0, () => {
                positionThirdTierLabels(this, 0)
              })
            })

            positionFirstTierLabels(this, 1, () => {
              positionSecondTierLabels(this, 1, () => {
                positionThirdTierLabels(this, 1)
              })
            })

          })
        })
      })
    })
  },

  methods: {
    ...mapActions({
      setSegmentCollection: 'core/setSegmentCollection'
    }),
    updateParent (seg) {
      this.$emit('update-slider', seg)
    },
    setForegrounded (ind) {
      return (this.selectedSeg === ind) ? 'segment-foreground' : 'segment-background'
    },
    getSegmentStyle (item, i) {
      return `width: ${item.segment.percent}%; z-index: ${this.segments.length - i};`
    },
    getLabelOffset(item, i, tier) {
      return ((-1 * this.tiers[tier]) - item.label.offset) * (i % 2 === 0 ? 1 : -1)
    }
  }
}
</script>

<style lang="scss" scoped>

#segment-slider-chart {
  background-color: transparent !important;
  .main-container {
    flex-wrap: nowrap;
  }
  @include xlarge {
    background-color: transparent;
    .main-container {
      flex-wrap: wrap-reverse;
    }
    .segments-container {
      // background-color: rgba(0, 255, 255, 0.1);
      .chart-title {
        color: $blackSapphire;
      }
    }
    .chart-container {
      margin-bottom: 4rem;
    }
  }
  @include small{
    // background-color: $white;
    .main-container {
      @include oceanBorderGradient;
    }
    .chart-container {
      margin-bottom: 2rem;
    }
  }
  .block-segment {
    @include whiteBorderBack;
  }
  .segment-line {
    background-color: $white; // *** originally white
    width: 1px;
    z-index: -1;
  }
  .segments-row {
    &:before {
      content: '';
      position: absolute;
      height: 4px;
      width: calc(100% - 1rem);
      background-color: $white; // **** originally white
      left: 0%;
    }
    @include medium {
      &:before {
        width: 100%;
      }
    }
  }
}

// ///////////////////////////////////////////////////////////////////// General
.chart-container {
  position: relative;
  flex: 3 1 42.75rem;
}

.segments-container {
  @include borderRadius_Medium;
  position: relative;
  padding: 0 2.5rem;
  @include medium {
    padding: 0 6rem;
    padding-bottom: 7rem;
  }
  @include small {
    padding: 0 3rem;
    padding-bottom: 0;
  }
  @include tiny {
    min-width: 16rem;
    padding: 0 2rem;
    padding-bottom: 0;
  }
}

.chart-title {
  visibility: hidden;
  padding: 4.75rem 0;
  @include medium {
    padding: 2.5rem 0;
  }
  @include small {
    visibility: visible;
    padding: 2rem 0;
  }
}

.segments-row {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  // background-color: rgba(255, 0, 0, 0.2);
  height: 4rem;
  &.fixed-for-measuring {
    width: 572px;
  }
}

.segments-large {
  min-height: 24rem;
  top: 0px;
}

.segments-tiny {
  min-height: 10rem;
  top: 1.5rem;
}

.space-segment {
  width: 7px;
}

// ///////////////////////////////////////////////// Segments functional styling
.segment-foreground {
  font-weight: bold;
  &:after {
    background-position: 100% 0% !important;
  }
}

.segment-wrapper {
  position: relative;
  height: 2rem;
  border: 2px solid transparent;
  box-sizing: border-box;
  .segment-id {
    font-size: 5px;
    line-height: 1;
  }
  .indicator {
    position: absolute;

    &.below {
      transform: translateY(2rem);
      .stem {
        transform: translateY(-4px) rotate(180deg);
        top: 0;
      }
    }

    .label {
      position: absolute;
      top: -0.5rem;
      left: 0;
      font-size: 10pt;
      color: $white;
      font-family: $font_Secondary;
      font-weight: $fontWeight_Regular;
      font-size: $fontSize_Small;
      letter-spacing: 0.015em;
      line-height: $leading_Tiny;
      text-align: left;
      white-space: normal;
      z-index: -1000;
      @include small {
        display: none;
      }
    }

    .stem {
      position: absolute;
      border-left: 1px solid $white;
      left: 0;
      transform-origin: top;
      transform: translateY(4px);
      z-index: -1000;
    }
  }
  // .slot-1 {
  //   border-top: 1px solid blue;
  //   .ihw {
  //     color: blue;
  //   }
  // }
  // .slot-2 {
  //   border-top: 1px solid green;
  //   .ihw {
  //     color: green;
  //   }
  // }
  // .slot-3 {
  //   border-top: 1px solid red;
  //   .ihw {
  //     color: red;
  //   }
  // }
}

.measure {
  display: inline-block;
  position: relative;
  font-family: $font_Secondary;
  font-weight: $fontWeight_Regular;
  letter-spacing: 0.015em;
  line-height: $leading_Tiny;
  font-size: $fontSize_Mini !important;
  max-width: 120px;
  // white-space: nowrap;
  margin: 0 !important;
  color: red;
  opacity: 0.0;
  font-size: 11pt;
  // transform: translateY(-6rem);
}

// /////////////////////////////////////////////////// Segment aesthetic stlying
.block-segment {
  @include borderRadius_Small;
  position: relative;
  height: 100%;
  width: 100%;
  top: 0px;
  left: 0px;
  background-color: transparent !important;
  cursor: pointer;
  transition: all 250ms linear;
  z-index: 0;
  @include tripleLayer;
  &:before {
    top: 3px;
    left: 3px;
    background-color: $daytonaBlue !important;
    transition: inherit;
    z-index: -1;
  }
  &:after {
    top: 6px;
    left: 6px;
    background: linear-gradient(90deg, $paleCornflower, $blizzard, $azure, $ocean);
    background-size: 300% 300%;
    background-position: 0% 0%;
    transition: all 0.3s linear;
    z-index: 1;
  }
  &:hover {
    top: 0px;
    left: 0px;
    &:after {
      top: 0px;
      left: 0px;
    }
    &:before {
      top: 0px;
      left: 0px;
    }
    .dots {
      top: 0px;
      left: 0px;
    }
  }
  .dots {
    position: absolute;
    top: 7px;
    left: 7px;
    width: 100%;
    height: 100%;
    background-image: url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='100%25' height='100%25'><defs><pattern id='bg' patternUnits='userSpaceOnUse' width='4' height='4'><g><circle cx='1' cy='1' r='1.0' fill='%23fff'/></g></pattern></defs><rect transform='translate(2 2)' width='99%25' height='98%25' fill='url(%23bg)'/></svg>");
    z-index: 10;
    transition: inherit;
  }
}



.segment-line {
  position: absolute;
  left: 50%;
  width: 1px;
  transform-origin: top left;
  @include small {
    display: none;
  }
}

.noselect {
  user-select: none;
}
</style>
