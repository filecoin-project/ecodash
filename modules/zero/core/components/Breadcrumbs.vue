<template>
  <section :class="['breadcrumbs', { hidden: !links.length }]">

    <nuxt-link
      v-for="link in links"
      :key="`breadcrumb-${link.label}`"
      :to="link.disabled ? '' : { path: link.href, query: link.query || false }"
      :href="link.disabled ? '' : link.href + $CompileQueryString(link.query)"
      :disabled="link.disabled"
      :target="link.target"
      class="breadcrumb-link focus-visible">
      <span class="label">{{ link.label }}</span>
      <span class="divider">/</span>
    </nuxt-link>

    <div class="breadcrumb-button">
      <span>{{ current }}</span>
    </div>

  </section>
</template>

<script>
// ====================================================================== Export
export default {
  name: 'Breadcrumbs',

  props: {
    breadcrumbs: {
      type: Array,
      required: true,
      default: () => []
    }
  },

  data () {
    return {
      links: [],
      current: ''
    }
  },

  watch: {
    breadcrumbs () {
      this.setBreadcrumbs()
    }
  },

  mounted () {
    this.setBreadcrumbs()
  },

  methods: {
    setBreadcrumbs () {
      this.links = this.breadcrumbs.filter(item => item.type === 'nuxt-link')
      const current = this.breadcrumbs.find(item => item.type === 'div')
      this.current = current ? current.label : ''
    }
  }
}
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
.breadcrumbs {
  display: flex;
  padding-top: 1.125rem;
  font-size: toRem(13);
  font-weight: 450;
  line-height: leading(18, 13);
  letter-spacing: 0.26px;
  &.hidden {
    visibility: hidden;
  }
}

.breadcrumb-link,
.breadcrumb-button {
  position: relative;
  display: inline-block;
  font-size: inherit;
  &:last-child {
    .divider {
      display: none;
    }
  }
}

.breadcrumb-link {
  display: inline-flex;
  .label {
    text-decoration: underline transparent;
    text-underline-offset: $underlineSpacing;
    transition: text-decoration-color 250ms ease-out;
    &:hover {
      transition: text-decoration-color 250ms ease-in;
      text-decoration-color: currentColor;
    }
  }
  .label,
  .divider {
    color: #1890FD;
    font-size: 13px;
    font-style: normal;
    font-weight: 450;
    line-height: 18px;
    letter-spacing: 0.26px;
  }
}

.divider {
  margin: 0 0.25rem;
  color: inherit;
}
</style>
