<template>
  <footer id="site-footer">

    <section class="panel-top">
      <div class="grid-noGutter">
        <div class="col-12">
          <div class="subfooter-cta">
            <div class="grid">
              <div class="col-10_sm-12" data-push-left="off-1_sm-0">
                <div class="heading">
                  {{ subfooter.heading }}
                </div>
                <div class="subheading">
                  {{ subfooter.subheading }}
                </div>
                <div class="cta">
                  <Button
                    type="cta"
                    :tag="subfooter.cta.type"
                    :to="subfooter.cta.disabled ? '' : subfooter.cta.href"
                    :disabled="subfooter.cta.disabled"
                    :text="subfooter.cta.text"
                    class="nav-cta">
                    <template #icon-before>
                      <AddIcon />
                    </template>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="panel-bottom">
      <div class="grid-noGutter">

        <div
          class="col-5_sm-12"
          data-push-left="off-0"
          data-push-right="off-1_sm-0">
          <div class="content-wrapper panel-left">

            <h4 class="heading">
              {{ footer.heading }}
            </h4>

            <div ref="subheading" class="subheading">
              {{ footer.subheading }}
            </div>

            <div ref="mailform" class="mailchimp-form">
              <MailchimpForm />
            </div>

          </div>
        </div>

        <div
          class="col-6_sm-12"
          data-push-left="off-0"
          data-push-right="off-0">
          <div class="content-wrapper panel-right">
            <nav id="footer-navigation">
              <div class="left-column nav-column">
                <div class="links-heading">
                  Reach Out
                </div>
                <Button
                  v-for="(link, index) in socials"
                  :key="`link-left-${index}`"
                  tag="a"
                  :to="link.disabled ? '' : link.href"
                  :disabled="link.disabled"
                  :text="link.network"
                  target="_blank"
                  class="footer-link focus-visible">
                  <template #icon-after>
                    ↗
                  </template>
                </Button>
              </div>
              <div class="middle-column nav-column">
                <div class="links-heading">
                  {{ footer.left_heading }}
                </div>
                <Button
                  v-for="(link, index) in navigation"
                  :key="`link-middle-${index}`"
                  :tag="link.type"
                  :to="link.disabled ? '' : link.href"
                  :disabled="link.disabled"
                  :text="link.label"
                  target="_blank"
                  class="footer-link focus-visible">
                  <template #icon-after>
                    ↗
                  </template>
                </Button>
              </div>
              <div class="right-column nav-column">
                <div class="links-heading">
                  {{ footer.right_heading }}
                </div>
                <Button
                  v-for="(link, index) in footer.right_links"
                  :key="`link-right-${index}`"
                  :tag="link.type"
                  :to="link.disabled ? '' : link.href"
                  :href="link.disabled ? '' : link.href"
                  :disabled="link.disabled"
                  :target="link.target"
                  :text="link.label"
                  class="footer-link focus-visible">
                  <template #icon-after>
                    ↗
                  </template>
                </Button>
              </div>
              <div class="left-column nav-column small-only">
                <div class="links-heading">
                  Reach Out
                </div>
                <Button
                  v-for="(link, index) in socials"
                  :key="`link-left-${index}`"
                  tag="a"
                  :to="link.disabled ? '' : link.href"
                  :disabled="link.disabled"
                  :text="link.network"
                  target="_blank"
                  class="footer-link focus-visible">
                  <template #icon-after>
                    ↗
                  </template>
                </Button>
              </div>
            </nav>
          </div>
        </div>

        <!-- <div class="col-10_sm-12" data-push-left="off-1_sm-0">
          <SocialIcons />
        </div> -->

      </div>
    </section>

  </footer>
</template>

<script>
// ===================================================================== Imports
import { mapGetters } from 'vuex'
import CloneDeep from 'lodash/cloneDeep'

import MailchimpForm from '@/components/MailchimpForm'
import Button from '@/modules/zero/core/components/Button'
import AddIcon from '@/components/icons/AddIcon'
// import SelectorToggle from '@/modules/zero/core/components/icons/SelectorToggle'
// import DropdownSelector from '@/components/DropdownSelector'
// import SocialIcons from '@/components/SocialIcons'

