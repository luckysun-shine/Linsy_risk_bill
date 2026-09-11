<template>
  <div class="page-ribbon">
    <span><slot /></span>
  </div>
</template>

<style lang="scss" scoped>
@use '@/styles/bill-theme.scss' as *;

.page-ribbon {
  @include bill-ribbon;
  font-size: clamp(1.15rem, 4.2vw, 1.55rem);
  letter-spacing: 0.5px;
  text-align: center;

  span {
    display: inline-block;
    transform: skew(8deg);
  }
}
</style>
