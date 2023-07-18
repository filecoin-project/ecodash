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
.master-container {
  position: relative;
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: min(calc($containerWidth + 4rem), 100vw);
    height: 100%;
    background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg width='1858' height='1858' viewBox='0 0 1858 1858' fill='none' xmlns='http://www.w3.org/2000/svg'%3e%3cg style='mix-blend-mode:multiply'%3e%3cpath d='M929 0C1442.07 0 1858 415.927 1858 929C1858 1442.07 1442.07 1858 929 1858C415.927 1858 0 1442.07 0 929C0 415.927 415.927 0 929 0Z' fill='url(%23paint0_radial_2266_106157)'/%3e%3c/g%3e%3cdefs%3e%3cradialGradient id='paint0_radial_2266_106157' cx='0' cy='0' r='1' gradientUnits='userSpaceOnUse' gradientTransform='translate(929 929) scale(929)'%3e%3cstop stop-color='%2307070D' stop-opacity='0.796078'/%3e%3cstop offset='1' stop-color='%2307070D' stop-opacity='0.01'/%3e%3c/radialGradient%3e%3c/defs%3e%3c/svg%3e ");
    background-size: min(calc($containerWidth + 4rem), 100vw);
    background-repeat: repeat-y;
  }
}
.section-segment-slider {
  position: relative;
  .heading {
    font-size: toRem(22);
    font-weight: 600;
    line-height: leading(36, 22);
    letter-spacing: 0.48px;
    margin-bottom: 2rem;
    @include small {
      margin-bottom: 1.25rem;
    }
  }
}
</style>
