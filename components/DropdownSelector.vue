<template>
  <button
    v-if="options.length > 0"
    id="dropdown-selector"
    ref="selector"
    v-click-outside="closeAllSelect"
    :class="['dropdown-wrapper', 'focus-visible', { closed }]"
    :style="{ minWidth: `${maxLength * 10}px` }"
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

        <div class="dropdown-toggle">
          <slot name="dropdown-icon"></slot>
        </div>
      </div>

      <div class="dropdown-root" :style="{ height: `${height}px` }">

        <div ref="dropdownList" class="dropdown-list">
          <template v-for="option in options">
            <div
              :key="`div-option-${option.label}`"
              :value="option.label"
              :class="['dropdown-item', 'focus-visible', { highlighted: (selected === option.label) }]"
              :tabindex="closed ? -1 : 0"
              @click="optionSelected(option)"
              @keyup.enter.self="optionSelected(option)">
              {{ option.label }}
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

// ====================================================================== Export
export default {
  name: 'DropdownSelector',

  props: {
    label: {
      type: String,
      required: false,
      default: 'Sort by: '
    },
    dropdownOptions: {
      type: Object,
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
      selected: 'Alphabetical (A-Z)',
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
      return Object.values(this.dropdownOptions)
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
      this.dropdownListHeight = this.$refs.dropdownList.clientHeight
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
::selection {
  color: none;
  background: none;
}

::-moz-selection {
  color: none;
  background: none;
}

.dropdown-wrapper {
  @include borderRadius_Medium;
  position: relative;
  white-space: nowrap;
  font-weight: 400;
  line-height: 1.7;
  cursor: pointer;
  z-index: 1000;
  transition: 250ms ease-out;
}

.dropdown-button {
  display: block;
  .button-inner {
    position: relative;
    display: flex;
    justify-content: space-between;
    padding: 0.25rem 1.0rem;
    z-index: 20;
    label {
      margin-right: 0.25rem;
    }
  }
}

.dropdown-toggle {
  transform: translateY(-5%);
  opacity: 0.5;
  margin-left: 0.5rem;
  transition: 250ms ease-out;
  &:hover {
    cursor: pointer;
    opacity: 1.0;
  }
}

.dropdown-root {
  @include borderRadius_Medium;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  overflow: hidden;
  z-index: 10;
  transition: height 250ms ease-in-out;
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
  width: 100%;
  text-align: right;
  box-sizing: border-box;
}

.dropdown-item {
  padding: 0.25rem 1.0rem;
  width: 100%;
  white-space: normal;
  &:not(.highlighted) {
    text-decoration: underline transparent;
    text-underline-offset: $underlineSpacing;
    cursor: pointer;
    transition: text-decoration-color 250ms ease-out;
    &:hover {
      transition: text-decoration-color 250ms ease-in;
      text-decoration-color: currentColor;
    }
  }
}

.highlighted {
  cursor: default;
}
</style>