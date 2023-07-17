<template>
  <section class="hero-header">
    <div class="grid">

      <div
        class="col-6_sm-12"
        data-push-left="off-3_sm-0"
        data-push-right="off-3_sm-0">
        <Button
          v-if="backButton"
          type="blue"
          tag="nuxt-link"
          :to="backButton.url"
          :text="backButton.text"
          class="back-button">
          <template #icon-before>
            →
          </template>
        </Button>
        <div class="heading">
          {{ heading }}
        </div>
      </div>

      <div
        class="col-8_sm-12"
        data-push-left="off-2_sm-0"
        data-push-right="off-2_sm-0">
        <div v-if="subheading" class="subheading">
          {{ subheading }}
        </div>
        <Button
          v-if="headingCta"
          type="blue"
          tag="nuxt-link"
          to="https://example.com"
          text="Add your project"
          class="heading-cta">
          <template #icon-after>
            →
          </template>
        </Button>
      </div>

      <div
        v-if="categories"
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
            <div class="col-3_sm-10" data-push-left="off-1" data-push-right="off-0_sm-1">
              <div class="category-title">
                {{ activeCategory.label }}
              </div>
            </div>
            <div class="col-7_sm-10" data-push-left="off-0_sm-1" data-push-right="off-1">
              <div class="category-info">
                <span>{{ activeCategory.description }}</span>
                <Button
                  tag="a"
                  type="green"
                  text="Add your project"
                  to="https://example.com"
                  class="category-title-cta">
                  <template #icon-after>
                    →
                  </template>
                </Button>
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
      type: [Array, Boolean],
      required: true,
      default: () => []
    },
    backButton: {
      type: [Object, Boolean],
      required: false,
      default: false
    },
    headingCta: {
      type: Boolean,
      required: false,
      default: false
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
      if (this.categories && route.params.category) {
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
  @include small {
    padding-top: toRem(80);
    padding-bottom: toRem(37);
  }
}

.back-button,
.heading-cta {
  display: block;
  width: fit-content;
  margin: auto;
  ::v-deep .text,
  ::v-deep .icon {
    @include small {
      font-size: toRem(14);
      line-height: line-height(21, 14);
    }
  }
}

.back-button {
  margin-bottom: 0.125rem;
  ::v-deep .icon {
    transform: translateY(2px) rotate(180deg);
  }
  &:hover {
    ::v-deep .text {
      transform: none;
    }
    ::v-deep .icon {
      transform: translateY(2px) rotate(180deg) translateX(0.5rem);
    }
  }
}

.heading-cta {
  margin-top: toRem(14);
  @include small {
    margin-top: 0.125rem;
    height: toRem(21);
  }
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
  @include small {
    font-size: 1.5rem;
    line-height: leading(36, 24);
  }
}

.subheading,
.category-info {
  font-size: toRem(18);
  font-weight: 400;
  line-height: leading(30, 18);
  letter-spacing: 0.36px;
  @include small {
    font-size: toRem(14);
    line-height: leading(21, 14);
  }
}

.active-category {
  position: relative;
  padding-top: toRem(48);
  padding-bottom: toRem(38);
  margin-top: 3rem;
  @include small {
    padding-top: 2rem;
    padding-bottom: toRem(26);
  }
  &:before {
    content: '';
    position: absolute;
    top: -3px;
    left: -3px;
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
  @include small {
    padding-top: 1rem;
    flex-direction: column;
    align-items: center;
  }
}

.category-button {
  width: fit-content;
  @include small {
    &:not(:last-child) {
      margin-bottom: 0.5rem;
    }
  }
}

.category-title {
  font-size: toRem(22);
  font-weight: 600;
  line-height: leading(36, 22);
  letter-spacing: 0.48px;
  padding-left: 0.5rem;
  @include small {
    font-size: toRem(18);
    line-height: leading(24, 18);
    padding-left: 0;
    margin-bottom: 1.25rem;
  }
}

.category-info {
  padding-left: 3rem;
  @include small {
    padding-left: 0;
  }
  span {
    display: block;
    margin-bottom: 0.625rem;
    @include small {
      margin-bottom: 1.25rem;
      font-size: toRem(14);
      line-height: leading(21, 14);
    }
  }
}

.category-title-cta {
  display: block;
  width: fit-content;
  ::v-deep .button-content {
    padding: 0;
    @include small {
      .text,
      .item-after {
        font-size: toRem(14);
        line-height: leading(21, 14);
      }
    }
  }
}

</style>
