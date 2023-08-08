<template>
  <div
    :class="['project-card', format]"
    @click="toggleExpanded">
    <div class="card-inner-wrapper">

      <svg
        class="dummy-gradient"
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient
            id="card-icon-gradient"
            x1="4.43478"
            y1="0.667602"
            x2="19.8276"
            y2="2.58746"
            gradientUnits="userSpaceOnUse">
            <stop stop-color="#60C1FF" />
            <stop offset="1" stop-color="#5DE3F2" />
          </linearGradient>
        </defs>
      </svg>

      <FVMIcon
        v-if="fvm"
        class="fvm-icon" />

      <div class="thumbnail">
        <img :src="$relativity(`/images/projects/${logo}`)" :alt="imageAlt" />
      </div>

      <div class="content">
        <p class="title">
          <span>{{ title }}</span>
        </p>
        <div :class="['description', { expanded }, { 'clip': !blockDescription }]">
          <span>{{ description }}</span>
          <span v-if="tagString" class="tags">{{ tagString }}</span>
          <div v-if="socialLinks.length" class="socials">
            <Button
              v-for="obj in socialLinks"
              :key="Object.keys(obj)[0]"
              tag="a"
              :to="Object.values(obj)[0]"
              target="_blank"
              class="social-icon">
              <template #icon-before>
                <component
                  :is="getSocialIcon(Object.keys(obj)[0])"
                  :aria-label="Object.keys(obj)[0]" />
              </template>
            </Button>
          </div>
        </div>

        <div class="button-row">
          <Button
            type="outline"
            tag="a"
            text="Go"
            :to="primaryCta"
            :disabled="!primaryCta"
            target="_blank"
            class="external-link scale-up">
            <template #icon-after>
              ↗
            </template>
          </Button>
          <Button
            tag="button"
            text="More"
            :class="['see-more', 'scale-up', { expanded }]">
            <template #icon-after>
              <SelectorToggle />
            </template>
          </Button>
        </div>

      </div>

    </div>
  </div>
</template>

<script>
// ====================================================================== Import
import Button from '@/modules/zero/core/components/Button'
import SelectorToggle from '@/modules/zero/core/components/icons/SelectorToggle'

import SlackIcon from '@/components/icons/SlackIcon'
import TwitterIcon from '@/components/icons/TwitterIcon'
import MatrixIcon from '@/components/icons/MatrixIcon'
import WeChatIcon from '@/components/icons/WeChatIcon'
import GithubIcon from '@/components/icons/GithubIcon'
import DiscordIcon from '@/components/icons/DiscordIcon'
import GenericLinkIcon from '@/components/icons/GenericLinkIcon'
import YoutubeIcon from '@/components/icons/YoutubeIcon'
import CodeIcon from '@/components/icons/CodeIcon'
import FVMIcon from '@/components/icons/FVMIcon'

