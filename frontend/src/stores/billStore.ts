import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { mockBillData } from '@/data/mockBillData'
import { fetchBillData } from '@/api/bill'
import type { BillData, PageConfigItem } from '@/types/bill'
import cardBg from '@/assets/images/card-bg.png'
import charHome from '@/assets/images/char-home.png'
import char1 from '@/assets/images/char-detail-1.png'
import char2 from '@/assets/images/char-detail-2.png'
import commonBg from '@/assets/images/common-bg.png'
import decoLine from '@/assets/images/deco-line.png'

const DEFAULT_PRELOAD = [cardBg, charHome, char1, char2, commonBg, decoLine]
const MOBILE_PRELOAD = [cardBg, charHome, char1, char2, decoLine]

function isMobileClient() {
  if (typeof navigator === 'undefined') return false
  return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
}

function preloadImage(src: string): Promise<void> {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => resolve()
    img.onerror = () => resolve()
    img.src = src
  })
}

export const useBillStore = defineStore('bill', () => {
  const billData = ref<BillData | null>(null)
  const isReady = ref(false)
  const loadingProgress = ref(0)
  const errorMessage = ref<string | null>(null)

  const visiblePages = computed<PageConfigItem[]>(() => {
    const pages = billData.value?.page_config ?? []
    return pages.filter((page) => page.type !== 'manager')
  })

  const templateVars = computed(() => {
    const d = billData.value
    if (!d) return {}
    return {
      ...d.summary_data,
      name: d.user.name,
      company: d.user.company,
      days: d.user.days,
      department: d.user.department,
    }
  })

  async function preloadAssets(urls: string[]) {
    const unique = [...new Set(urls.filter(Boolean))]
    if (unique.length === 0) {
      loadingProgress.value = 100
      return
    }
    let done = 0
    loadingProgress.value = 0
    await Promise.all(
      unique.map(async (url) => {
        await preloadImage(url)
        done += 1
        loadingProgress.value = Math.round((done / unique.length) * 100)
      })
    )
  }

  async function init(token?: string, year?: number) {
    const alreadyReady = isReady.value && billData.value != null
    if (!alreadyReady) {
      isReady.value = false
      loadingProgress.value = 0
    }
    errorMessage.value = null
    try {
      if (token) {
        // 有 token 必须拉后端真实账单，禁止静默回退 Mock（否则各部门链接会看到同一套财经中心数据）
        billData.value = await fetchBillData(token, year)
      } else if (import.meta.env.DEV) {
        billData.value = structuredClone(mockBillData)
      } else {
        throw new Error('缺少访问令牌，请使用完整链接打开账单')
      }

      const extra = billData.value.assets?.preload_images ?? []
      const basePreload = isMobileClient() ? MOBILE_PRELOAD : DEFAULT_PRELOAD
      const preloadList = [...basePreload, ...extra]
      await preloadAssets(preloadList)
      loadingProgress.value = 100
      isReady.value = true

      if (isMobileClient()) {
        void preloadImage(commonBg)
      }
    } catch (e) {
      errorMessage.value = e instanceof Error ? e.message : '加载失败'
      isReady.value = false
    }
  }

  return {
    billData,
    isReady,
    loadingProgress,
    errorMessage,
    visiblePages,
    templateVars,
    init,
    preloadAssets,
  }
})
