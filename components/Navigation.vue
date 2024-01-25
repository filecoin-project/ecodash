<template>
  <section
    id="header-navigation"
    :class="[{ 'force-visible': forceNavigationVisible }, { 'show-background': showBackground }, { 'nav-open': navOpen }]">
    <div class="grid-noGutter-middle">

      <div :class="['modal-background', { 'show-background': navOpen }]"></div>

      <div class="col-2_lg-2_sm-4">
        <nuxt-link to="/" tabindex="0" class="logo-link focus-visible">
          <SiteLogo id="site-logo" />
        </nuxt-link>
      </div>

      <div class="col-5_sm-1">
        <div :class="['navigation', { 'modal-open': navOpen }]">
          <div class="nav-items">
            <Button
              v-for="(link, index) in navigation"
              :key="`nav-link-${index}`"
              type="navlink"
              :tag="link.type"
              :to="link.disabled ? '' : link.href"
              :disabled="link.disabled"
              :text="link.label"
              target="_blank"
              class="navigation-link onhover-line focus-visible" />
            <DropdownSelector
              :label="dropdown.label"
              :dropdown-options="dropdown.links"
              :display-selected="false"
              :modal="navOpen">
              <template #dropdown-icon>
                <SelectorToggle />
              </template>
            </DropdownSelector>
          </div>
        </div>
      </div>

      <div class="col-5_sm-7">
        <div class="nav-toolbar">
          <FilterBar
            id="nav-filter-bar"
            :filter-value="filterValue"
            action="store"
            @on-submit="navigateToResults">
            <template #icon>
              <SearchIcon />
            </template>
          </FilterBar>
          <Button
            type="cta"
            :tag="navCta.type"
            :to="navCta.href"
            :text="navCta.text"
            :target="navCta.target"
            class="nav-cta">
            <template #icon-before>
              <AddIcon />
            </template>
          </Button>
          <div
            :class="['hamburger-icon', 'focus-visible', { 'close-icon': navOpen }]"
            tabindex="0"
            @click="toggleNav"
            @keyup.enter="toggleNav">
          </div>
        </div>
      </div>

      <div class="col-12">
        <Breadcrumbs :breadcrumbs="breadcrumbs" />
      </div>

      <div :class="['social-icon-container', { visibile: navOpen }]">
        <SocialIcons />
      </div>

    </div>
  </section>
</template>

<script>
// ===================================================================== Imports
import { mapGetters } from 'vuex'
import Throttle from 'lodash/throttle'

import SiteLogo from '@/components/SiteLogo'
import DropdownSelector from '@/components/DropdownSelector'
import Button from '@/modules/zero/core/components/Button'
import SelectorToggle from '@/modules/zero/core/components/icons/SelectorToggle'
import FilterBar from '@/modules/zero/core/components/FilterBar'
import SearchIcon from '@/components/icons/SearchIcon'
import AddIcon from '@/components/icons/AddIcon'
import Breadcrumbs from '@/modules/zero/core/components/Breadcrumbs'
import SocialIcons from '@/components/SocialIcons'

// =================================================================== Functions
const checkScreenWidth = (instance) => {
  if (!window.matchMedia('(max-width: 53.125rem)').matches && instance.navOpen) {
    instance.toggleNav()
  }
}

