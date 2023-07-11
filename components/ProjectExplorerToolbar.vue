<template>
  <div id="project-explorer-toolbar">

    <div class="filter-panel-controls">

      <div :class="['button-wrapper', filterButtonFloating, { 'button-active': filterPanelOpen }]">
        <Button
          id="filter-panel-toggle-button"
          type="C"
          :text="filterPanelToggleButtonLabel"
          :class="['focus-visible', { 'active': filterPanelOpen }]"
          @clicked="toggleFilterPanel">
          <template #icon-before>
            <FiltersToggle />
          </template>
        </Button>
      </div>

      <div
        v-if="selectedFiltersCount"
        class="button-wrapper clear-selected">
        <Button
          id="clear-selected-filters-button"
          class="focus-visible"
          type="C"
          :text="clearSelectedFiltersButtonText"
          @clicked="clearSelectedFilters">
          <template #icon-after>
            <CloseIcon />
          </template>
        </Button>
      </div>

    </div>

    <div class="radio-sort-wrapper">

      <div class="relative-wrapper sort-by" :style="`min-width: ${sortByWidth};`">
        <div
          v-if="showSortBySelector"
          :class="['button-wrapper', 'sort-by-wrapper', sortByState]">
          <SortBySelector
            class="sort-by-selector"
            :label="sortDropdownLabel"
            :sort-options="sortOptions"
            :default-sort="defaultSort"
            @changed="sortBySelectorChanged"
            @setwidth="setSortByMinWidth">
            <template #dropdown-icon>
              <SelectorToggle />
            </template>
          </SortBySelector>
        </div>
      </div>

      <div
        v-if="showViewToggleButton"
        id="list-block-toggle-button"
        tabindex="0"
        :class="[{ 'list-view-active': listViewActive }, 'focus-visible']"
        @click="toggleListBlockView"
        @keyup.enter="toggleListBlockView">
        <ListViewIcon class="list-view-icon" />
        <BlockViewIcon class="block-view-icon" />
      </div>

    </div>

  </div>
</template>

<script>
// ===================================================================== Imports
import { mapGetters } from 'vuex'

import BlockViewIcon from '@/components/icons/BlockViewIcon'
import ListViewIcon from '@/components/icons/ListViewIcon'
import CloseIcon from '@/components/icons/CloseIcon'
import SortBySelector from '@/components/SortBySelector'
import SelectorToggle from '@/modules/zero/core/components/icons/SelectorToggle'
import FiltersToggle from '@/modules/zero/core/components/icons/FiltersToggle'

// ====================================================================== Export
export default {
  name: 'ProjectExplorerToolbar',

  components: {
    BlockViewIcon,
    ListViewIcon,
    CloseIcon,
    SortBySelector,
    SelectorToggle,
    FiltersToggle
  },

  props: {
    filterPanelOpen: {
      type: Boolean,
      default: false,
      required: false
    },
    listViewActive: {
      type: Boolean,
      default: false,
      required: false
    }
  },

  data () {
    return {
      sortByState: 'closed',
      sortByWidth: 'unset'
    }
  },

  computed: {
    ...mapGetters({
      siteContent: 'global/siteContent',
      settings: 'global/settings',
      routeQuery: 'filters/routeQuery',
      filterButtonFloating: 'global/filterButtonFloating'
    }),
    sortOptions () {
      return this.siteContent.taxonomy.sort
    },
    defaultSort () {
      return this.settings.visibility.setSort
    },
    sectionFilterContent () {
      return this.siteContent.index.page_content.section_filter
    },
    filterPanelToggleButtonLabel () {
      return this.sectionFilterContent.filter_panel_toggle_button_label
    },
    sortDropdownLabel () {
      return this.sectionFilterContent.sort_dropdown_label
    },
    clearSelectedFiltersButtonText () {
      const clearButtonText = this.sectionFilterContent.filter_panel.clear_button_text
      const count = this.selectedFiltersCount
      return `${clearButtonText.before}${count > 0 ? ` (${count}) ` : ' '}${clearButtonText.after}`
    },
    selectedFiltersCount () {
      if (this.routeQuery.tags) { return this.routeQuery.tags.split(',').length }
      return 0
    },
    showViewToggleButton () {
      if (this.settings.visibility.hideNonDefaultView) { return false }
      return true
    },
    showSortBySelector () {
      if (this.settings.visibility.hideSort) { return false }
      return true
    }
  },

  methods: {
    toggleFilterPanel () {
      this.$emit('toggleFilterPanel', 'filters')
    },
    toggleListBlockView () {
      this.$emit('toggleListBlockView')
    },
    clearSelectedFilters () {
      if (this.$Countly) {
        this.$Countly.trackEvent('Clear Filters Button Clicked', {
          count: this.selectedFiltersCount
        })
      }
      this.$emit('clearSelectedFilters')
    },
    sortBySelectorChanged (change) {
      this.sortByState = change.data.state
      if (this.$Countly) {
        const event = change.event
        const data = change.data
        if (event === 'toggleDropdown') {
          this.$Countly.trackEvent('Sort-By Dropdown Toggled', data)
        } else if (event === 'optionSelected') {
          this.$Countly.trackEvent('Sort-By Option Selected', data)
        }
      }
    },
    setSortByMinWidth (val) {
      this.sortByWidth = val + 'px'
    }
  }
}
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
#project-explorer-toolbar {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 0 0.5rem;
  @include containerMaxMQ {
    padding: 0;
  }
  @include mini {
    flex-direction: column;
  }
}

