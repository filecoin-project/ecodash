<template>
  <div class="master-container">

    <SiteHeader />

    <nuxt />

    <section class="section-segment-slider">
      <div class="grid">
        <div class="col-12">
          <h3 class="heading">
            Explore Projects
          </h3>
          <SegmentSlider />
        </div>
      </div>
    </section>

    <SiteFooter />

  </div>
</template>

<script>
// ====================================================================== Import
import SiteHeader from '@/components/SiteHeader'
import SiteFooter from '@/components/SiteFooter'

import SegmentSlider from '@/components/SegmentSlider'

// ====================================================================== Export
export default {
  name: 'LayoutDefault',

  components: {
    SiteHeader,
    SegmentSlider,
    SiteFooter
  }
}
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
.section-segment-slider {
  .heading {
    font-size: toRem(22);
    font-weight: 600;
    line-height: leading(36, 22);
    letter-spacing: 0.48px;
  }
}
</style>