// ====================================================================== Export
export default {
  name: 'SiteNavigation',

  components: {
    SiteLogo,
    DropdownSelector,
    Button,
    SelectorToggle,
    FilterBar,
    SearchIcon,
    AddIcon,
    Breadcrumbs,
    SocialIcons
  },

  data () {
    return {
      navOpen: false,
      resize: false,
      scroll: false,
      scrollPosition: 0,
      showBackground: false,
      forceNavigationVisible: true
    }
  },

  computed: {
    ...mapGetters({
      siteContent: 'global/siteContent',
      filterValue: 'core/filterValue'
    }),
    categories () {
      return this.siteContent.taxonomy.categories
    },
    navigation () {
      return this.siteContent.general.navigation.nav_items
    },
    dropdown () {
      return this.siteContent.general.navigation.nav_dropdown
    },
    navCta () {
      return this.siteContent.general.navigation.header_cta.button
    },
    breadcrumbsMap () {
      return this.siteContent.general.navigation.breadcrumbs_map
    },
    breadcrumbs () {
      const route = this.$route
      const params = route.params
      const breadcrumbs = [this.breadcrumbsMap.index]
      if (params.category) {
        const active = this.categories.find(cat => cat.slug === params.category)
        breadcrumbs.push({ href: `/category/${params.category}`, label: active.label })
        if (params.subcategory) {
          const subcategory = active.subcategories.find(subcat => subcat.slug === params.subcategory)
          breadcrumbs.push({ href: `/category/${params.category}/${params.subcategory}`, label: subcategory.label })
        }
      } else if (this.breadcrumbsMap.hasOwnProperty(route.name) && route.name !== 'index') {
        breadcrumbs.push(this.breadcrumbsMap[route.name])
      }
      breadcrumbs.forEach((item, i) => {
        if (i !== breadcrumbs.length - 1) {
          item.type = 'nuxt-link'
        } else {
          item.type = 'div'
        }
      })
      return breadcrumbs
    }
  },

  watch: {
    scrollPosition (newVal, oldVal) {
      const showBackground = this.showBackground
      const forceVisible = this.forceNavigationVisible
      console.log(this.forceNavigationVisible)
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
        this.navOpen = !this.navOpen
        document.body.classList.remove('no-scroll')
      } else {
        document.body.classList.add('no-scroll')
        this.navOpen = !this.navOpen
      }
    },
    updateScrollPosition () {
      this.scrollPosition = window.scrollY
    },
    navigateToResults () {
      if (this.filterValue) {
        if (this.$route.path !== '/results') {
          this.$router.push({
            path: '/results',
            query: {
              search: this.filterValue
            }
          })
        } else {
          this.$router.replace({
            path: '/results',
            query: {
              search: this.filterValue
            }
          })
        }
      }
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
  @include small {
    padding-top: toRem(20);
    height: toRem(92);
    &.nav-open {
      transform: translateY(0) !important;
    }
  }
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
    background: $blackSapphire;
  }
}

#site-logo,
.navigation-link {
  cursor: pointer;
}

.logo-link {
  display: block;
}

#site-logo {
  display: block;
  position: relative;
  width: 8rem;
  opacity: 1.0;
  z-index: 100;
  transition: all 0.3s ease;
  @include small {
    height: 2rem;
    width: unset;
  }
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
    padding-left: 1rem;
    transform: translateX(-2rem);
  }
  // @include medium {
  //   padding-left: 1rem;
  // }
  @include small {
    display: block;
    flex-direction: column;
    position: fixed;
    padding: 0 toRem(36);
    top: $navigationHeight;
    left: 0;
    width: 100vw;
    height: calc(100vh - 8.25rem);
    max-width: none;
    z-index: 100;
    transition: opacity 250ms ease, transform 250ms ease, visibility 250ms ease;
    visibility: hidden;
    transform: scale(1.1);
    opacity: 0;
    &.modal-open {
      opacity: 1;
      visibility: visible;
      transform: scale(1);
    }
  }
  &.modal-open {
    display: flex;
    animation: landing 300ms cubic-bezier(0.4, 0.0, 0.2, 1.0);
  }
}

.nav-items {
  flex: 1;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin: 0 1rem;
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
  @include large {
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
  margin-left: -1rem;
  z-index: 100;
  @include large {
    margin-left: 0;
  }
  @include small {
    align-items: center;
  }
}

::v-deep #nav-filter-bar {
  z-index: 1000;
}

.nav-cta {
  height: toRem(27);
  margin-left: 2rem;
  transform: translateY(2px);
  @include small {
    display: none !important;
  }
}

// ////////////////////////////////////////////////////// Modal + Hamburger icon
.modal-background {
  display: none;
  background-color: $blackSapphire;
  transition: opacity 250ms ease, transform 250ms ease, visibility 250ms ease;
  visibility: hidden;
  transform: scale(1.1);
  opacity: 0;
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
    height: calc(200vh);
    top: 0;
    left: 0;
    z-index: 99;
  }
  &.show-background {
    display: inline;
    animation: landing 300ms cubic-bezier(0.4, 0.0, 0.2, 1.0);
    opacity: 1;
    visibility: visible;
    transform: scale(1);
  }
}

.hamburger-icon {
  display: none;
  position: relative;
  z-index: 1000;
  width: 1.5rem;
  height: 14px;
  margin-left: toRem(11);
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

</style>
