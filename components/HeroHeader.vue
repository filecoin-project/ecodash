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
              :class="['category-button', { active: activeCategory && activeCategory.slug === category.slug }]" />
          </div>
        </div>
      </div>

      <div
        v-if="activeCategory"
        class="col-12"
        data-push-left="off-0"
        data-push-right="off-0">
        <div class="active-category">
          <div class="grid-noGutter">
            <div class="col-3" data-push-left="off-1">
              <div class="category-title">
                {{ activeCategory.label }}
              </div>
              <Button
                tag="a"
                text="Add your project"
                to="https://example.com"
                class="category-title-cta">
                <template #icon-after>
                  →
                </template>
              </Button>
            </div>
            <div class="col-7" data-push-right="off-1">
              <div class="category-info">
                {{ activeCategory.description }}
              </div>
            </div>
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
      if (route.params.category) {
        const active = this.categories.find(cat => cat.slug === route.params.category)
        return active
      }
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

.subheading,
.category-info {
  font-size: toRem(18);
  font-weight: 400;
  line-height: leading(30, 18);
  letter-spacing: 0.36px;
}

.active-category {
  position: relative;
  padding: toRem(48) 0;
  margin-top: 3rem;
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border: 3px solid;
    border-image-slice: 1 !important;
    border-width: 3px;
    border-image-source: linear-gradient(25deg, #213C4F, #406380);
    box-shadow: 0px 0px 15px 3px #213140;
    opacity: 0.6;
  }
}

.category-list {
  display: flex;
  justify-content: center;
  padding-top: toRem(43);
}

.category-title {
  font-size: toRem(22);
  font-weight: 600;
  line-height: leading(36, 22);
  letter-spacing: 0.48px;
  padding-left: 0.5rem;
}

.category-title-cta {
  ::v-deep .button-content {
    height: unset;
  }
  ::v-deep .text,
  ::v-deep .item-after {
    background: linear-gradient(90deg, rgba(96,193,255,1) 0%, rgba(93,227,242,1) 100%);
    @include gradientText;
  }
}

.category-info {
  padding-left: 3rem;
}
</style>
