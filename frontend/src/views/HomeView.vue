<template>
  <div class="home-view">
    <div class="bg-layers">
      <div class="sun-dot"></div>
      <img src="@/assets/images/deco-line.png" class="deco-line line-left" />
      <img src="@/assets/images/deco-line.png" class="deco-line line-right" />
    </div>

    <div class="content">
      <div class="brand">LINSY 林氏</div>

      <div class="headline-ribbon">
        <span>2025年风险账单来啦!</span>
      </div>

      <div class="title-block">
        <h1 class="title">征途坎坷成画</h1>
        <h2 class="subtitle">沿途波澜皆景</h2>
      </div>

      <div class="cta-area">
        <img src="@/assets/images/char-home.png" class="char-img" />
        <button class="start-btn" @click="startBill">立刻开启</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import gsap from 'gsap'
import { onMounted } from 'vue'

const router = useRouter()

const startBill = () => {
  router.push('/bill')
}

onMounted(() => {
  gsap.from('.headline-ribbon', { y: -30, opacity: 0, duration: 0.6 })
  gsap.from('.title-block', { y: 24, opacity: 0, duration: 0.8, delay: 0.2 })
  gsap.from('.char-img', { y: 40, opacity: 0, duration: 0.8, delay: 0.5, ease: 'power2.out' })
  gsap.from('.start-btn', { scale: 0.85, opacity: 0, duration: 0.6, delay: 0.7, ease: 'back.out(1.5)' })
})
</script>

<style lang="scss" scoped>
.home-view {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
  background-image: url('@/assets/images/common-bg.png');
  background-size: cover;
  background-position: center;
}

.bg-layers {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.sun-dot {
  position: absolute;
  top: 22%;
  right: 16%;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: #ffe100;
  z-index: 2;
}

.deco-line {
  position: absolute;
  opacity: 0.24;
  filter: saturate(0.6);
}

.line-left {
  top: 3%;
  left: -18%;
  width: 70%;
  transform: rotate(-2deg);
}

.line-right {
  bottom: 10%;
  right: -26%;
  width: 72%;
  transform: rotate(180deg);
}

.content {
  position: relative;
  z-index: 3;
  width: 100%;
  height: 100%;
  padding: max(24px, env(safe-area-inset-top)) 20px max(30px, env(safe-area-inset-bottom)) 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.brand {
  font-size: 1.05rem;
  font-weight: 700;
  color: #0b4b67;
  letter-spacing: 0.5px;
  margin-top: 2px;
}

.headline-ribbon {
  margin-top: 30px;
  background: linear-gradient(90deg, #2d73bb, #316fc3);
  color: #fff;
  font-size: clamp(1.45rem, 5.2vw, 1.95rem);
  font-weight: 800;
  letter-spacing: 1px;
  padding: 7px 32px;
  transform: skew(-8deg);
  box-shadow: 0 6px 0 rgba(17, 72, 128, 0.55);
  position: relative;
  z-index: 4;

  span {
    display: inline-block;
    transform: skew(8deg);
  }

  &::before,
  &::after {
    content: '';
    position: absolute;
    top: 8px;
    width: 6px;
    height: 34px;
    background: rgba(42, 101, 172, 0.95);
  }

  &::before {
    left: 8px;
  }

  &::after {
    right: 8px;
  }
}

.title-block {
  margin-top: 24vh;
  text-align: center;
  z-index: 4;
}

.title,
.subtitle {
  margin: 0;
  color: #fff;
  font-weight: 800;
  line-height: 1.08;
  letter-spacing: 1px;
  font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
  font-style: italic;
  text-shadow:
    3px 3px 0 #2c63b5,
    0 1px 0 rgba(0, 0, 0, 0.15);
}

.title {
  font-size: clamp(2.45rem, 9.4vw, 4.4rem);
}

.subtitle {
  margin-top: 10px;
  font-size: clamp(2.3rem, 9vw, 4rem);
}

.cta-area {
  position: absolute;
  left: 50%;
  bottom: 48px;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 3;
}

.char-img {
  width: min(158px, 34vw);
  object-fit: contain;
  margin-bottom: -6px;
  transform: translateX(-78px);
  filter: drop-shadow(0 8px 12px rgba(0, 0, 0, 0.12));
}

.start-btn {
  min-width: min(340px, 76vw);
  border: 3px solid #f3b900;
  border-radius: 999px;
  padding: 12px 38px;
  font-size: clamp(2rem, 6.8vw, 2.55rem);
  font-weight: 900;
  line-height: 1;
  color: #1976cc;
  background: linear-gradient(180deg, #ffe756 0%, #ffef00 58%, #ffd12a 100%);
  box-shadow:
    0 8px 0 #ec9f00,
    0 14px 24px rgba(184, 125, 0, 0.35);
  cursor: pointer;
  transition: transform 0.2s ease, filter 0.2s ease;

  &:hover {
    filter: brightness(1.04);
  }

  &:active {
    transform: translateY(3px);
    box-shadow:
      0 4px 0 #ec9f00,
      0 10px 16px rgba(184, 125, 0, 0.3);
  }
}

@media (max-width: 420px) {
  .headline-ribbon {
    margin-top: 24px;
    padding: 7px 28px;
    font-size: 1.45rem;
  }

  .title-block {
    margin-top: 28vh;
  }

  .title {
    font-size: 2.15rem;
  }

  .subtitle {
    font-size: 2rem;
  }

  .char-img {
    width: 122px;
    transform: translateX(-50px);
  }

  .start-btn {
    min-width: 248px;
    font-size: 1.8rem;
    padding: 11px 28px;
  }
}

@media (min-height: 900px) {
  .title-block {
    margin-top: 27vh;
  }

  .cta-area {
    bottom: 64px;
  }
}

@media (max-height: 700px) {
  .title-block {
    margin-top: 18vh;
  }

  .cta-area {
    bottom: 30px;
  }

  .start-btn {
    font-size: 1.65rem;
  }
}
</style>

