<template>
  <section
    v-if="navigation"
    id="header-navigation"
    :class="headerNavigationClasses">

    <div class="grid-noGutter">

      <div :class="['modal-background', { 'show-background': navOpen, 'transition-out': modalClosing }]"></div>

      <div class="col-3">
        <a :href="navigation.index.href" tabindex="0" class="logo-link focus-visible">
          <SiteLogo id="site-logo" />
        </a>
      </div>
      
      <div
        :class="['hamburger-icon', 'focus-visible', {'close-icon' : navOpen}]"
        tabindex="0"
        @click="toggleNav"
        @keyup.enter="toggleNav">
      </div>

      <div class="col-5">
        <div :class="['navigation', { 'modal-open' : navOpen, 'transition-out': modalClosing }]">
          <nav class="links-container">
            <template v-for="(link, index) in navigation.header">
              <template v-if="link.hasOwnProperty('links')">
                <div :key="index" class="relative-wrapper" :style="{ minWidth: `${dropdownWidth}px` }">
                  <div
                    :class="['button-wrapper', 'sort-by-wrapper', dropdownState]">
                    <DropdownSelector
                      class="sort-by-selector"
                      label="Explore Network"
                      :dropdown-options="link.links"
                      :display-selected="false"
                      :modal="navOpen"
                      @changed="changeDropdownState"
                      @setwidth="setDropdownWidth">
                      <template #dropdown-icon>
                        <SelectorToggle />
                      </template>
                    </DropdownSelector>
                  </div>
                </div>
              </template>
              <template v-else>
                <component
                  :is="link.type"
                  :key="index"
                  :to="link.disabled ? '' : link.href"
                  :href="link.disabled ? '' : link.href"
                  :disabled="link.disabled"
                  :target="link.target"
                  class="navigation-link onhover-line focus-visible">
                  {{ link.label }}
                </component>
              </template>
            </template>
          </nav>
        </div>
      </div>

      <div class="col-4">
        <div class="nav-toolbar">
          <FilterBar
            id="nav-filter-bar"
            :filter-value="filterValue"
            action="store">
            <template #icon>
              <SearchIcon />
            </template>
          </FilterBar>
        </div>
      </div>

        <!-- <div
          v-if="languageSelector"
          class="language-selector">
          <a class="option">
            EN
          </a>
          <a class="option">
            中文
          </a>
        </div> -->

      <div :class="['social-icon-container', { 'visible': navOpen }]">
        <SocialIcons />
      </div>

    </div>

  </section>
</template>

<script>
// ===================================================================== Imports
import { mapGetters } from 'vuex'
import Throttle from 'lodash/throttle'

import DropdownSelector from '@/components/DropdownSelector'
import SiteLogo from '@/components/SiteLogo'
import SocialIcons from '@/components/SocialIcons'
import SearchIcon from '@/components/icons/SearchIcon'
import SelectorToggle from '@/modules/zero/core/components/icons/SelectorToggle'
import FilterBar from '@/modules/zero/core/components/FilterBar'

// =================================================================== Functions
const checkScreenWidth = (instance) => {
  if (!window.matchMedia('(max-width: 53.125rem)').matches && instance.navOpen) {
    instance.toggleNav()
  }
}

