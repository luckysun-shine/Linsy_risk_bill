<template>
  <div class="page-ribbon">
    <span><slot /></span>
  </div>
</template>

<style lang="scss" scoped>
@use '@/styles/bill-theme.scss' as *;

.page-ribbon {
  @include bill-ribbon;
  position: relative;
  font-size: clamp(1.45rem, 5.6vw, 2rem);
  letter-spacing: 1px;
  text-align: center;

  span {
    display: inline-block;
    transform: none;
  }

  &::after {
    content: '';
    position: absolute;
    left: 8%;
    right: -10%;
    bottom: 3px;
    height: 4px;
    border-radius: 999px;
    background: linear-gradient(90deg, transparent, $bill-aurora 20%, $bill-accent-yellow 72%, transparent);
    box-shadow: 0 0 12px rgba(255, 215, 0, 0.45);
    transform: skewX(-28deg);
  }
}
</style>
