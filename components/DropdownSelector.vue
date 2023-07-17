<template>
  <button
    v-if="options.length > 0"
    ref="selector"
    v-click-outside="closeAllSelect"
    :class="['dropdown-selector', 'dropdown-wrapper', 'focus-visible', { closed }]"
    @keyup.enter="toggleDropDown()">

    <div
      class="dropdown-button"
      @click="toggleDropDown()">

      <div
        ref="dropdownInner"
        class="button-inner">
        <label>
          {{ label }}
        </label>

        <span v-if="displaySelected">
          {{ selected }}
        </span>

        <div :class="['dropdown-toggle', { closed }]">
          <slot name="dropdown-icon"></slot>
        </div>
      </div>

      <div class="dropdown-root" :style="{ height: `${height}px` }">

        <div ref="dropdownList" class="dropdown-list">
          <template v-for="option in options">
            <div
              :key="`dropdown-option-${option.label}`"
              class="dropdown-item-wrapper">
              <Button
                tag="a"
                :to="option.disabled ? '' : option.href"
                :href="option.disabled ? '' : option.href"
                :disabled="option.disabled"
                :target="option.target"
                :tabindex="closed ? -1 : 0"
                :text="option.label"
                :class="['dropdown-item', 'focus-visible', { highlighted: (selected === option.label) }]">
                <template #icon-after>
                  ↗
                </template>
              </Button>
            </div>
          </template>
        </div>

      </div>

    </div>

    <div class="shadow" :style="{ height: `${height}px` }"></div>

  </button>
</template>

<script>
// ===================================================================== Imports
import { mapGetters, mapActions } from 'vuex'

import Button from '@/modules/zero/core/components/Button'

