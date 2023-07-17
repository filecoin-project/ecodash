<template>
  <section class="breadcrumbs">

    <component
      :is="link.type"
      v-for="(link, index) in breadcrumbs"
      :key="index"
      :to="link.disabled ? '' : { path: link.href, query: link.query || false }"
      :href="link.disabled ? '' : link.href + $CompileQueryString(link.query)"
      :disabled="link.disabled"
      :target="link.target"
      :class="[link.type === 'div' ? 'breadcrumb-button' : 'breadcrumb-link', 'focus-visible']">
      <span class="label">{{ link.label }}</span>
      <span class="divider">/</span>
    </component>

  </section>
</template>

<script>
// ====================================================================== Export
export default {
  name: 'Breadcrumbs',

  props: {
    breadcrumbs: {
      type: Array,
      required: true
    }
  }
}
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
.breadcrumbs {
  padding-top: 1.125rem;
  font-size: toRem(13);
  font-weight: 450;
  line-height: leading(18, 13);
  letter-spacing: 0.26px;
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
