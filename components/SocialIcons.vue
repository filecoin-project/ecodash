<template>
  <div v-if="links.length" class="social-icons-container">

    <div ref="container" class="social-icons">
      <a
        v-for="link in links"
        :key="link.network"
        :href="link.href"
        target="_blank"
        rel="noopener noreferrer"
        class="focus-visible">
        <component :is="`${link.network}Icon`"></component>
      </a>
    </div>

  </div>
</template>

<script>
// ===================================================================== Imports
import { mapGetters } from 'vuex'

import SlackIcon from '@/components/icons/SlackIcon'
import TwitterIcon from '@/components/icons/TwitterIcon'
import MatrixIcon from '@/components/icons/MatrixIcon'
import WeChatIcon from '@/components/icons/WeChatIcon'

// ====================================================================== Export
export default {
  name: 'SocialIcons',

  components: {
    SlackIcon,
    TwitterIcon,
    MatrixIcon,
    WeChatIcon
  },

  computed: {
    ...mapGetters({
      siteContent: 'global/siteContent'
    }),
    links () {
      const networks = ['Slack', 'Twitter', 'Matrix', 'WeChat']
      const siteContent = this.siteContent
      const links = []
      if (siteContent.general && siteContent.general.social_icons) {
        if (Array.isArray(siteContent.general.social_icons)) {
          siteContent.general.social_icons.forEach((item) => {
            if (networks.includes(item.network) && typeof item.href === 'string' && item.href !== '') {
              links.push(item)
            }
          })
        }
      }
      return links
    }
  }
}
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
::v-deep .social-icons {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  margin-top: toRem(19);
  @include small {
    justify-content: flex-start;
  }
  a {
    width: 2rem;
    &:not(:last-child) {
      margin-right: toRem(9);
    }
  }
  svg {
    display: block;
    width: 100%;
    path {
      fill: white;
    }
  }
}
</style>
