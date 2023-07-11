<template>
  <footer v-if="pageData" id="site-footer">

    <section class="panel-top">
      <div class="grid-centered-noGutter">

        <div class="col-5_md-6_sm-10 ">
          <div class="content-wrapper">
            <h3 class="heading">
              {{ pageData.cta_heading }}
            </h3>
            <div ref="cta" class="cta-text" v-html="pageData.cta_text"></div>

            <h4 class="heading">
              {{ pageData.form_heading }}
            </h4>
            <div ref="subheading" class="subheading">
              <component
                :is="getElementTag(element.type)"
                v-for="(element, index) in pageData.form_subheading"
                :key="`subheading-element-${index}`"
                :href="element.href"
                target="_blank"
                class="focus-visible">{{ element.content ? element.content : '' }}</component>
            </div>

            <div ref="mailform" class="mailchimp-form">
              <MailchimpForm />
            </div>

          </div>
        </div>

        <div v-if="navigation" class="col-5_sm-10">
          <div class="content-wrapper">
            <nav id="footer-navigation">
              <div class="left-column">
                <div class="links-heading">
                  {{ navigation.footer.left_header }}
                </div>
                <component
                  :is="link.type"
                  v-for="(link, index) in navigation.footer.left_links"
                  :key="index"
                  :to="link.disabled ? '' : link.href"
                  :href="link.disabled ? '' : link.href"
                  :disabled="link.disabled"
                  :target="link.target"
                  class="navigation-link onhover-opacity focus-visible">
                  {{ link.label }}
                </component>
              </div>
              <div class="right-column">
                <div class="links-heading">
                  {{ navigation.footer.right_header }}
                </div>
                <component
                  :is="link.type"
                  v-for="(link, index) in navigation.footer.right_links"
                  :key="index"
                  :to="link.disabled ? '' : link.href"
                  :href="link.disabled ? '' : link.href"
                  :disabled="link.disabled"
                  :target="link.target"
                  class="navigation-link onhover-opacity focus-visible">
                  {{ link.label }}
                </component>
              </div>
            </nav>
          </div>
        </div>

      </div>
    </section>

    <!-- <section class="panel-bottom">
      <div class="grid-centered-noGutter">

        <div class="col-10_sm-12">
          <div ref="copyright" class="copyright content-wrapper">
            <template v-if="pageData.copyright.length">
              <Shipyard_CopyrightLogo />
              <component
                :is="getElementTag(element.type)"
                v-for="(element, index) in pageData.copyright"
                :key="`copyright-element-${index}`"
                :href="element.href"
                target="_blank"
                class="focus-visible">{{ element.content ? element.content : '' }}</component>
            </template>
          </div>
        </div>

      </div>
    </section> -->

  </footer>
</template>

<script>
// ===================================================================== Imports
import { mapGetters } from 'vuex'

import MailchimpForm from '@/components/MailchimpForm'

// ====================================================================== Export
export default {
  name: 'SiteFooter',

  components: {
    MailchimpForm
  },

  computed: {
    ...mapGetters({
      siteContent: 'global/siteContent',
      navigation: 'global/navigation'
    }),
    pageData () {
      const siteContent = this.siteContent
      if (siteContent.hasOwnProperty('general')) {
        return siteContent.general.footer_content
      }
      return false
    }
  },

  methods: {
    getElementTag (string) {
      switch (string) {
        case 'text':
          return 'span'
        case 'link':
          return 'a'
        default:
          return 'span'
      }
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

::v-deep .subheading,
::v-deep .copyright {
  a {
    text-decoration: underline transparent;
    text-underline-offset: $underlineSpacing;
    transition: text-decoration-color 250ms ease-out;
    &:hover {
      transition: text-decoration-color 250ms ease-in;
      text-decoration-color: currentColor;
    }
  }
}

::v-deep .footer-link {
 color: white;
 border-bottom: 1px solid white;
 &:hover {
   color: $dodgerBlue;
   border-bottom: 1px solid $dodgerBlue;
 }
}

// ///////////////////////////////////////////////////////////////// [Panel] Top
.panel-top {
  @include small {
    margin-bottom: 1rem;
  }
}

.heading {
  font-size: 1.75rem;
  line-height: 1.2;
  font-weight: 500;
  letter-spacing: -0.01rem;
}

.subheading {
  margin-top: 0.5rem;
  margin-right: 0.5rem;
}

.navigation-link {
  &:not(:last-child) {
    margin-right: 1.6875rem;
  }
}

#footer-navigation {
  display: flex;
  flex-direction: row;
  margin-bottom: 2rem;
  @include small {
    margin-bottom: 0;
  }
  @include mini {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin-top: 1rem;
  }
  .left-column,
  .right-column {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
  }
}

// ////////////////////////////////////////////////////////////// [Panel] Bottom

::v-deep #mailchimp-form {
  margin-top: 2.5rem;
  @include small {
    margin-top: 1rem;
  }
  .panel-top {
    display: flex;
    flex-direction: row;
    margin-bottom: 0.5rem;
    @include mini {
      flex-direction: column;
      margin-bottom: 0.5rem;
    }
    .centered {
      justify-content: center;
    }
  }
  .panel-bottom {
    span {
      padding-left: 0.25rem;
    }
  }
  input {
    &[type="email"],
    &[type="submit"] {
      @include borderRadius_Medium;
    }
    &[type="email"] {
      flex: 1;
      padding: 0.5rem;
      line-height: 1.5;
    }
    &[type="submit"] {
      padding: 0 0.75rem;
      margin-left: 1rem;
      font-weight: 600;
      transition: 250ms ease-out;
      @include mini {
        line-height: 1.5;
        padding: 0.5rem;
        margin-left: 0;
        margin-top: 0.5rem;
      }
      &:hover {
        transition: 250ms ease-in;
      }
    }
  }
}

.cta-text {
  margin: 0.5rem 0 2.5rem;
}

.social-icons-container {
  @include small {
    margin: 2rem 0;
  }
}

::v-deep .copyright {
  @include fontSize_Small;
  svg {
    display: inline-block;
    vertical-align: middle;
    width: 1rem;
    margin-right: 0.25rem;
  }
}

</style>
