<template>
  <component
    :is="tag"
    :to="getTo()"
    :href="getHref()"
    :target="getTarget()"
    :class="['button', getType()]"
    :disabled="disabled"
    @click="clickHandler">

    <LoaderTripleDot :class="{ show: loading }" />

    <div :class="['button-content', { hide: loading }]">

      <div v-if="iconBefore" class="icon">
        <slot name="icon-before"></slot>
      </div>

      <p v-if="text" :class="['text', { 'item-after': iconBefore }]">
        {{ text }}
      </p>

      <div v-if="iconAfter" class="item-after">
        <slot name="icon-after"></slot>
      </div>

    </div>

  </component>
</template>

<script>
// ===================================================================== Imports
import { mapGetters, mapActions } from 'vuex'

import LoaderTripleDot from '@/modules/zero/core/components/LoaderTripleDot'

// ===================================================================== Functions
const checkSlots = (instance) => {
  const slots = instance.$slots
  if (slots.hasOwnProperty('icon-before') && slots['icon-before']) { instance.iconBefore = true }
  if (slots.hasOwnProperty('icon-after') && slots['icon-after']) { instance.iconAfter = true }
}

// ====================================================================== Export
export default {
  name: 'Button',

  components: {
    LoaderTripleDot
  },

  props: {
    type: { // A, B, C, D
      type: String,
      required: false,
      default: 'A'
    },
    tag: { // button or nuxt-link
      type: String,
      required: false,
      default: 'button'
    },
    to: {
      type: [String, Boolean],
      required: false,
      default: false
    },
    target: {
      type: [String, Boolean],
      required: false,
      default: false
    },
    loader: {
      type: [String, Boolean],
      required: false,
      default: false
    },
    text: {
      type: String,
      required: false,
      default: ''
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false
    }
  },

  data () {
    return {
      iconBefore: false,
      iconAfter: false
    }
  },

  computed: {
    ...mapGetters({
      loaders: 'core/loaders'
    }),
    loading () {
      return this.loaders.find(obj => obj === this.loader)
    }
  },

  mounted () {
    checkSlots(this)
  },

  methods: {
    ...mapActions({
      addLoader: 'core/addLoader'
    }),
    clickHandler () {
      const loader = this.loader
      if (typeof loader === 'string') {
        this.addLoader(loader)
      }
      this.$emit('clicked')
    },
    getTo () {
      return this.tag === 'nuxt-link' ? this.to : false
    },
    getHref () {
      return this.tag === 'a' ? this.to : false
    },
    getTarget () {
      const tag = this.tag
      return (tag === 'nuxt-link' || tag === 'a') ? this.target : false
    },
    getType () {
      return `type-${this.type}`
    }
  }
}
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
.button {
  position: relative;
  cursor: pointer;
  &:hover {
    .item-after {
      transform: translateX(0.5rem);
    }
  }
}

.triple-dot-loader,
.button-content {
  width: 100%;
  height: 100%;
}

.triple-dot-loader {
  position: absolute;
  top: 0;
  left: 0;
  opacity: 0;
  &.show {
    opacity: 1;
  }
}

.button-content {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0.5rem;
  &.hide {
    opacity: 0;
  }
}

.text {
  font-size: 1rem;
  font-weight: 400;
  line-height: line-height(36, 16);
  letter-spacing: 0.48px;
}

.item-after {
  transition: 250ms ease;
  margin-left: 0.25rem;
}

.icon {
  display: inline-block;
  height: 0.7rem;
  margin: auto;
}

// /////////////////////////////////////////////////////////////// [Type] Common
.type-navlink,
.type-B,
.type-C,
.type-D {
  border-radius: 0.125rem;
  white-space: nowrap;
  // padding: 0 0.75rem;
  &:not(:disabled) {
    // &:hover {
    //   transform: scale(1.05);
    // }
    // &:focus {
    //   @include focus_BoxShadow_Regular;
    // }
    // &:active {
    //   transform: scale(0.95);
    // }
  }
  &:disabled {
    background-color: $gray300;
    cursor: no-drop;
  }
}

// //////////////////////////////////////////////////////////////////// [Type] A
.type-navlink {
  &:disabled {
    box-shadow: none;
  }
  .text {
    color: $white;
    font-size: 1rem;
    font-style: normal;
    font-weight: 400;
    line-height: 1;
    letter-spacing: 0.32px;
  }
}

// //////////////////////////////////////////////////////////////////// [Type] B
.type-cta {
  @include tripleLayer;
  padding: 0;
  border-radius: 1px;
  transition: 250ms ease;
  box-sizing: border-box;
  &:before,
  &:after {
    border-radius: inherit;
    box-sizing: border-box;
    transition: inherit;
  }
  &:after {
    background-color: $cadmiumBlue;
  }
  .button-content {
    position: relative;
    left: -1px;
    top: 0;
    transition: inherit;
    border-radius: inherit;
    padding: toRem(4.5) toRem(12);
    background: linear-gradient(244deg, #39C0CC 0%, #178FFD 100%);
  }
  .text {
    color: $blackSapphire;
    font-weight: 600;
    font-size: 0.875rem;
    line-height: leading(18, 14);
    margin-left: 0.625rem;
    white-space: nowrap;
  }
  .item-after {
    transform: none !important;
  }
  .icon {
    display: flex;
    width: toRem(10);
    height: toRem(10);
  }
  &:hover {
    .button-content {
      left: $bottomLayerOffsetLeft;
      top: $bottomLayerOffsetTop;
    }
    &:after {
      left: $bottomLayerOffsetLeft;
      top: $bottomLayerOffsetTop;
    }
  }
}

// //////////////////////////////////////////////////////////////////// [Type] A
.type-outline {
  position: relative;
  padding: toRem(7) toRem(15);
  margin: 0 0.25rem;
  &:before,
  &:after {
    content: '';
    position: absolute;
    z-index: 1;
    transition: 250ms ease;
  }
  &:before {
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, rgba(96,193,255,1) 0%, rgba(93,227,242,1) 100%);
    border-radius: toRem(20);
  }
  &:after {
    top: 1px;
    left: 1px;
    width: calc(100% - 2px);
    height: calc(100% - 2px);
    background: $blackSapphire;
    border-radius: toRem(19);
    opacity: 1;
  }
  .button-content {
    position: relative;
    z-index: 2;
    padding: 0;
  }
  .text {
    font-size: toRem(14);
    font-weight: 500;
    line-height: leading(18, 14);
    letter-spacing: 0.5px;
    transition: background 500ms ease;
    background: linear-gradient(
      90deg,
      rgba(255,255,255,1) 0%,
      rgba(255,255,255,1) 33%,
      rgba(96,193,255,1) 66%,
      rgba(93,227,242,1) 100%
    ) 0 0 / 300% 100%;
    background-position: 100%;
    @include gradientText;
  }
  &:hover {
    .text {
      background-position: 0%;
    }
  }
  &.active,
  &:active {
    &:after {
      opacity: 0;
    }
    .text {
      background: none;
      -webkit-text-fill-color: unset;
      color: $blackSapphire;
    }
  }
}

// //////////////////////////////////////////////////////////////////// [Type] A
.type-D {
  color: blue;
  border: 1px solid blue;
  padding: 0 0.375rem;
  height: auto;
}
</style>