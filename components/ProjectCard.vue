<template>
  <div :class="['project-card', format]">
    <div class="card-inner-wrapper">

      <div class="thumbnail">
        <img :src="$relativity(`/images/projects/${logo}`)" :alt="imageAlt" />
      </div>

      <div class="content">
        <p class="title">
          <span>{{ title }}</span>
        </p>
        <div :class="['description', { expanded }, { 'clip': !blockDescription }]">
          <span>{{ description }}</span>
          <span v-if="tagString" class="tags">{{ tagString }}</span>
        </div>

        <div class="button-row">
          <Button
            type="outline"
            tag="a"
            text="Go"
            :to="url"
            target="_blank"
            class="external-link">
            <template #icon-after>
              ↗
            </template>
          </Button>
          <Button
            tag="button"
            text="More"
            :class="['see-more', { expanded }]"
            @clicked="toggleExpanded">
            <template #icon-after>
              <SelectorToggle />
            </template>
          </Button>
        </div>

      </div>

    </div>
  </div>
</template>

<script>
// ====================================================================== Import
import Button from '@/modules/zero/core/components/Button'
import SelectorToggle from '@/modules/zero/core/components/icons/SelectorToggle'

// ====================================================================== Export
export default {
  name: 'ProjectCard',

  components: {
    Button,
    SelectorToggle
  },

  props: {
    format: {
      type: String,
      default: 'block-view',
      required: false
    },
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      default: '',
      required: false
    },
    logo: {
      type: String,
      default: '',
      required: false
    },
    url: {
      type: String,
      default: '',
      required: false
    },
    enableImageAlt: {
      type: Boolean,
      default: true,
      required: false
    },
    tags: {
      type: [Array, Boolean],
      default: false,
      required: false
    }
  },

  data () {
    return {
      expanded: false,
      blockDescription: false
    }
  },

  computed: {
    componentType () {
      if (this.navigationBehavior === 0) {
        return 'div'
      } else if (this.navigationBehavior === 1) {
        return 'a'
      }
      return 'NuxtLink'
    },
    navigateToProject () {
      if (this.navigationBehavior === 0) {
        return null
      }
      return `/project/${this.slug}`
    },
    primaryCta () {
      if (this.navigationBehavior === 1) {
        return this.url
      }
      return null
    },
    imageAlt () {
      if (!this.enableImageAlt) {
        return null
      }
      return this.title
    },
    tagString () {
      if (Array.isArray(this.tags)) {
        return `tags: ${this.tags.join(', ')}`
      }
      return false
    }
  },

  watch: {
    expanded (val) {
      if (val) {
        this.blockDescription = true
      } else {
        setTimeout(() => {
          this.blockDescription = false
        }, 250)
      }
    }
  },

  methods: {
    toggleExpanded () {
      this.expanded = !this.expanded
    }
  }
}
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
.project-card {
  position: relative;
  padding: 0.625rem;
  opacity: 0;
  animation: fadein 0.3s 1;
  animation-fill-mode: forwards;
  cursor: pointer;
  border-radius: 2px;
  border: 2px solid #0D222B;
  background: $blackSapphire;
  margin-bottom: 0.625rem;
}

.list-view {
  .card-inner-wrapper {
    position: relative;
    @include borderRadius_Medium;
    display: flex;
    flex-direction: row;
    height: 100%;
  }
  .thumbnail {
    width: toRem(45);
    height: toRem(45);
    margin-right: 0.625rem;
    background-color: $white;
    @include small {
      position: absolute;
      top: 0;
      left: 0;
      width: toRem(40);
      height: toRem(40);
    }
  }
  .content {
    padding-left: 0.625rem;
    width: calc(100% - toRem(55));
    @include small {
      padding-left: 0;
      width: 100%;
    }
  }
  .title {
    font-size: 1rem;
    font-weight: 600;
    line-height: leading(30, 16);
    letter-spacing: 0.36px;
    @include small {
      padding-left: toRem(52);
      font-size: 0.875rem;
      line-height: leading(21, 14);
      height: toRem(40);
      display: flex;
      align-items: center;
      span {
        display: block;
      }
    }
  }
  .description {
    font-size: toRem(14);
    line-height: leading(21, 14);
    letter-spacing: 0.5px;
    max-height: toRem(42);
    transition: max-height 250ms ease;
    overflow: hidden;
    @include small {
      margin-top: 0.625rem;
      font-size: 0.75rem;
      line-height: leading(18, 12);
      max-height: toRem(79);
    }
    &.clip {
      display: -webkit-box;
      -webkit-box-flex: 1;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      @include small {
        -webkit-line-clamp: 4;
      }
    }
    &.expanded {
      max-height: toRem(200);
    }
  }
  .button-row {
    display: flex;
    padding-top: 1rem;
    ::v-deep {
      .button {
        height: toRem(30);
        .text,
        .item-after {
          font-size: toRem(14);
          font-weight: 500;
          line-height: leading(18, 14);
          @include small {
            font-size: 0.75rem;
            line-height: leading(18, 12);
          }
        }
      }
    }
  }
  .external-link {
    display: flex;
    padding: toRem(5) toRem(7);
    &:before,
    &:after {
      border-radius: 1px;
    }
    ::v-deep .text {
      background-position: 0%;
    }
    ::v-deep .item-after {
      transform: scale(0.9);
    }
    &:hover {
      ::v-deep .text {
        background-position: 100%;
      }
      ::v-deep .item-after {
        transform: scale(1.0);
      }
    }
    &:active {
      ::v-deep .item-after {
        color: $blackSapphire;
      }
    }
  }
  .see-more {
    padding: toRem(5) toRem(10);
    ::v-deep .item-after {
      display: flex;
    }
    &:hover {
      ::v-deep .item-after {
        transform: none;
      }
    }
    &.expanded {
      ::v-deep .item-after {
        transform: rotate(-180deg);
      }
    }
  }
}

@keyframes fadein {
  0%   { opacity: 0; }
  100% { opacity: 1; }
}

</style>
