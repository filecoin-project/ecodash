<template>
  <header id="site-header">

    <Navigation />

    <Hero />

  </header>
</template>

<script>
// ====================================================================== Import
import Navigation from '@/components/Navigation'
import Hero from '@/components/Hero'

// ====================================================================== Export
export default {
  name: 'SiteHeader',

  components: {
    Navigation,
    Hero
  }
}
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
#site-header {
  padding-top: $navigationHeight;
}
</style>
