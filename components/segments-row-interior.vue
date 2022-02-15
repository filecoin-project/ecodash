<div
  v-for="(item, index) in segments"
  :key="index"
  :class="[setForegrounded(index), { 'displaced-down': (item.size > 40) && item.above }, { 'displaced-up': (item.size > 40) && !item.above }]"
  :style="segmentStyling (item.size, item.above, index)"
  @click="updateParent(index)">

  <template v-if="measured && item.display">

    <span
      v-if="item.above"
      class="segment-label noselect avoid-me"
      :style="`width: ${Math.min(item.chars, 15) * 8}px; top: ${item.pos - 50}px`">
      {{ item.label }}
    </span>

    <span
      v-else
      class="segment-label noselect avoid-me"
      :style="`width: ${Math.min(item.chars, 15) * 8}px; top: ${-1 * (item.pos - 50) + segH / 2}px`">
      {{ item.label }}
    </span>

    <div
      v-if="item.above"
      class="segment-line avoid-me"
      :style="`height: ${Math.abs(item.pos - 56) - item.labelHeight - 18}px; transform: rotate(180deg);`">
    </div>

    <div
      v-else
      class="segment-line avoid-me"
      :style="`top: ${segH}px; height: ${Math.abs(item.pos - 56) - 26}px`">
    </div>

  </template>

  <div v-if="selectedSeg === index" class="dots"></div>

</div>




<!-- rough -->
<div class="indicator slot-4" :style="`width: ${0}px; left: ${item.segment.ihw}px; top: calc(${30 + Math.random() * 20}px + 2rem);`">
  <span v-if="item.segment.below" class="label">{{item.label.text}}</span>
</div>
