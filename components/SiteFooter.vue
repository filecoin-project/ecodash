<template>
  <footer id="site-footer">

    <section class="panel-top">
      <div class="grid-noGutter">
        <div class="col-12">
          <div class="subfooter-cta">
            <div class="grid">
              <div class="col-10" data-push-left="off-1">
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
          class="col-4_sm-10"
          data-push-left="off-1"
          data-push-right="off-1">
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
          class="col-4_sm-10"
          data-push-left="off-1"
          data-push-right="off-1">
          <div class="content-wrapper panel-right">
            <nav id="footer-navigation">
              <div class="left-column">
                <div class="links-heading">
                  {{ footer.left_heading }}
                </div>
                <template v-for="(link, index) in navigation.header">
                  <template v-if="link.hasOwnProperty('links')">
                    <DropdownSelector
                      :key="index"
                      label="Explore Network"
                      :dropdown-options="link.links"
                      :display-selected="false"
                      class="footer-link">
                      <template #dropdown-icon>
                        <SelectorToggle />
                      </template>
                    </DropdownSelector>
                  </template>
                  <template v-else>
                    <Button
                      :key="`link-left-${index}`"
                      type="navlink"
                      :tag="link.type"
                      :to="link.disabled ? '' : link.href"
                      :disabled="link.disabled"
                      :text="link.label"
                      target="_blank"
                      class="footer-link focus-visible" />
                  </template>
                </template>
              </div>
              <div class="right-column">
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
                
                <SocialIcons />

              </div>
            </nav>
          </div>
        </div>

      </div>
    </section>

  </footer>
</template>

<script>
// ===================================================================== Imports
import { mapGetters } from 'vuex'

import MailchimpForm from '@/components/MailchimpForm'
import Button from '@/modules/zero/core/components/Button'
import DropdownSelector from '@/components/DropdownSelector'
import SelectorToggle from '@/modules/zero/core/components/icons/SelectorToggle'
import SocialIcons from '@/components/SocialIcons'
import AddIcon from '@/components/icons/AddIcon'

// ====================================================================== Export
export default {
  name: 'SiteFooter',

  components: {
    MailchimpForm,
    Button,
    DropdownSelector,
    SelectorToggle,
    SocialIcons,
    AddIcon
  },

  computed: {
    ...mapGetters({
      siteContent: 'global/siteContent'
    }),
    navigation () {
      return this.siteContent.general.navigation
    },
    subfooter () {
      return this.siteContent.general.subfooter
    },
    footer () {
      return this.siteContent.general.footer
    }
  }
}
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
#site-footer {
  padding: 5.25rem 0;
  @include small {
    padding: 2rem 0;
  }
}

[class~="grid"],
[class*="grid-"],
[class*="grid_"] {
  padding: 0;
}

// ///////////////////////////////////////////////////////////////// [Panel] Top
.subfooter-cta {
  position: relative;
  padding: toRem(59) 0;
  margin-top: 3rem;
  margin-bottom: toRem(52);
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
  }
  .heading,
  .subheading {
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
  }
  .cta {
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
  justify-content: space-between;
  margin-bottom: 2rem;
  // @include mini {
  //   display: flex;
  //   flex-direction: column;
  //   align-items: flex-start;
  //   margin-top: 1rem;
  // }
  .left-column,
  .right-column {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
  }
}

.links-heading {
  font-size: toRem(18);
  font-weight: 600;
  line-height: leading(21, 18);
  letter-spacing: 0.36px;
  margin-bottom: toRem(15);
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
