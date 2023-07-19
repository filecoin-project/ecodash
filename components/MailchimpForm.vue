<template>
  <form
    id="mailchimp-form"
    :action="action"
    method="post"
    target="_blank">

    <div class="form-container">
      <span class="email">
        <input
          required="required"
          type="email"
          aria-label="Email Address"
          :placeholder="placeholder"
          class="focus-visible"
          name="EMAIL" />
      </span>
      <Button
        type="cta"
        tag="button"
        class="submit-button">
        <template #icon-after>
          <input
            type="submit"
            :value="buttonText"
            class="focus-visible"
            name="subscribe" />
        </template>
      </Button>
    </div>

    <div aria-hidden="true" style="position: absolute; left: -5000px">
      <input
        type="text"
        name="b_25473244c7d18b897f5a1ff6b_cad54b2230"
        tabindex="-1"
        value="" />
    </div>

  </form>
</template>

<script>
// ====================================================================== Import
import Button from '@/modules/zero/core/components/Button'

// ====================================================================== Export
export default {
  name: 'MailchimpForm',

  components: {
    Button
  },

  props: {
    action: {
      type: String,
      required: false,
      default: 'https://protocol.us16.list-manage.com/subscribe/post-json?u=a1dfb670c4f1fb042e82a1f1d&id=ff0bee3cae'
    },
    buttonText: {
      type: String,
      required: false,
      default: 'Subscribe'
    },
    placeholder: {
      type: String,
      required: false,
      default: 'email@your.domain'
    },
    checkboxText: {
      type: String,
      required: false,
      default: 'Please send me the newsletter'
    }
  }
}
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
#mailchimp-form {
  .form-container {
    display: flex;
    flex-direction: row;
    margin-bottom: 0.5rem;
    @include small {
      margin-bottom: toRem(45);
      padding-right: toRem(66);
    }

    .email {
      box-shadow: none;
      position: relative;
      height: toRem(27);
      box-sizing: border-box;
      input {
        display: flex;
        font-size: toRem(14);
        line-height: leading(18, 14);
        letter-spacing: 0.5px;
        background: none;
        box-shadow: none;
        height: 100%;
        padding: 0 20px;
        @include small {
          font-size: toRem(12);
          line-height: leading(18, 12);
        }
      }
      &:before,
      &:after {
        box-sizing: inherit;
        content: '';
        position: absolute;
        display: block;
        width: 100%;
        height: 100%;
      }
      &:before {
        @include whiteBorderBack;
        background: $cadmiumBlue;
        top: -4px;
        left: -4px;
        z-index: -1;
      }
      &:after {
        @include whiteBorderBack;
        top: -8px;
        left: -8px;
        z-index: -2;
      }
    }

    .email {
      flex-grow: 1;
      @include whiteBorderBack;
      background: $midnight;
      margin-left: toRem(9);
      margin-right: toRem(13);
      input {
        color: $white;
        &::placeholder {
          color: $white;
          opacity: 1;
        }
      }
      &:before {
        background: $midnight;
        top: -4.5px;
        left: -4.5px;
      }
    }

    .submit-button {
      position: relative;
      z-index: 100;
      height: toRem(27);
      ::v-deep .button-content {
        input {
          display: flex;
          font-size: toRem(14);
          line-height: leading(18, 14);
          letter-spacing: 0.5px;
          background: none;
          box-shadow: none;
          height: 100%;
          padding: 0 20px;
          color: $blackSapphire;
          font-weight: 600;
          @include small {
            font-size: toRem(12);
            line-height: leading(18, 12);
          }
        }
      }
    }
  }
}
</style>
