<template>
  <div :class="['filter-bar', { focused }]">

    <div class="icon-container">
      <Button
        type="button"
        class="button-icon"
        @clicked="$emit('on-submit')">
        <template #icon-before>
          <slot name="icon" />
        </template>
      </Button>
    </div>

    <input
      :value="filterValue"
      :placeholder="placeholder"
      type="text"
      :class="['input', 'focus-visible']"
      @input="handleInput"
      @focus="focused = true"
      @blur="focused = false"
      @keydown.enter="$emit('on-submit')">

  </div>
</template>

<script>
// ===================================================================== Imports
import { mapActions } from 'vuex'

import Button from '@/modules/zero/core/components/Button'

// ====================================================================== Export
export default {
  name: 'FilterBar',

  components: {
    Button
  },

  props: {
    filterValue: {
      type: String,
      required: true
    },
    placeholder: {
      type: String,
      required: false,
      default: 'search the ecosystem'
    },
    action: {
      type: String,
      required: false,
      default: 'emit'
    }
  },

  data () {
    return {
      focused: false
    }
  },

  created () {
    this.setFilterValue('')
  },

  methods: {
    ...mapActions({
      setFilterValue: 'core/setFilterValue'
    }),
    handleInput (e) {
      const action = this.action
      const value = e.target.value
      if (action === 'emit') {
        this.$emit('setFilterValue', value)
      } else if (action === 'store') {
        this.setFilterValue(value)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
.filter-bar {
  position: relative;
  display: flex;
  flex-direction: row-reverse;
  align-items: center;
  height: 2rem;
  width: toRem(132);
  border-radius: toRem(1);
  padding: toRem(9);
  box-sizing: border-box;
  transition: width 250ms ease, border 250ms ease;
  border: solid 1px rgba($white, 1);
  @include small {
    height: toRem(29);
    padding: toRem(2) toRem(9);
    border: solid 1px rgba($white, 0);
  }
  &:before,
  &:after {
    content: '';
    position: absolute;
    z-index: 1;
    border-radius: inherit;
    box-sizing: border-box;
    transition: opacity 250ms ease;
  }
  &:before {
    width: calc(100% + 2px);
    height: calc(100% + 2px);
    top: -1px;
    left: -1px;
    opacity: 0;
    @include lightOceanGradient;
  }
  &:after {
    background-color: $blackSapphire;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
  }
  &:hover,
  &:focus-within {
    border: solid 1px rgba($white, 0);
    &:before {
      opacity: 1;
    }
  }
  &:hover,
  &:active,
  &.focused {
    .button-icon {
      ::v-deep .icon {
        @include small {
          transform: scale(1);
        }
      }
    }
  }
  &.focused {
    width: toRem(200);
  }
}

.icon-container {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  transition: 250ms ease-out;
  width: toRem(13);
  height: toRem(13);
  margin-left: 0.375rem;
  ::v-deep svg {
    line,
    circle {
      stroke: $white;
    }
  }
}

.button-icon {
  ::v-deep .icon {
    display: block;
    margin: 0;
    width: toRem(13);
    height: toRem(13);
    transition: 200ms ease;
    @include small {
      transform: scale(1.46);
    }
    svg {
      width: 100%;
      height: 100%;
    }
  }
}

.input {
  position: relative;
  z-index: 2;
  @include borderRadius_Medium;
  width: 100%;
  height: 100%;
  font-size: toRem(14);
  font-weight: $fontWeight_Regular;
  line-height: 1;
  letter-spacing: 0.32px;
  transition: 250ms ease-out;
  -webkit-appearance: none;
  @include small {
    color: rgba(255, 255, 255, 0.80);
    font-size: toRem(13);
    font-style: italic;
    line-height: leading(21, 13);
    letter-spacing: 0.36px;
  }
  &:hover, &:active, &:focus {
    transition: 250ms ease-in;
    font-style: normal;
    box-shadow: none !important;
  }
  &::placeholder {
    color: white;
    opacity: 0;
  }
  &:focus{
    &::placeholder {
      opacity: 0.7;
    }
  }
}
</style>
