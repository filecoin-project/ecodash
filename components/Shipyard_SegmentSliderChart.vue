<template>
  <div id="segment-slider-chart" ref="chartFlex" class="chart-container">
    <div ref="segmentsCtn" class="segments-container">

      <div class="chart-title">
        <h3>{{ mobileChartTitle }}</h3>
      </div>

      <template>
        <div
          v-for="item in segments"
          :key="`dummy-${item.label.text}`"
          ref="dummyLabels"
          class="measure">
          {{ item.label.text }}
        </div>
      </template>

      <div
        v-if="measured"
        ref="segmentsRow"
        :class="['segments-row', measured ? '' : 'fixed-for-measuring']">

        <div
          v-for="(item, index) in segments"
          :key="index"
          :class="['test-segment', setForegrounded(index)]"
          :style="getSegmentStyle(item)"
          @click="updateParent(index)">

          <span class="segment-id">{{item.label.text}}</span>

          <!-- labels above segments -->
          <div :class="['indicator', 'slot-1', index % 2 === 0 ? 'above' : 'below']" :style="`width: ${item.segment.s1.length}px; left: ${item.segment.ihw}px; top: ${(-30 - Math.random() * random) * (index % 2 === 0 ? 1 : -1) }px;`">
            <span v-if="item.segment.s1.occupied" class="label">{{item.label.text}}</span>
            <span class="ihw">{{item.segment.s1.length}}</span>
          </div>
          <div :class="['indicator', 'slot-2', index % 2 === 0 ? 'above' : 'below']" :style="`width: ${item.segment.s2.length}px; left: ${item.segment.ihw}px; top: ${(-60 - Math.random() * random) * (index % 2 === 0 ? 1 : -1) }px;`">
            <span v-if="item.segment.s2.occupied" class="label">{{item.label.text}}</span>
            <span class="ihw">{{item.segment.s2.length}}</span>
          </div>
          <div :class="['indicator', 'slot-3', index % 2 === 0 ? 'above' : 'below']" :style="`width: ${item.segment.s3.length}px; left: ${item.segment.ihw}px; top: ${(-90 - Math.random() * random) * (index % 2 === 0 ? 1 : -1) }px;`">
            <span v-if="item.segment.s3.occupied" class="label">{{item.label.text}}</span>
            <span class="ihw">{{item.segment.s3.length}}</span>
          </div>

          <!-- labels below segments -->


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
// const handleLoad = (instance) => {
//   instance.handleResize()
// }

// const initResize = (instance) => {
//   clearTimeout(instance.timeOutFunction)
//   instance.timeOutFunction = setTimeout(() => { instance.handleResize() }, 250)
// }