// ====================================================================== Export
export default {
  name: 'Navigation',

  components: {
    DropdownSelector,
    SiteLogo,
    SocialIcons,
    SearchIcon,
    SelectorToggle,
    FilterBar
  },

  data () {
    return {
      navOpen: false,
      resize: false,
      scroll: false,
      modalClosing: false,
      scrollPosition: 0,
      showBackground: false,
      forceNavigationVisible: true,
      dropdownState: 'closed',
      dropdownWidth: 0,
      languageSelector: false
    }
  },

  computed: {
    ...mapGetters({
      navigation: 'global/navigation',
      siteContent: 'global/siteContent',
      filterPanelOpen: 'filters/filterPanelOpen',
      filterValue: 'core/filterValue'
    }),
    headerNavigationClasses () {
      const showBackground = this.showBackground
      const forceVisible = this.forceNavigationVisible
      let compiled = ''
      if (forceVisible) { compiled += 'force-visible ' }
      if (showBackground) { compiled += 'show-background ' }
      return compiled
    },
    dropdownOptions () {
      return {
        one: {
          label: 'hola'
        },
        two: {
          label: 'hi'
        },
        three: {
          label: 'yoo'
        }
      }
    }
  },

  watch: {
    scrollPosition (newVal, oldVal) {
      const showBackground = this.showBackground
      const forceVisible = this.forceNavigationVisible
      // const scrollSpeed = this.$GetScrollSpeed(newVal)
      if (newVal === 0 && showBackground) {
        this.showBackground = false
      } else if (newVal > 0 && !showBackground) {
        this.showBackground = true
      }

      if (newVal === 0) {
        this.forceNavigationVisible = true
      } else if (newVal < oldVal && !forceVisible) {
        this.forceNavigationVisible = true
      } else if (newVal > 80 && newVal > oldVal && forceVisible) {
        this.forceNavigationVisible = false
      }
    }
  },

  mounted () {
    this.resize = Throttle(() => { checkScreenWidth(this) }, 310)
    this.scroll = () => { this.updateScrollPosition() }
    window.addEventListener('resize', this.resize)
    window.addEventListener('scroll', this.scroll)
    this.updateScrollPosition()
  },

  beforeDestroy () {
    if (this.resize) { window.removeEventListener('resize', this.resize) }
    if (this.scroll) { window.removeEventListener('scroll', this.scroll) }
  },

  methods: {
    toggleNav () {
      if (this.navOpen) {
        this.modalClosing = true
        setTimeout(() => {
          this.modalClosing = false
          document.body.classList.remove('no-scroll')
          this.navOpen = !this.navOpen
        }, 300)
      } else {
        document.body.classList.add('no-scroll')
        this.navOpen = !this.navOpen
      }
    },
    updateScrollPosition () {
      this.scrollPosition = window.scrollY
    },
    changeDropdownState (item) {
      this.dropdownState = item.data.state
    },
    setDropdownWidth (val) {
      this.dropdownWidth = val
    }
  }
}
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
#header-navigation {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: $navigationHeight;
  z-index: 9999;
  transform: translateY(-$navigationHeight);
  transition: transform 250ms ease-in-out;
  &.force-visible {
    transform: translateY(0);
  }
  &.show-background {
    &:before {
      opacity: 1;
    }
  }
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    transition: 250ms ease-in-out;
  }
}

[class*="grid"],
[class*="col"],
.navigation-content {
  height: 100%;
}

// .navigation-content {
//   display: flex;
//   flex-direction: row;
//   justify-content: space-between;
//   align-items: center;
//   margin-top: 0.25rem;
// }

#site-logo,
.navigation-link {
  cursor: pointer;
}

.logo-link {
  @include borderRadius_Medium;
}

#site-logo {
  display: block;
  position: relative;
  width: 8rem;
  opacity: 1.0;
  z-index: 100;
  transition: all 0.3s ease;
  &:hover {
    transform: scale(1.05);
  }
}

.navigation {
  display: flex;
  max-width: unset;
  width: 100%;
  @include small {
    display: none;
    flex-direction: column;
    position: fixed;
    top: $navigationHeight;
    left: 0;
    width: 100vw;
    height: calc(100vh - 8.25rem);
    max-width: none;
    z-index: 100;
    &:not(.modal-open) {
      display: none;
    }
    &.modal-open {
      display: block;
    }
  }
  &.modal-open {
    display: flex;
    animation: landing 300ms cubic-bezier(0.4, 0.0, 0.2, 1.0);
  }
}

