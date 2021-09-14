<template>
  <form
    id="mailchimp-form"
    :action="action"
    method="post"
    target="_blank">

    <div class="panel-top">
      <span class="email">
        <input
          required="required"
          type="email"
          aria-label="Email Address"
          :placeholder="placeholder"
          class="focus-visible"
          name="EMAIL" />
      </span>
      <span class="submit">
        <input
          type="submit"
          :value="buttonText"
          class="focus-visible"
          name="subscribe" />
      </span>
    </div>

    <!-- <div class="panel-bottom">
      <input
        type="checkbox"
        required=""
        name="gdpr[28879]"
        class="focus-visible"
        value="Y" />
      <span>
        {{ checkboxText }}
      </span>
    </div> -->

    <div aria-hidden="true" style="position: absolute; left: -5000px">
      <input
        type="text"
        name="b_25473244c7d18b897f5a1ff6b_cad54b2230"
        tabindex="-1"
        value="">
    </div>

  </form>
</template>

<script>
// ====================================================================== Export
export default {
  name: 'ShipyardMailchimpForm',

  props: {
    action: {
      type: String,
      required: false,
      default: 'https://example.com'
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
  .panel-top {
    .email,
    .submit {
      @include whiteBorderBack;
      box-shadow: none;
      position: relative;
      margin-left: 9px;

      input {
        @include fontSize_Small;
        font-family: $font_Secondary;
        font-weight: $fontWeight_Regular;
        background: none;
        box-shadow: none;
        height: 30px;
        padding: 0 20px;
      }

      &:before,
      &:after {
        content: '';
        position: absolute;
        display: block;
        width: 100%;
        height: 100%;
      }

      &:before {
        @include whiteBorderBack;
        background: $cadmiumBlue;
        top: -7px;
        left: -6px;
        z-index: -1;
      }

      &:after {
        @include whiteBorderBack;
        top: -13px;
        left: -11px;
        z-index: -2;
      }
    }

    .email {
      background: $midnight;

      input {
        color: $white;
        &::placeholder {
          color: $white;
          opacity: 1;
        }
      }

    }

    .submit {
      @include oceanBlueGradient;

      input {
        color: $blackSapphire;
        margin-left: 0;
      }
    }
  }
}
</style>
