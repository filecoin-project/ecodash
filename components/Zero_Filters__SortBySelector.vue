<template>
  <button
    v-if="options.length > 0"
    id="sort-by-selector"
    ref="dropdownButton"
    v-click-outside="closeAllSelect"
    :class="['dropdown-wrapper', 'focus-visible', { closed }]"
    :style="{ minWidth: `${maxLength * 10}px` }"
    @keyup.enter="toggleDropDown()">

    <div
      :class="['dropdown-button', { 'gradient': !closed }]"
      @click="toggleDropDown()">

      <label>
        {{ label }}
      </label>

      <span>
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

    <div class="shadow" :style="{ height: `${height}px` }"></div>

  </button>
</template>

<script>
// ===================================================================== Imports
import { mapGetters, mapActions } from 'vuex'
import CloneDeep from 'lodash/cloneDeep'

// ====================================================================== Export
export default {
  name: 'SortBySelector',

  props: {
    label: {
      type: String,
      required: false,
      default: 'Sort by: '
    },
    sortOptions: {
      type: Object,
      required: true
    },
    defaultSort: {
      type: String,
      required: true
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
      return Object.values(this.sortOptions)
    },
    maxLength () {
      return this.options.reduce((a, b) => a.label.length > b.label.length ? a : b).label.length
    }
  },

  watch: {
    collection: {
      deep: true,
      handler (col) {
        if (col.mutation !== 'sorted') {
          this.options.forEach((item) => {
            if (item.label === this.selected) {
              if (item.type === 'alphabetical') {
                this.sortAlphabetically(item.key, item.direction)
              } else if (item.type === 'number') {
                this.sortNumerically(item.sortNumber, item.direction)
              }
            }
          })
        }
      }
    }
  },

  mounted () {
    if (this.$route.query['sort-by']) {
      Object.keys(this.sortOptions).forEach((option) => {
        if (this.sortOptions[option].slug === this.$route.query['sort-by']) {
          this.optionSelected(this.sortOptions[option])
        }
      })
    } else {
      this.optionSelected(this.sortOptions[this.defaultSort])
    }
    this.$nextTick(() => { this.setHeights() })
    this.resize = () => { this.setHeights() }
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
    setHeights () {
      this.dropdownListHeight = this.$refs.dropdownList.clientHeight
      this.$emit('setwidth', this.$refs.dropdownButton.clientWidth)
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
      if (obj.type === 'alphabetical') {
        this.sortAlphabetically(obj.key, obj.direction)
      } else if (obj.type === 'number') {
        this.sortNumerically(obj.sortNumber, obj.direction)
      }
      this.setRouteQuery({
        key: 'sort-by',
        data: obj.slug
      })
      this.$emit('changed', {
        event: 'optionSelected',
        data: {
          label: obj.label,
          slug: obj.slug
        }
      })
    },
    sortAlphabetically (key, mode) {
      if (this.collection.array) {
        const cloned = CloneDeep(this.collection.array)
        if (mode === 'ASC') {
          cloned.sort((a, b) => b[key].localeCompare(a[key]))
        } else if (mode === 'DESC') {
          cloned.sort((a, b) => a[key].localeCompare(b[key]))
        }
        const payload = { type: 'sorted', collection: cloned }
        this.setCollection(payload)
      }
    },
    sortNumerically (key, mode) {
      if (this.collection.array) {
        const cloned = CloneDeep(this.collection.array)
        if (mode === 'ASC') {
          cloned.sort((a, b) => a.sortNumbers[key] - b.sortNumbers[key])
        } else if (mode === 'DESC') {
          cloned.sort((a, b) => b.sortNumbers[key] - a.sortNumbers[key])
        }
        const payload = { type: 'sorted', collection: cloned }
        this.setCollection(payload)
      }
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

#sort-by-selector {
  @include shadow1;
  .button-inner {
    @include fontSize_Small;
    line-height: 1.5;
    align-items: center;
    background-color: $jaguar;
    transition: all 250ms linear;
  }
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
  position: relative;
  display: flex;
  justify-content: space-between;
  padding: 0.25rem 1.0rem;
  z-index: 20;
  background: linear-gradient(75deg, #030307, #030307, #31B4D8 75%);
  background-size: 500% 100%;
  background-position: 0% 0%;
  transition: 0.3s ease-in-out;
  &:hover {
    background-position: 90% 0%;
  }
  &.gradient {
    background: linear-gradient(75deg, #178FFD, #39C0CC);
  }
  label {
    margin-right: 0.25rem;
  }
  label,
  span {
    padding-top: 0.125rem;
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
  position: relative;
  top: 0;
  left: 0;
  width: 100%;
  overflow: hidden;
  z-index: 10;
  transition: height 250ms ease-in-out;
  padding-top: 0;
  color: $blackSapphire;
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
  padding: 0.375rem 1rem;
  width: 100%;
  white-space: normal;
  @include fontSize_Small;
  line-height: $leading_Medium;
  &.highlighted {
    background-color: unset;
    color: $blackSapphire !important;
    @include lightBlueGradient;
  }
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