.button-wrapper {
  position: relative;
  margin-right: 1.5rem;
  transition: all 250ms linear;
  &:before {
    content: '';
    position: absolute;
    top: 0px;
    left: 0px;
    width: calc(100% - 2px);
    height: calc(100% - 2px);
    @include whiteBorderBack;
    background-color: $jaguar;
    transition: inherit;
  }
  &:after {
    content: '';
    position: absolute;
    top: 5px;
    left: 5px;
    width: calc(100% - 2px);
    height: calc(100% - 2px);
    @include whiteBorderBack;
    @include oceanBlueGradient;
    transition: inherit;
  }
  button {
    z-index: 1;
    top: 10px;
    left: 10px;
    min-height: 2.25rem !important;
    @include cardText;
    @include whiteBorderFront;
    border-radius: 0 !important;
    background-color: $jaguar;
    transition: inherit !important;
    .button-content {
      line-height: $leading_Regular;
      color: $white;
      transition: all 250ms linear;
      svg {
        path {
          transition: inherit;
          stroke: $white;
        }
      }
    }
  }
  &.middle {
    &:hover {
      #filter-panel-toggle-button {
        top: 0;
        left: 0;
      }
      &:after {
        top: 0px;
        left: 0px;
      }
    }
    @include small {
      position: fixed !important;
      bottom: 4.1665vw;
      left: 4.1665vw;
      z-index: 10;
    }
  }
  &.clear-selected {
    &:hover {
      #clear-selected-filters-button {
        top: 0;
        left: 0;
      }
      &:after {
        top: 0px;
        left: 0px;
      }
    }
  }
  &.button-active {
    &:before {
      top: 0px;
      left: 0px;
    }
    &:after {
      top: 0px;
      left: 0px;
    }
    button {
      top: 0px;
      left: 0px;
      @include oceanBlueGradient;
    }
  }
}

.button-content {
  color: $white;
  transition: all 250ms linear !important;
}

.relative-wrapper {
  position: relative;
  left: -14px;
  z-index: 100;
}

// //////////////////////////////////////////////// [Button] Filter panel toggle
::v-deep #filter-panel-toggle-button {
  position: relative;
  filter: drop-shadow(0 0 0.3rem rgba(73, 73, 73, 0.2));
  transition: bottom 0ms;
  .button-content {
    padding: 0;
  }
  .item-after, {
    @include fontSize_Small;
  }
  .svg-icon {
    transition: all 250ms linear;
    path {
      stroke: $white;
    }
  }
  &.active {
    color: $blackSapphire;
    .svg-icon {
      path {
        stroke: $blackSapphire;
      }
    }
  }
  &.top {
    @include small {
      position: absolute;
      top: 3rem;
      z-index: 100;
    }
    @include mini {
      bottom: calc(4.1665vw + 84px + 0.5rem);
    }
  }
  &.bottom {
    @include small {
      position: absolute;
      bottom: 2rem;
      z-index: 100;
    }
    @include mini {
      bottom: calc(4.1665vw + 84px + 0.5rem);
    }
  }
}

// ///////////////////////////////////////////// [Button] Clear selected filters
::v-deep #clear-selected-filters-button {
  margin-left: 0.5rem;
  p {
    @include fontSize_Small;
  }
}

// ///////////////////////////////////////////////////////////// [Dropdown] Sort
.radio-sort-wrapper {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 1.5rem;
  @include mini {
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .sort-by-selector {
    position: relative;
  }
}

.relative-wrapper {
  &.sort-by {
    margin: 0 1.5rem;
    @include mini {
      margin-bottom: 3.5rem;
    }
  }
}

.sort-by-wrapper {
  position: absolute;
  &.open {
    &:after {
      background: linear-gradient(90deg, $daytonaBlue, $daytonaBlue);
    }
  }
}

::v-deep #list-block-toggle-button {
  @include borderRadius_Medium;
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-left: 1rem;
  position: relative;
  top: 10px;
  height: calc(2.5rem - 2px);
  background-color: white;
  cursor: pointer;
  @include whiteBorderBack;
  overflow: hidden;
  &:before {
    @include borderRadius_Medium;
    content: '';
    position: absolute;
    top: 0;
    left: 50%;
    width: 52%;
    height: 100%;
    transition: 300ms cubic-bezier(0.61, 1.6, 0.64, 0.88);
    z-index: 5;
    background-color: unset;
    @include oceanBlueGradient;
  }
  &:not(.list-view-active) {
    .block-view-icon {
      g {
        stroke: white;
      }
    }
  }
  &.list-view-active {
    &:before {
      transform: translateX(-100%);
    }
    .list-view-icon {
      line {
        stroke: white;
      }
    }
  }
}

.list-view-icon,
.block-view-icon {
  @include borderRadius_Medium;
  white-space: nowrap;
  padding: 0 1rem;
  z-index: 10;
}

</style>
