<template>
  <section
    v-if="navigation"
    id="header-navigation"
    :class="headerNavigationClasses">

    <div class="grid-noGutter-middle">

      <div :class="['modal-background', { 'show-background': navOpen, 'transition-out': modalClosing }]"></div>

      <div class="col-3_lg-2">
        <a :href="navigation.index.href" tabindex="0" class="logo-link focus-visible">
          <SiteLogo id="site-logo" />
        </a>
      </div>
      
      <div class="col-0_sm-2" data-push-left="off-0_sm-8">
        <div
          :class="['hamburger-icon', 'focus-visible', {'close-icon' : navOpen}]"
          tabindex="0"
          @click="toggleNav"
          @keyup.enter="toggleNav">
        </div>
      </div>

      <div class="col-5_lg-6">
        <div :class="['navigation', { 'modal-open' : navOpen, 'transition-out': modalClosing }]">
          <nav class="links-container">
            <template v-for="(link, index) in navigation.header">
              <template v-if="link.hasOwnProperty('links')">
                <DropdownSelector
                  :key="index"
                  label="Explore Network"
                  :dropdown-options="link.links"
                  :display-selected="false"
                  :modal="navOpen">
                  <template #dropdown-icon>
                    <SelectorToggle />
                  </template>
                </DropdownSelector>
              </template>
              <template v-else>
                <Button
                  :key="index"
                  type="navlink"
                  :tag="link.type"
                  :to="link.disabled ? '' : link.href"
                  :disabled="link.disabled"
                  :text="link.label"
                  target="_blank"
                  class="navigation-link onhover-line focus-visible" />
              </template>
            </template>
          </nav>
        </div>
      </div>

      <div class="col-4_sm-hidden">
        <div class="nav-toolbar">
          <FilterBar
            id="nav-filter-bar"
            :filter-value="filterValue"
            action="store">
            <template #icon>
              <SearchIcon />
            </template>
          </FilterBar>
          <Button
            type="cta"
            :tag="navCta.type"
            :to="navCta.disabled ? '' : navCta.href"
            :disabled="navCta.disabled"
            :text="navCta.text"
            class="nav-cta">
            <template #icon-before>
              <AddIcon />
            </template>
          </Button>
        </div>
      </div>

      <div class="col-12">
        <Breadcrumbs :breadcrumbs="breadcrumbs" />
      </div>

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
import AddIcon from '@/components/icons/AddIcon'
import SelectorToggle from '@/modules/zero/core/components/icons/SelectorToggle'
import FilterBar from '@/modules/zero/core/components/FilterBar'
import Button from '@/modules/zero/core/components/Button'
import Breadcrumbs from '@/modules/zero/core/components/Breadcrumbs'

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
    AddIcon,
    SearchIcon,
    SelectorToggle,
    FilterBar,
    Button,
    Breadcrumbs
  },

  data () {
    return {
      navOpen: false,
      resize: false,
      scroll: false,
      modalClosing: false,
      scrollPosition: 0,
      showBackground: false,
      forceNavigationVisible: true
    }
  },

  computed: {
    ...mapGetters({
      navigation: 'global/navigation',
      siteContent: 'global/siteContent',
      filterPanelOpen: 'filters/filterPanelOpen',
      filterValue: 'core/filterValue'
    }),
    breadcrumbs () {
      return this.siteContent.general.navigation.breadcrumbs
    },
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
    },
    navCta () {
      return this.navigation.header_cta.button
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
    }
  }
}
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
#header-navigation {
  position: fixed;
  padding-top: toRem(39);
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
  height: 100%;
  @include large {
    padding-left: 3rem;
  }
  @include medium {
    padding-left: 1rem;
  }
  @include small {
    display: none;
    flex-direction: column;
    position: fixed;
    padding: 0 toRem(36);
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
  margin: 0 1rem;
  @include medium {
    margin-left: 0;
  }
  @include small {
    flex-direction: column;
    justify-content: center;
    justify-content: flex-start;
    align-items: flex-start;
    ::v-deep .dropdown-selector {
      margin: toRem(12) 0;
      .button-inner {
        padding-left: 0.5rem;
      }
    }
  }
}

.navigation-link {
  display: inline-block;
  margin: 0 toRem(6);
  @include medium {
    margin: 0;
  }
  @include small {
    margin: toRem(9) 0;
  }
  &.onhover-line {
    &:hover {
      &:after {
        opacity: 1;
      }
    }
    &:after {
      content: "";
      height: 1px;
      bottom: 0px;
      background-color: currentColor;
      position: absolute;
      width: calc(100% - 20px);
      left: 10px;
      opacity: 0;
      transition: all .2s cubic-bezier(0.4, 0.0, 0.2, 1.0);
    }
  }
}

// ///////////////////////////////////////////////////////////////// Nav Toolbar
.nav-toolbar {
  position: relative;
  display: flex;
  justify-content: flex-end;
  align-items: flex-end;
}

.nav-cta {
  height: toRem(27);
  margin-left: 2rem;
  transform: translateY(2px);
}

// ////////////////////////////////////////////////////// Modal + Hamburger icon
.modal-background {
  display: none;
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' width='684' height='684' viewBox='0 0 684 684'><defs><linearGradient id='linear-gradient' x1='0.985' y1='0.018' x2='0.017' y2='0.862' gradientUnits='objectBoundingBox'><stop offset='0' stop-color='%2339c0cc'/><stop offset='1' stop-color='%23178ffd'/></linearGradient></defs><pattern id='bg' patternUnits='userSpaceOnUse' width='684' height='684'><g id='Rectangle_1597' data-name='Rectangle 1597' transform='translate(354 13)' fill='none' stroke='%23add6fe' stroke-width='2' stroke-dasharray='3 7' opacity='0.2'><rect width='320' height='319' stroke='none'/><rect x='1' y='1' width='318' height='317' fill='none'/></g><g id='Rectangle_1601' data-name='Rectangle 1601' transform='translate(11 353)' fill='none' stroke='%23add6fe' stroke-width='2' stroke-dasharray='3 7' opacity='0.2'><rect width='320' height='319' stroke='none'/><rect x='1' y='1' width='318' height='317' fill='none'/></g></pattern><pattern id='bb' patternUnits='userSpaceOnUse' width='171' height='171'><path id='Rectangle_1509' data-name='Rectangle 1509' d='M1,1V170H170V1H1M0,0H171V171H0Z' fill='url(%23linear-gradient)' opacity='0.2' /></pattern><rect width='100%25' height='100%25' fill='url(%23bg)'/><rect width='100%25' height='100%25' fill='url(%23bb)'/></svg>");
    opacity: 0.7;
    z-index: 1;
  }
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
    display: block;
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

</style>