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

    <div :class="['card-list', { 'grid-noBottom': foldColumns }]">
      <div
        v-for="(card, index) in cardlist"
        :key="`${index}-${card.name}`"
        :class="[{ 'col-6': foldColumns }, { folded: foldColumns }]">
        <ProjectCard
          format="list-view"
          :title="card.name"
          :description="card.description"
          :logo="card.icon"
          :tags="card.tags"
          :url="card.website.startsWith('http') || card.website === '' ? card.website : `https:${card.website}`"
          :social="card.social"
          :style="{ animationDelay: `${30 * index}ms` }" />
      </div>
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
// ===================================================================== Imports
import ProjectCard from '@/components/ProjectCard'
import Button from '@/modules/zero/core/components/Button'
import ArrowBoxIcon from '@/components/icons/ArrowBoxIcon'

// ====================================================================== Export
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
    },
    foldColumns: {
      type: Boolean,
      required: false,
      default: false
    },
    limit: {
      type: [Number, Boolean],
      required: false,
      default: false
    },
    randomize: {
      type: Boolean,
      required: false,
      default: false
    }
  },

  data () {
    return {
      cardlist: []
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
  },

  mounted () {
    const list = this.limit ? this.cards.slice(0, this.limit) : this.cards
    if (this.randomize) {
      this.cardlist = this.$ShuffleArray(list)
    } else {
      this.cardlist = list
    }
  }
}
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
.card-list-block {
  &.left {
    @include small {
      margin-left: -0.5rem;
      margin-right: -3px;
    }
  }
  &.right {
    @include small {
      margin-right: -0.5rem;
      margin-left: -3px;
    }
  }
}

.heading {
  display: flex;
  font-size: toRem(22);
  font-weight: 600;
  line-height: leading(36, 22);
  letter-spacing: 0.48px;
  background: linear-gradient(146deg, #60C1FF 0%, #5DE3F2 100%);
  @include gradientText;
  margin-bottom: 0.625rem;
  @include small {
    font-size: toRem(18);
    line-height: leading(24, 18);
  }
}

.heading-button {
  ::v-deep .button-content {
    @include small {
      padding-top: 0;
      padding-bottom: 0;
    }
    .icon {
      display: flex;
      transform: translateY(-1px);
      @include small {
        transform: none;
      }
    }
  }
}

.card-list-cta {
  ::v-deep .button-content {
    padding: 0;
    .text {
      @include small {
        font-size: toRem(14);
        line-height: leading(21, 14);
        letter-spacing: 0.48px;
      }
    }
  }
}

.folded {
  &:nth-child(odd) {
    ::v-deep .project-card {
      margin-left: -0.5rem;
      margin-right: -3px;
    }
  }
  &:nth-child(even) {
    ::v-deep .project-card {
      margin-right: -0.5rem;
      margin-left: -3px;
    }
  }
}

</style>
