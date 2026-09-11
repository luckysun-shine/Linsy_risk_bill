<template>
  <span class="tip-icon" :class="`tip-icon--${tone}`" aria-hidden="true" title="重点提示">
    <svg viewBox="0 0 24 24" fill="none">
      <path
        d="M12 3.2L21.2 19.6H2.8L12 3.2Z"
        fill="currentColor"
        opacity="0.16"
      />
      <path
        d="M12 4.4L19.6 18.4H4.4L12 4.4Z"
        stroke="currentColor"
        stroke-width="1.7"
        stroke-linejoin="round"
      />
      <path
        d="M12 9.2v4.6"
        stroke="currentColor"
        stroke-width="2.2"
        stroke-linecap="round"
      />
      <circle cx="12" cy="16.4" r="1.15" fill="currentColor" />
    </svg>
  </span>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    tone?: 'alert' | 'mint'
  }>(),
  {
    tone: 'alert',
  }
)
</script>

<style lang="scss" scoped>
.tip-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.2em;
  height: 1.2em;
  flex-shrink: 0;
  line-height: 0;
  vertical-align: -0.12em;

  svg {
    width: 100%;
    height: 100%;
    display: block;
  }

  &--alert {
    color: #ff3b6d;
    filter: drop-shadow(0 1px 2px rgba(255, 59, 109, 0.25));
  }

  &--mint {
    color: #148f88;
  }
}
</style>