const calculateSegmentAndLabelData = (instance, next) => {
  const dummies = instance.$refs.dummyLabels

  for (let i = 0; i < dummies.length; i++) {
    const rect = dummies[i].getBoundingClientRect()
    const dimensions = {
      width: rect.width,
      height: rect.height
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
  for (let i = n; i < segments.length; i = i + 2) {

    const h = Math.max(i - 2, 0)
    const j = Math.min(i + 2, segments.length)

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

const positionThirdTierLabels = (instance, n, next) => {
  const segments = instance.segments
  for (let i = n; i < segments.length; i = i + 2) {

    const g = Math.max(i - 4, 0)
    const h = Math.max(i - 2, 0)
    const j = Math.min(i + 2, segments.length)
    const k = Math.min(i + 4, segments.length)

    if (
      segments[i].label.width < segments[i].segment.s3.length
      && !segments[i].segment.s1.occupied
      && !segments[h].segment.s2.occupied && !segments[i].segment.s2.occupied
      && !segments[g].segment.s3.occupied && !segments[h].segment.s3.occupied && !segments[j].segment.s3.occupied && !segments[k].segment.s3.occupied
    ) {
      segments[i].segment.s3.occupied = true
    }
  }

  return next()
}

const positionRemainingLabels = (instance) => {
  // const segments = instance.segments
  // for (let i = 0; i < segments.length - 2; i++) {
  //   if (
  //     !segments[i].segment.s1.occupied
  //     && !segments[i].segment.s2.occupied
  //     && !segments[i].segment.s3.occupied
  //   ) {
  //     segments[i].segment.below = true
  //   }
  // }
  console.log(instance.segments)
}

const reOrderBasedOnScore = (instance, next) => {
  const labels = document.querySelectorAll('.measure')
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

  for (let i = 0; i < s; i++) {
    ordered.push(ascending[l - i - 1])
    if (i !== l - i - 1) {
      ordered.push(ascending[i])
    }
  }

  ordered.reverse()

  if (first) { ordered.unshift(first[0]) }
  if (last) { ordered.push(last[0]) }

  for (let i = 0; i < ordered.length - 1; i++) {
    const sum = (ordered[i].above ? 1 : 0) + (ordered[i + 1].above ? 1 : 0)
    if (sum !== 1) {
      if (ordered[i].pos > ordered[i + 1].pos) {
        const p = ordered[i].pos
        ordered[i].pos = ordered[i + 1].pos
        ordered[i + 1].pos = p
        ordered[i].offset = ordered[i].pos
        ordered[i + 1].offset = ordered[i + 1].pos
      }
    }
  }

  instance.measured = true
  instance.segments = ordered
  const col = CloneDeep(instance.segments)
  instance.setSegmentCollection(col)
  return next()
}

// const doNotOverlap = (item1, item2, lookahead) => {
//   const rect1 = item1.getBoundingClientRect()
//   const rect2 = item2.getBoundingClientRect()
//   return (
//     rect1.right < rect2.left ||
//     rect1.left > rect2.right ||
//     rect1.bottom + lookahead < rect2.top ||
//     rect1.top + lookahead > rect2.bottom
//   )
// }
//
// const removeMatchingLabel = (instance, label) => {
//   const len = instance.segments.length
//   for (let i = 0; i < len; i++) {
//     if (instance.segments[i].label === label) {
//       instance.segments[i].display = false
//     }
//   }
// }

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
      resize: false,
      random: 10
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
                positionThirdTierLabels(this, 0, () => {
                  positionRemainingLabels(this)
                })
              })
            })

            positionFirstTierLabels(this, 1, () => {
              positionSecondTierLabels(this, 1, () => {
                positionThirdTierLabels(this, 1, () => {
                  positionRemainingLabels(this)
                })
              })
            })

          })
        })
      })
    })
    // this.resize = () => {
    //   initResize(this)
    //   console.log(this.$refs.segmentsRow.getBoundingClientRect().width)
    // }
    // window.addEventListener('resize', this.resize)
    // initResize(this)
  },

  beforeDestroy () {
    if (this.resize) { window.removeEventListener('resize', this.resize) }
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
    setMinOffsets (next) {
      for (let ind = 0; ind < this.segments.length; ind++) {
        this.segments[ind].pos = Math.min(-80, this.segments[ind].pos)
      }
      return next()
    },
    reduceOffset (amt, repeats, next) {
      if (repeats > 0) {
        const labels = document.getElementsByClassName('segment-label')
        for (let i = 0; i < this.segments.length; i++) {
          const overlaps = []
          const dir = this.segments[i].above ? amt : (-1 * amt)
          for (let j = 0; j < this.segments.length; j++) {
            if (labels[i] && labels[j] && j !== i) {
              overlaps.push(doNotOverlap(labels[i], labels[j], dir))
            }
          }
          if (overlaps.every(Boolean)) {
            this.segments[i].pos = Math.min(this.segments[i].pos + amt, -20 - this.segments[i].labelHeight)
          }
        }
        const num = repeats - 1
        window.requestAnimationFrame(() => { this.reduceOffset(amt, num, next) })
      } else {
        next()
      }
    },
    dropOverLappingLabels () {
      const labels = document.getElementsByClassName('segment-label')
      const targets = document.getElementsByClassName('avoid-me')
      const overlaps = []
      for (let i = 0; i < labels.length; i++) {
        for (let j = 0; j < targets.length; j++) {
          if (!doNotOverlap(labels[i], targets[j], 0) && targets[j] !== labels[i]) {
            overlaps.push(i)
            break
          }
        }
      }
      if (overlaps.length) {
        const ind = overlaps.pop()
        removeMatchingLabel(this, labels[ind].innerText)
        window.requestAnimationFrame(this.dropOverLappingLabels)
      }
    },
    handleResize () {
      if (window.matchMedia('(max-width: 64rem)').matches) {
        this.$refs.segmentsCtn.classList.remove('segments-large')
        this.$refs.segmentsCtn.classList.add('segments-tiny')
      } else {
        this.$refs.segmentsCtn.classList.remove('segments-tiny')
        this.$refs.segmentsCtn.classList.add('segments-large')
      }
      const len = this.segments.length
      for (let i = 0; i < len; i++) {
        this.segments[i].pos = this.segments[i].offset - 10
        this.segments[i].display = true
      }
      this.reduceOffset(12, 4, () => {
        this.dropOverLappingLabels()
        this.$nextTick(() => { this.$emit('chart-mounted') })
      })
    },
    segmentStyling (size, above, index) {
      let top = 0
      if (size > 40) { top = this.segH / 2 * (above ? 1 : -1) }
      return `width: ${size}%; height: ${this.segH * (size > 40 ? 2 : 1)}px; top: ${top}px; z-index: ${this.segments.length - index};`
    },
    getSegmentStyle (item) {
      return `width: ${item.segment.percent}%;`
    }
  }
}
</script>

