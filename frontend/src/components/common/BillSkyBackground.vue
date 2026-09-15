<template>
  <div
    class="bill-sky"
    :class="[`bill-sky--${variant}`, { 'bill-sky--animated': animated }]"
    aria-hidden="true"
  >
    <!-- 高清原画底图：100%保真呈现用户上传的深空星轨原图 -->
    <div
      class="bill-sky__bg-img"
      :style="{ backgroundImage: `url(${bgImage})` }"
    />

    <!-- 左侧内容区轻微氛围暗调层，保证文字/卡片绝佳可读性，同时不遮挡右侧光轨与角色 -->
    <div class="bill-sky__content-scrim" />

    <!-- 星空微尘闪烁效果（仅在激活页展现，增强动态空间感） -->
    <div v-if="animated" class="bill-sky__star-dust" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  resolveSkyVariant,
  getBgImageForVariant,
  type SkyBgVariant,
} from '@/constants/pageBackgrounds'
import type { PageType } from '@/types/bill'

const props = withDefaults(
  defineProps<{
    variant?: SkyBgVariant
    pageType?: PageType | 'loading'
    animated?: boolean
  }>(),
  {
    animated: false,
  }
)

const variant = computed(() => resolveSkyVariant(props.variant, props.pageType))
const bgImage = computed(() => getBgImageForVariant(variant.value))
</script>

<style lang="scss" scoped>
@use '@/styles/bill-theme.scss' as *;

.bill-sky {
  position: absolute;
  inset: 0;
  z-index: 0;
  overflow: hidden;
  pointer-events: none;
  isolation: isolate;
  background-color: #03182f;
}

.bill-sky__bg-img {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center center;
  background-repeat: no-repeat;
  will-change: transform;
  transform: scale(1.002);
  transition: opacity 0.4s ease;
}

/* 顶部与左上角微弱遮罩，为标题和卡片提供极佳可读性，保留右下侧人物和光轨的纯净展现 */
.bill-sky__content-scrim {
  position: absolute;
  inset: 0;
  background: radial-gradient(
    circle at 25% 30%,
    rgba(2, 18, 38, 0.22) 0%,
    rgba(2, 18, 38, 0.08) 55%,
    transparent 80%
  );
  pointer-events: none;
}

.bill-sky--cover .bill-sky__content-scrim {
  background: none;
}

.bill-sky__star-dust {
  position: absolute;
  inset: 0;
  opacity: 0.65;
  background-image:
    radial-gradient(1.5px 1.5px at 15% 18%, rgba(255, 255, 255, 0.85), transparent),
    radial-gradient(1px 1px at 32% 42%, rgba(255, 255, 255, 0.6), transparent),
    radial-gradient(1.5px 1.5px at 48% 12%, rgba(255, 215, 0, 0.8), transparent),
    radial-gradient(1px 1px at 20% 75%, rgba(34, 228, 224, 0.7), transparent),
    radial-gradient(1.5px 1.5px at 85% 25%, rgba(255, 255, 255, 0.75), transparent);
  background-size: 160px 200px;
  animation: starBreathe 6s ease-in-out infinite alternate;
}

@keyframes starBreathe {
  0% {
    opacity: 0.45;
  }
  100% {
    opacity: 0.85;
  }
}

@media (prefers-reduced-motion: reduce) {
  .bill-sky__star-dust {
    animation: none !important;
  }
}
</style>
