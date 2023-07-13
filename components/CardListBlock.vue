<template>
  <div class="card-list-block">

    <h5
      v-if="cardListHeading"
      class="heading">
      <span>{{ cardListHeading }}</span>
      <Button
        v-if="cta"
        tag="nuxt-link"
        :to="cta.path"
        class="heading-button">
        <template #icon-before>
          <ArrowBoxIcon />
        </template>
      </Button>
    </h5>

    <div class="card-list">
      <ProjectCard
        v-for="(card, index) in cards"
        :key="`${index}-${card.name}`"
        format="list-view"
        :title="card.name"
        :description="card.description.long"
        :logo="card.logo.icon"
        :tags="card.tags"
        :url="`https:${card.primaryCta.url}`"
        :style="{ animationDelay: `${30 * index}ms` }" />
    </div>

    <Button
      v-if="cta"
      type="green"
      tag="nuxt-link"
      :to="cta.path"
      :text="cta.text"
      class="card-list-cta">
      <template #icon-after>
        →
      </template>
    </Button>

  </div>
</template>

<script>
import ProjectCard from '@/components/ProjectCard'
import Button from '@/modules/zero/core/components/Button'
import ArrowBoxIcon from '@/components/icons/ArrowBoxIcon'

export default {
  name: 'CardListBlock',

  components: {
    ProjectCard,
    Button,
    ArrowBoxIcon
  },

  props: {
    cards: {
      type: Array,
      required: true,
      default: () => []
    },
    heading: {
      type: String,
      required: false,
      default: ''
    },
    listTotal: {
      type: [Number, Boolean],
      required: false,
      default: false
    },
    cta: {
      type: [Object, Boolean],
      reqiured: false,
      default: false
    }
  },

  computed: {
    cardListHeading () {
      if (this.heading && this.listTotal) {
        return `${this.heading} (${this.listTotal})`
      }
      if (this.heading) {
        return this.heading
      }
      return false
    }
  }
}
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
.heading {
  display: flex;
  font-size: toRem(22);
  font-weight: 600;
  line-height: leading(36, 22);
  letter-spacing: 0.48px;
  background: linear-gradient(146deg, #60C1FF 0%, #5DE3F2 100%);
  @include gradientText;
  margin-bottom: 0.625rem;
}

.heading-button {
  ::v-deep .button-content {
    .icon {
      display: flex;
      transform: translateY(-1px);
    }
  }
}

.card-list-cta {
  ::v-deep .button-content {
    padding: 0;
  }
}
</style>
