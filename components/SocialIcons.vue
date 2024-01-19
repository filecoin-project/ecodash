<template>
  <div v-if="links.length" class="social-icons-container">

    <div ref="container" class="social-icons">
      <a
        v-for="link in links"
        :key="link.network"
        :href="link.href"
        target="_blank"
        rel="noopener noreferrer"
        class="social-link focus-visible">
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
import GithubIcon from '@/components/icons/GithubIcon'
import WeChatIcon from '@/components/icons/WeChatIcon'
import TelegramIcon from '@/components/icons/TelegramIcon'
import DiscordIcon from '@/components/icons/DiscordIcon'

// ====================================================================== Export
export default {
  name: 'SocialIcons',

  components: {
    SlackIcon,
    TwitterIcon,
    GithubIcon,
    WeChatIcon,
    TelegramIcon,
    DiscordIcon
  },

  computed: {
    ...mapGetters({
      siteContent: 'global/siteContent'
    }),
    links () {
      const networks = ['Slack', 'Twitter', 'WeChat', 'Telegram', 'Discord', 'Github']
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
    margin-top: toRem(23);
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

.social-link {
  transition: 200ms ease;
  transform: scale(1);
  &:hover {
    transform: scale(1.1);
  }
}
</style>