// ====================================================================== Export
export default {
  name: 'SiteFooter',

  components: {
    MailchimpForm,
    Button,
    AddIcon
    // SelectorToggle,
    // DropdownSelector,
    // SocialIcons
  },

  computed: {
    ...mapGetters({
      siteContent: 'global/siteContent'
    }),
    navigation () {
      const nav = CloneDeep(this.siteContent.general.navigation.nav_items)
      nav.push({
        type: 'a',
        href: 'https://filecoin.io',
        label: 'Filecoin.io'
      })
      return nav
    },
    subfooter () {
      return this.siteContent.general.subfooter
    },
    footer () {
      return this.siteContent.general.footer
    },
    socials () {
      return this.siteContent.general.social_icons
    }
  }
}
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
#site-footer {
  position: relative;
  padding: 5.25rem 0;
  @include small {
    padding: 2rem 0;
  }
}

// ///////////////////////////////////////////////////////////////// [Panel] Top
.subfooter-cta {
  position: relative;
  padding: toRem(59) 0;
  margin-top: 3rem;
  margin-bottom: toRem(52);
  isolation: isolate;
  @include small {
    padding: toRem(40) toRem(22);
    padding-bottom: toRem(34);
    margin-bottom: toRem(63);
    margin-top: 0;
  }
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border: 3px solid;
    border-image-slice: 1 !important;
    border-width: 3px;
    border-image-source: linear-gradient(25deg, #213C4F, #406380);
    box-shadow: 0px 0px 15px 3px #213140;
    opacity: 0.6;
    background-color: $blackSapphire;
  }
  .heading,
  .subheading {
    position: relative;
    text-align: center;
  }
  .heading {
    font-size: toRem(22);
    font-weight: 600;
    line-height: leading(36, 22);
    letter-spacing: 0.48px;
    margin-bottom: toRem(28);
  }
  .subheading {
    font-size: toRem(18);
    font-weight: 400;
    line-height: leading(30, 18);
    letter-spacing: 0.36px;
    margin-bottom: toRem(45);
    @include small {
      margin-bottom: toRem(36);
    }
  }
  .cta {
    z-index: 100;
    position: relative;
    display: flex;
    justify-content: center;
  }
}

// ////////////////////////////////////////////////////////////// [Panel] Bottom
.panel-bottom {
  @include small {
    margin-bottom: 1rem;
  }
}

// //////////////////////////////////////////////////////////////// [Panel] Left
.content-wrapper {
  &.panel-left {
    .heading {
      font-size: toRem(18);
      font-weight: 600;
      line-height: leading(36, 18);
      letter-spacing: 0.36px;
      margin-bottom: 0.25rem;
    }
    .subheading {
      font-size: toRem(18);
      font-weight: 400;
      line-height: leading(30, 18);
      letter-spacing: 0.36px;
      margin-bottom: toRem(37);
    }
  }
}

// /////////////////////////////////////////////////////////////// [Panel] Right
#footer-navigation {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  @include small {
    justify-content: flex-start;
    flex-wrap: wrap;
  }
  .left-column,
  .middle-column,
  .right-column {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    @include small {
      align-items: flex-start;
      width: 50%;
    }
  }
}

.nav-column {
  margin-left: toRem(90);
  @include medium {
    margin-left: toRem(40);
  }
  @include small {
    margin: 0;
    width: 50%;
    &:last-child {
      margin-top: toRem(53);
    }
  }
  &.left-column {
    @include small {
      display: none !important;
    }
    &.small-only {
      display: none !important;
      @include small {
        display: flex !important;
      }
    }
  }
}

.links-heading {
  font-size: toRem(18);
  font-weight: 600;
  line-height: leading(21, 18);
  letter-spacing: 0.36px;
  margin-bottom: toRem(15);
  white-space: nowrap;
}

.footer-link {
  opacity: 0.9;
  transition: opacity 200ms ease;
  &:hover {
    opacity: 1.0;
  }
  ::v-deep .button-content {
    padding: 0;
    margin: 1px 0;
    .text {
      font-size: 1rem;
      font-weight: 400;
      line-height: leading(35, 16);
      letter-spacing: 0.36px;
    }
  }
  &.dropdown-selector {
    margin: 1px 0;
    ::v-deep .button-inner {
      justify-content: flex-end;
      padding: 0;
      @include small {
        justify-content: flex-start;
      }
    }
    ::v-deep label {
      font-size: 1rem;
      font-weight: 400;
      line-height: leading(35, 16);
      letter-spacing: 0.36px;
    }
  }
}

</style>
