<template>
  <header id="site-header">

    <Navigation />

    <!-- <Hero /> -->

  </header>
</template>

<script>
// ====================================================================== Import
import Navigation from '@/components/Navigation'

// ====================================================================== Export
export default {
  name: 'SiteHeader',

  components: {
    Navigation
  }
}
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
#site-header {
  padding-top: $navigationHeight;
}
</style>
