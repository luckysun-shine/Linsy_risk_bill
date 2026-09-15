<template>
  <div class="slide-shell" :class="[`overlay-${overlay}`]">
    <!-- 高清原图底图层 -->
    <BillSkyBackground
      :variant="resolvedVariant"
      :show-deco="false"
      :animated="animated"
    />

    <div v-if="overlay !== 'none'" class="slide-shell__tint" aria-hidden="true" />

    <div class="slide-shell__content">
      <slot />
    </div>

    <!-- 仅当强制指定外部角色且非底图自带角色时显示 -->
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
import {
  resolveSkyVariant,
  type SkyBgVariant,
} from '@/constants/pageBackgrounds'
import type { PageType } from '@/types/bill'
import BillSkyBackground from '@/components/common/BillSkyBackground.vue'

const props = withDefaults(
  defineProps<{
    character?: string
    charPosition?: 'bottom-left' | 'bottom-right' | 'bottom-center' | 'beside-card'
    showDeco?: boolean
    overlay?: 'none' | 'light' | 'warm' | 'alert'
    skyVariant?: SkyBgVariant
    pageType?: PageType
    animated?: boolean
  }>(),
  {
    character: 'none',
    charPosition: 'bottom-right',
    showDeco: false,
    overlay: 'light',
    animated: false,
  }
)

const resolvedVariant = computed(() =>
  resolveSkyVariant(props.skyVariant, props.pageType)
)

/**
 * 原图已内置高质量3D角色与星灯光轨，无需在前端重复叠加2D小人切图。
 * 仅当明确传入特定自定义切图URL时才渲染。
 */
const charSrc = computed(() => {
  if (!props.character || props.character === 'none' || ['home', 'detail1', 'detail2'].includes(props.character)) {
    return ''
  }
  return props.character
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

.overlay-light .slide-shell__tint {
  background: radial-gradient(
    circle at 30% 30%,
    rgba(2, 18, 38, 0.18) 0%,
    transparent 75%
  );
}

.overlay-warm .slide-shell__tint {
  background: radial-gradient(
    circle at 30% 30%,
    rgba(255, 215, 0, 0.04) 0%,
    rgba(2, 18, 38, 0.15) 75%
  );
}

.overlay-alert .slide-shell__tint {
  background: radial-gradient(
    circle at 30% 30%,
    rgba(255, 80, 80, 0.05) 0%,
    rgba(2, 18, 38, 0.18) 75%
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
  padding: max(16px, env(safe-area-inset-top)) 16px max(78px, env(safe-area-inset-bottom));
  box-sizing: border-box;
}

.slide-shell__char {
  position: absolute;
  z-index: 3;
  pointer-events: none;
  object-fit: contain;
  filter:
    drop-shadow(0 10px 16px rgba(1, 18, 38, 0.4))
    drop-shadow(0 0 12px rgba(255, 183, 18, 0.12));
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