// ====================================================================== Export
export default {
  name: 'DropdownSelector',

  components: {
    Button
  },

  props: {
    label: {
      type: String,
      required: false,
      default: 'Sort by: '
    },
    dropdownOptions: {
      type: Array,
      required: true
    },
    displaySelected: {
      type: Boolean,
      required: false,
      default: true
    },
    modal: {
      type: Boolean,
      required: false,
      default: false
    }
  },

  data () {
    return {
      closed: true,
      selected: false,
      dropdownButtonHeight: 0,
      dropdownListHeight: 0,
      height: 0,
      resize: false
    }
  },

  computed: {
    ...mapGetters({
      collection: 'core/collection'
    }),
    options () {
      return this.dropdownOptions
    },
    maxLength () {
      return this.options.reduce((a, b) => a.label.length > b.label.length ? a : b).label.length
    }
  },

  watch: {
    modal () {
      this.setDimensions()
    }
  },

  mounted () {
    this.setDimensions()
    this.resize = () => { this.setDimensions() }
    window.addEventListener('resize', this.resize)
  },

  beforeDestroy () {
    if (this.resize) { window.removeEventListener('resize', this.resize) }
  },

  methods: {
    ...mapActions({
      setRouteQuery: 'filters/setRouteQuery',
      setCollection: 'core/setCollection'
    }),
    setDimensions () {
      this.dropdownListHeight = this.$refs.dropdownList.clientHeight + 9
      this.$emit('setwidth', this.$refs.selector.clientWidth + 14)
    },
    toggleDropDown () {
      this.closed = !this.closed
      if (this.closed) {
        this.height = 0
      } else {
        this.height = this.dropdownListHeight
      }
      this.$emit('changed', {
        event: 'toggleDropdown',
        data: {
          state: !this.closed ? 'open' : 'closed'
        }
      })
    },
    closeAllSelect () {
      this.height = 0
      if (!this.closed) {
        this.$emit('changed', {
          event: 'toggleDropdown',
          data: {
            state: 'closed'
          }
        })
      }
      this.closed = true
    },
    optionSelected (obj) {
      this.selected = obj.label
      this.closeAllSelect()
      this.$emit('changed', {
        event: 'optionSelected',
        data: {
          label: obj.label,
          slug: obj.slug
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
::selection {
  color: none;
  background: none;
}

::-moz-selection {
  color: none;
  background: none;
}

.dropdown-selector {
  width: toRem(165);
  &:hover {
    cursor: pointer;
    .button-inner {
      label, span {
        cursor: pointer;
        background: -webkit-linear-gradient(#39C0CC, #178FFD);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
      .dropdown-toggle {
        ::v-deep svg {
          path {
            stroke: #178FFD;
          }
        }
      }
    }
  }
}

.dropdown-wrapper {
  position: relative;
  cursor: pointer;
  z-index: 1000;
  transition: 250ms ease-out;
}

// ///////////////////////////////////////////////////////////// Dropdown Button
.dropdown-button {
  display: block;
}

.button-inner {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.25rem 1.0rem;
  z-index: 20;
  transition: all 250ms linear;
  label, span {
    margin-right: 0.625rem;
    font-size: 1rem;
    font-style: normal;
    font-weight: 400;
    line-height: 1;
    letter-spacing: 0.32px;
    background: -webkit-linear-gradient(#FFFFFF, #FFFFFF);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    transition: inherit;
    white-space: nowrap;
  }
}

::v-deep .dropdown-toggle {
  display: flex;
  height: toRem(5);
  width: toRem(9);
  transition: 250ms ease-out;
  &:hover {
    cursor: pointer;
    opacity: 1.0;
  }
  &.closed {
    .svg-dropdown {
      path {
        stroke: $white;
      }
    }
  }
  &:not(.closed) {
    transition: 250ms ease-in;
    transform: rotate(-180deg);
    .svg-dropdown {
      path {
        stroke: $blackSapphire;
      }
    }
  }
}

// /////////////////////////////////////////////////////////////// Dropdown Menu
.dropdown-root {
  position: absolute;
  top: 100%;
  right: 0;
  width: 100%;
  overflow: hidden;
  z-index: 10;
  transition: height 250ms ease-in-out;
  padding-top: 0;
  color: $blackSapphire;
  margin-top: 5px;
  border-radius: 1px;
  &:before,
  &:after {
    content: '';
    position: absolute;
    z-index: 1;
    border-radius: inherit;
  }
  &:before {
    top: 0;
    left: 0;
    width: calc(100% - 5px);
    height: calc(100% - 6px);
    background: linear-gradient(244deg, #39C0CC 0%, #178FFD 100%);
  }
  &:after {
    top: 1px;
    left: 1px;
    width: calc(100% - 7px);
    height: calc(100% - 8px);
    background: $blackSapphire;
  }
  @include small {
    right: unset;
    left: 1rem;
    top: calc(100% + 0.625rem);
  }
}

.shadow {
  @include borderRadius_Medium;
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  pointer-events: none;
  filter: drop-shadow(0 0 0.3rem rgba(73, 73, 73, 0.2));
  opacity: 0;
  z-index: 0;
  transition: 250ms ease-out;
}

.dropdown-list {
  position: relative;
  width: calc(100% - 5px);
  text-align: right;
  box-sizing: border-box;
  padding: toRem(9) 0;
  border: solid 1px $white;
  border-radius: 1px;
  transform: translate(5px, 5px);
  z-index: 2;
}

.dropdown-item-wrapper {
  padding: 0 toRem(14);
  &:hover {
    background: linear-gradient(244deg, #39C0CC 0%, #178FFD 100%);
  }
  .dropdown-item {
    width: 100%;
    white-space: normal;
    color: $white;
    text-align: right;
    font-size: 1rem;
    font-weight: 400;
    line-height: leading(29, 16);
    letter-spacing: 0.32px;
    &:hover {
      color: $blackSapphire;
    }
    ::v-deep .button-content {
      padding: 0;
      justify-content: flex-end;
      .item-after {
        margin-left: toRem(6);
      }
      .text,
      .item-after {
        @include small {
          font-size: 1rem;
          line-height: leading(36, 16);
          letter-spacing: 0.32px;
        }
      }
    }
  }
}

.highlighted {
  cursor: default;
}
</style>