<style lang="scss" scoped>

#segment-slider-chart {
  background-color: white;
  .main-container {
    flex-wrap: nowrap;
  }
  @include xlarge {
    // background-color: transparent;
    .main-container {
      flex-wrap: wrap-reverse;
    }
    .segments-container {
      background-color: rgba(0, 255, 255, 0.1);
      .chart-title {
        color: $blackSapphire;
      }
    }
    .chart-container {
      margin-bottom: 4rem;
    }
  }
  @include small{
    background-color: $white;
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
    background-color: black; // *** originally white
    width: 1px;
    z-index: -1;
  }
  .segment-label {
    @include cardText;
    letter-spacing: 0.015em;
    line-height: $leading_Tiny;
    color: black;
  }
  .segments-row {
    &:before {
      content: '';
      position: absolute;
      height: 1px;
      width: calc(100% - 1rem);
      background-color: rgba(0, 0, 0, 0.3); // **** originally white
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
  // add gaps between segments
  // > div {
  //   margin: 2px;
  // }
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
  background-color: rgba(255, 0, 0, 0.2);
  height: 4rem;
  &.fixed-for-measuring {
    width: 572px;
  }
  // add gaps between segments
  // > div {
  //   margin: 2px;
  // }
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

// //////////////////////////////////////////////////////////////////// Segments
.segment-foreground {
  font-weight: bold;
  &:after {
    background-position: 100% 0% !important;
  }
}

.test-segment {
  position: relative;
  height: 2rem;
  background-color: blue;
  border: 1px solid black;
  opacity: 0.4;
  box-sizing: border-box;
  .segment-id {
    font-size: 5px;
    line-height: 1;
  }
  .indicator {
    position: absolute;
    .ihw {
      position: absolute;
      font-size: 4px;
    }
    .label {
      position: absolute;
      top: -1rem;
      left: 0;
      font-size: 10pt;
      color: black;
    }
    &.below {
      transform: translateY(2rem);
    }
  }
  .slot-1 {
    border-top: 1px solid blue;
    .ihw {
      color: blue;
    }
  }
  .slot-2 {
    border-top: 1px solid green;
    .ihw {
      color: green;
    }
  }
  .slot-3 {
    border-top: 1px solid red;
    .ihw {
      color: red;
    }
  }
}

.block-segment {
  @include borderRadius_Small;
  position: relative;
  max-width: 20%;
  min-width: 7px;
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

.measure,
.segment-label {
  white-space: normal;
  padding: 0px;
  // font-size: 10pt;
  text-align: left;
  transform: translateX(-3px);
  @include small {
    display: none;
  }
}

.measure {
  display: inline-block;
  position: relative;
  max-width: 120px;
  margin: 0 !important;
  color: black;
  opacity: 0.0;   // ************ INVISIBLE *************
  font-size: 11pt;
}

.segment-label {
  position: absolute;
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
