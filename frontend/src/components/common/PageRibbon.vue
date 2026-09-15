<template>
  <div class="page-ribbon">
    <span class="page-ribbon__text"><slot /></span>
    <span class="page-ribbon__glow-line" aria-hidden="true" />
  </div>
</template>

<style lang="scss" scoped>
@use '@/styles/bill-theme.scss' as *;

.page-ribbon {
  @include bill-ribbon;
  position: relative;
  font-size: clamp(1.4rem, 5.4vw, 1.85rem);
  font-weight: 900;
  letter-spacing: 1.5px;
  text-align: center;
  padding: var(--space-1) var(--space-4) var(--space-3);
  user-select: none;

  &__text {
    position: relative;
    z-index: 2;
    display: inline-block;
    transform: skewX(-4deg);
    color: #fff;
    text-shadow:
      2px 3px 0 $bill-brand-deep,
      0 0 20px rgba(34, 228, 224, 0.4);
  }

  &__glow-line {
    position: absolute;
    left: 6%;
    right: -4%;
    bottom: 2px;
    height: 3.5px;
    border-radius: 999px;
    background: linear-gradient(
      90deg,
      transparent 0%,
      $bill-aurora 25%,
      $bill-accent-yellow 70%,
      transparent 100%
    );
    box-shadow:
      0 0 10px rgba(255, 215, 0, 0.6),
      0 0 18px rgba(34, 228, 224, 0.35);
    transform: skewX(-24deg);
    pointer-events: none;
    z-index: 1;
  }
}
</style>
