<template>
  <div class="slide-shell" :class="[`overlay-${overlay}`]">
    <BillSkyBackground
      :variant="resolvedVariant"
      :show-deco="showDeco"
      :animated="animated"
    />
    <div v-if="overlay !== 'none'" class="slide-shell__tint" aria-hidden="true" />

    <div class="slide-shell__content">
      <slot />
    </div>

    <img
      v-if="charSrc"
      :src="charSrc"
      class="slide-shell__char"
      :class="charPosition"
      alt=""
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { IP_ASSETS, type IpAssetKey, type IpPosition } from '@/constants/ipAssets'
import {
  resolveSkyVariant,
  type SkyBgVariant,
} from '@/constants/pageBackgrounds'
import type { PageType } from '@/types/bill'
import BillSkyBackground from '@/components/common/BillSkyBackground.vue'

const props = withDefaults(
  defineProps<{
    character?: IpAssetKey | 'none'
    charPosition?: IpPosition
    showDeco?: boolean
    overlay?: 'none' | 'light' | 'warm' | 'alert'
    /** 天空背景变体；不传则根据 pageType 自动匹配 */
    skyVariant?: SkyBgVariant
    pageType?: PageType
    /** 云朵轻微漂移动画（建议绑定 isActive） */
    animated?: boolean
  }>(),
  {
    character: 'none',
    charPosition: 'bottom-right',
    showDeco: true,
    overlay: 'light',
    animated: false,
  }
)

const resolvedVariant = computed(() =>
  resolveSkyVariant(props.skyVariant, props.pageType)
)

const charSrc = computed(() => {
  if (props.character === 'none') return ''
  return IP_ASSETS[props.character]
})
</script>

<style lang="scss" scoped>
@use '@/styles/bill-theme.scss' as *;

.slide-shell {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
}

.slide-shell__tint {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 1;
}

/* 内容区薄层：与 BillSkyBackground 的 wash 叠加，强化卡片可读性 */
.overlay-light .slide-shell__tint {
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.06) 0%,
    rgba(64, 224, 208, 0.08) 100%
  );
}

.overlay-warm .slide-shell__tint {
  background: linear-gradient(
    180deg,
    rgba(255, 215, 0, 0.1) 0%,
    rgba(255, 255, 255, 0.08) 100%
  );
}

.overlay-alert .slide-shell__tint {
  background: linear-gradient(
    180deg,
    rgba(255, 80, 80, 0.05) 0%,
    rgba(255, 255, 255, 0.08) 100%
  );
}

.overlay-none .slide-shell__tint {
  display: none;
}

.slide-shell__content {
  position: relative;
  z-index: 2;
  isolation: isolate;
  width: 100%;
  height: 100%;
  padding: max(20px, env(safe-area-inset-top)) 16px max(88px, env(safe-area-inset-bottom));
  box-sizing: border-box;
}

.slide-shell__char {
  position: absolute;
  z-index: 3;
  pointer-events: none;
  object-fit: contain;
  filter: drop-shadow(0 8px 14px rgba(4, 31, 36, 0.22));
  will-change: transform, opacity;

  &.bottom-left {
    left: 0;
    bottom: 0;
    width: min(130px, 32vw);
    transform: translate(-8%, 4%);
  }

  &.bottom-right {
    right: 0;
    bottom: 0;
    width: min(140px, 34vw);
    transform: translate(6%, 2%);
  }

  &.bottom-center {
    left: 50%;
    bottom: 8px;
    width: min(150px, 36vw);
    transform: translateX(calc(-50% - 72px));
  }

  &.beside-card {
    right: 4%;
    bottom: 18%;
    width: min(120px, 28vw);
  }
}
</style>
