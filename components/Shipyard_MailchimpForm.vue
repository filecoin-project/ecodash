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