.links-container {
  flex: 1;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  // margin-left: 2rem;
  margin: 0 2rem;
  &:before {
    content: '';
    position: relative;
    width: 6rem;
    height: 100%;
    flex-grow: 1;
  }
  @include medium {
    margin: 0 1rem;
  }
  @include small {
    flex-direction: column;
    justify-content: center;
    // margin-left: 5rem;
    margin: 0 5rem;
    justify-content: flex-start;
    &:before {
      content: '';
      position: relative;
      width: 100%;
      height: 2rem;
      flex-grow: 0;
    }
  }
}

.navigation-link {
  font-family: $font_Primary;
  letter-spacing: $letter_SpacingRegular;
  font-size: $fontSize_Regular;
  margin: 0 1.0rem;
  @include medium {
    margin: 0 0.5rem;
  }
  @include borderRadius_Medium;
  @include small {
    align-self: start;
    font-size: $fontSize_Large;
    line-height: $leading_Mini;
    margin: 0 0 2rem 0;
  }
}

.relative-wrapper {
  height: 100%;
  margin-left: 1rem;
  content: '';
  position: relative;
  width: 100px;
  z-index: 100;
  @include small {
    margin: 0;
    align-self: start;
  }
}

.language-selector {
  display: flex;
  .option {
    color: $white;
    &:active {
      color: $caribbeanBlue;
    }
  }
}

// ////////////////////////////////////////////////////// Modal + Hamburger icon
.modal-background {
  display: none;
  @include small {
    position: absolute;
    width: 100vw;
    height: 100vh;
    top: 0;
    left: 0;
    z-index: 99;
  }
  &.show-background {
    display: inline;
    animation: landing 300ms cubic-bezier(0.4, 0.0, 0.2, 1.0);
  }
}

.hamburger-icon {
  display: none;
  position: relative;
  z-index: 1000;
  height: 14px;
  width: 2rem;
  @include small {
    display: inline;
  }
  &:before {
    content: '';
    position: absolute;
    width: 100%;
    top: 0px;
    border-top: 2px solid white;
    transition: 300ms cubic-bezier(0.4, 0.0, 0.2, 1.0);
  }
  &:after {
    content: "";
    position: absolute;
    width: 100%;
    bottom: 2px;
    border-top: 2px solid white;
    transition: 300ms cubic-bezier(0.4, 0.0, 0.2, 1.0);
  }
  &.close-icon {
    &:before {
      transform: rotate(45deg) translate(3px, 4px);
    }
    &:after {
      transform: rotate(-45deg) translate(3px, -4px);
    }
  }
  &:hover {
    cursor: pointer;
  }
}

.social-icon-container {
  display: none;
}

// ////////////////////////////////////////////////////////////////// Animations
@keyframes landing {
  from {
    transform: scale(1.1);
    opacity: 0.0;
  }
  to {
    transform: scale(1.0);
    opacity: 1.0;
  }
}

.transition-out {
  transition: 300ms cubic-bezier(0.4, 0.0, 0.2, 1.0);
  transform: scale(1.1);
  opacity: 0.0;
}

// /////////////////////////////////////////////////////////// Dropdown Selector
.button-wrapper {
  position: relative;
  transition: all 250ms linear;
  position: absolute;
  top: calc(-50% - 0.25rem);
  @include small {
    top: 0;
  }
  &.open {
    &:after {
      background: linear-gradient(90deg, $daytonaBlue, $daytonaBlue);
    }
  }
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
    @include whiteBorderFront;
    border-radius: 0 !important;
    background-color: $jaguar;
    transition: inherit;
  }
  &.button-active {
    &:before {
      top: 0px;
      left: 0px;
    }
    &:after {
      top: 1px;
      left: 1px;
    }
    button {
      top: 2px;
      left: 2px;
      @include oceanBlueGradient;
    }
  }
  &:hover {
    button {
      top: 0px;
      left: 0px;
    }
    &:after {
      top: 0px;
      left: 0px;
    }
  }
}

</style>