// ====================================================================== Export
export default {
  name: 'ProjectCard',

  components: {
    Button,
    SelectorToggle,
    SlackIcon,
    TwitterIcon,
    MatrixIcon,
    WeChatIcon,
    GithubIcon,
    DiscordIcon,
    YoutubeIcon,
    GenericLinkIcon,
    CodeIcon,
    FVMIcon
  },

  props: {
    format: {
      type: String,
      default: 'block-view',
      required: false
    },
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      default: '',
      required: false
    },
    logo: {
      type: String,
      default: '',
      required: false
    },
    url: {
      type: String,
      default: '',
      required: false
    },
    enableImageAlt: {
      type: Boolean,
      default: true,
      required: false
    },
    tags: {
      type: [Array, Boolean],
      default: false,
      required: false
    },
    social: {
      type: Array,
      required: false,
      default: () => []
    }
  },

  data () {
    return {
      expanded: false,
      blockDescription: false
    }
  },

  computed: {
    componentType () {
      if (this.navigationBehavior === 0) {
        return 'div'
      } else if (this.navigationBehavior === 1) {
        return 'a'
      }
      return 'NuxtLink'
    },
    navigateToProject () {
      if (this.navigationBehavior === 0) {
        return null
      }
      return `/project/${this.slug}`
    },
    primaryCta () {
      if (this.url) { return this.url }
      return null
    },
    imageAlt () {
      if (!this.enableImageAlt) {
        return null
      }
      return this.title
    },
    tagString () {
      if (Array.isArray(this.tags)) {
        return `Tags: ${this.tags.join(', ')}`
      }
      return false
    },
    fvm () {
      return this.tags && this.tags.includes('fvm')
    },
    socialLinks () {
      const slug = this.$Slugify(this.title.replaceAll('.', ' '))
      return this.social.concat([{
        repo: `https://github.com/filecoin-project/ecodash/blob/main/content/projects/${slug}.json`
      }])
    }
  },

  watch: {
    expanded (val) {
      if (val) {
        this.blockDescription = true
      } else {
        setTimeout(() => {
          this.blockDescription = false
        }, 250)
      }
    }
  },

  methods: {
    toggleExpanded () {
      this.expanded = !this.expanded
    },
    getSocialIcon (name) {
      switch (name) {
        case 'twitter' : return 'TwitterIcon'
        case 'github' : return 'GithubIcon'
        case 'wechat' : return 'WeChatIcon'
        case 'slack' : return 'SlackIcon'
        case 'matrix' : return 'MatrixIcon'
        case 'discord' : return 'DiscordIcon'
        case 'youtube' : return 'YoutubeIcon'
        case 'repo' : return 'CodeIcon'
        default : return 'GenericLinkIcon'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
.project-card {
  position: relative;
  padding: 0.625rem;
  opacity: 0;
  cursor: pointer;
  animation: fadein 0.3s 1;
  animation-fill-mode: forwards;
  border-radius: 2px;
  border: 2px solid #0D222B;
  background: $blackSapphire;
  margin-bottom: 0.625rem;
  &:hover {
    .see-more {
      transform: scale(1.1);
    }
  }
}

.list-view {
  .card-inner-wrapper {
    position: relative;
    @include borderRadius_Medium;
    display: flex;
    flex-direction: row;
    height: 100%;
    z-index: 2;
    @include small {
      margin-top: 0.5rem;
    }
  }
  .thumbnail {
    width: toRem(45);
    height: toRem(45);
    margin-right: 0.625rem;
    background-color: $white;
    @include small {
      position: absolute;
      top: 0;
      left: 0;
      width: toRem(40);
      height: toRem(40);
    }
  }
  .fvm-icon {
    position: absolute;
    right: 0;
    top: 0;
    width: 1rem;
    height: 1.5rem;
    @include small {
      width: 0.625rem;
      height: 0.875rem;
      top: toRem(-13);
      right: toRem(-5);
    }
  }
  .content {
    padding-left: 0.125rem;
    width: calc(100% - toRem(55));
    @include small {
      padding-left: 0;
      width: 100%;
    }
  }
  .title,
  .description {
    padding-left: 0.5rem;
  }
  .title {
    font-size: 1rem;
    font-weight: 600;
    line-height: leading(30, 16);
    letter-spacing: 0.36px;
    @include small {
      padding-left: toRem(52);
      font-size: 0.875rem;
      line-height: leading(21, 14);
      height: toRem(40);
      display: flex;
      align-items: center;
      span {
        display: block;
      }
    }
  }
  .description {
    padding-bottom: 0.125rem;
    font-size: toRem(14);
    line-height: leading(21, 14);
    letter-spacing: 0.5px;
    max-height: toRem(42);
    transition: max-height 250ms ease;
    overflow: hidden;
    @include small {
      margin-top: 0.625rem;
      font-size: 0.75rem;
      line-height: leading(18, 12);
      max-height: toRem(79);
    }
    &.clip {
      display: -webkit-box;
      -webkit-box-flex: 1;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      @include small {
        -webkit-line-clamp: 4;
      }
    }
    &.expanded {
      max-height: toRem(200);
      @include small {
        max-height: toRem(500);
      }
      .tags,
      .socials {
        opacity: 1;
      }
    }
    span {
      display: block;
    }
  }
  .button-row {
    display: flex;
    padding-top: 1rem;
    ::v-deep {
      .button {
        height: toRem(30);
        .text,
        .item-after {
          font-size: toRem(14);
          font-weight: 500;
          line-height: leading(18, 14);
          @include small {
            font-size: 0.75rem;
            line-height: leading(18, 12);
          }
        }
      }
    }
  }
  .external-link {
    display: flex;
    padding: toRem(5) toRem(7);
    &:before,
    &:after {
      border-radius: 1px;
    }
    ::v-deep .text {
      background-position: 0%;
    }
    ::v-deep .item-after {
      transform: scale(0.9);
    }
    &:hover {
      ::v-deep .text {
        background-position: 100%;
      }
      ::v-deep .item-after {
        transform: scale(1.0);
      }
    }
    &:active {
      ::v-deep .item-after {
        color: $blackSapphire;
      }
    }
    &.disabled {
      &:hover {
        ::v-deep .text {
          background-position: 0%;
        }
        ::v-deep .item-after {
          transform: scale(0.9);
        }
      }
      &:active {
        ::v-deep .item-after {
          color: $white;
        }
      }
    }
  }
  .see-more {
    padding: toRem(5) toRem(10);
    ::v-deep .item-after {
      display: flex;
    }
    &:hover {
      ::v-deep .item-after {
        transform: none;
      }
    }
    &.expanded {
      ::v-deep .item-after {
        transform: rotate(-180deg);
      }
    }
  }
  .tags {
    color: rgba(255, 255, 255, 0.70);
    font-size: toRem(13);
    font-style: italic;
    line-height: leading(25, 13);
    margin-top: toRem(5);
    margin-bottom: toRem(15);
    transition: 250ms ease;
    opacity: 0;
    @include small {
      font-size: 0.75rem;
      line-height: leading(18, 12);
    }
  }
  .socials {
    display: flex;
  }
  .social-icon {
    transform: scale(1);
    transition: 250ms ease;
    &:not(:last-child) {
      margin-right: 1rem;
    }
    &:hover {
      transform: scale(1.15);
    }
    ::v-deep .button-content {
      padding: 0;
    }
    ::v-deep .icon {
      width: 1.25rem;
      height: 1.25rem;
      svg {
        width: 100%;
        height: 100%;
        transform: scale(1);
      }
      svg,
      path {
        // fill: #5DE3F2;
        fill: url(#card-icon-gradient);
      }
    }
  }
}

.dummy-gradient {
  position: absolute;
}

@keyframes fadein {
  0%   { opacity: 0; }
  100% { opacity: 1; }
}

// /////////////////////////////////////////////////////////////// Hover Effects
.project-card {
  &:before,
  &:after {
    content: '';
    position: absolute;
    z-index: 1;
    border-radius: inherit;
    box-sizing: border-box;
    transition: opacity 250ms linear, border 250ms linear;
  }
  &:before {
    width: calc(100% + 2px);
    height: calc(100% + 2px);
    top: -1px;
    left: -1px;
    opacity: 0;
    @include lightOceanGradient;
  }
  &:after {
    background-color: $blackSapphire;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
  }
  &:hover {
    &:before {
      opacity: 1;
    }
    &:after {
      transition: border 0ms linear;
    }
  }
}

.scale-up {
  &:not(.disabled) {
    transition: 200ms linear;
    transform: scale(1);
    &:hover {
      transform: scale(1.1);
    }
  }
}

</style>
