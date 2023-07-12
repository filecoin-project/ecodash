<template>
  <section class="hero-header">
    <div class="grid">

      <div
        class="col-6"
        data-push-left="off-3"
        data-push-right="off-3">
        <div class="heading">
          {{ heading }}
        </div>
      </div>

      <div
        class="col-8"
        data-push-left="off-2"
        data-push-right="off-2">
        <div class="subheading">
          {{ subheading }}
        </div>
      </div>

      <div
        class="col-12"
        data-push-left="off-0"
        data-push-right="off-0">
        <div class="category-selector">
          <div class="category-list">
            <Button
              v-for="(category, i) in categories"
              :key="`category-${i}`"
              type="outline"
              tag="nuxt-link"
              :text="category.label"
              :to="`/category/${category.slug}`"
              :class="['category-button', { active: activeCategory && activeCategory === category.slug }]" />
          </div>
        </div>
      </div>

    </div>
  </section>
</template>

<script>
import Button from '@/modules/zero/core/components/Button'

export default {
  name: 'HeroHeader',

  components: {
    Button
  },

  props: {
    content: {
      type: Object,
      required: true,
      default: () => ({})
    },
    categories: {
      type: Array,
      required: true,
      default: () => []
    }
  },

  computed: {
    heading () {
      return this.content.heading
    },
    subheading () {
      return this.content.subheading
    },
    activeCategory () {
      const route = this.$route
      if (route.params.category) { return route.params.category }
      return false
    }
  }
}
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
.hero-header {
  padding-top: toRem(85);
  padding-bottom: toRem(78);
}

.heading,
.subheading {
  text-align: center;
}

.heading {
  font-size: toRem(40);
  font-weight: 600;
  line-height: leading(55, 44);
  letter-spacing: 0.8px;
}

.subheading {
  font-size: toRem(18);
  font-weight: 400;
  line-height: leading(30, 18);
  letter-spacing: 0.36px;
}

.category-list {
  display: flex;
  justify-content: center;
  padding-top: toRem(43);
}
</style>
