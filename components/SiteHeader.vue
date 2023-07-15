<template>
  <header id="site-header">

    <Navigation />

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
  color: white;
  @include small {
    padding-top: toRem(82);
  }
}
</style>
