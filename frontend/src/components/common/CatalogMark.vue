<template>
  <svg class="catalog-mark" viewBox="0 0 24 24" aria-hidden="true">
    <g
      fill="none"
      stroke="currentColor"
      stroke-width="1.75"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <template v-if="name === '整改分类'">
        <rect x="6" y="3.5" width="12" height="17" rx="1.5" />
        <path d="M9 3.5h6v2.5H9zM9 10h6M9 14h4" />
      </template>
      <template v-else-if="name === '追责通报'">
        <path d="M6 9h3l7-3v12l-7-3H6z" />
        <path d="M18.5 10.2a3 3 0 0 1 0 3.6" />
      </template>
      <template v-else-if="name === '流程整改'">
        <circle cx="6" cy="12" r="2" />
        <circle cx="12" cy="7" r="2" />
        <circle cx="18" cy="12" r="2" />
        <path d="M8 11.2 10.2 8.4M13.8 8.4 16 11.2" />
      </template>
      <template v-else-if="name === '挽损整改'">
        <path d="M16 7H9a4 4 0 0 0 0 8h8" />
        <path d="M14.5 12.5 17 15l-2.5 2.5" />
      </template>
      <template v-else-if="name === '系统整改'">
        <rect x="4" y="5" width="16" height="14" rx="1.5" />
        <path d="M4 9.5h16" />
      </template>
      <template v-else-if="name === '其他整改'">
        <circle cx="6.5" cy="12" r="1.15" fill="currentColor" stroke="none" />
        <circle cx="12" cy="12" r="1.15" fill="currentColor" stroke="none" />
        <circle cx="17.5" cy="12" r="1.15" fill="currentColor" stroke="none" />
      </template>
      <template v-else-if="name === '风险分类'">
        <path d="M12 3.5 19 6.2V12c0 3.6-2.8 6.2-7 8.3-4.2-2.1-7-4.7-7-8.3V6.2L12 3.5z" />
      </template>
      <template v-else-if="name === '信数管理'">
        <rect x="5.5" y="11" width="13" height="8.5" rx="1.5" />
        <path d="M8.5 11V8.2a3.5 3.5 0 0 1 7 0V11" />
      </template>
      <template v-else-if="name === '渠道管理'">
        <path d="M12 4v5M12 9H7M12 9h5M7 9v5M17 9v5" />
        <circle cx="12" cy="4" r="1.2" />
        <circle cx="7" cy="16" r="1.2" />
        <circle cx="17" cy="16" r="1.2" />
      </template>
      <template v-else-if="name === '物流仓储管理'">
        <path d="M3.5 8.5h10v7h-10zM13.5 11H18l2.5 2.8V15.5h-7" />
        <circle cx="8" cy="17.2" r="1.4" />
        <circle cx="17" cy="17.2" r="1.4" />
      </template>
      <template v-else-if="name === '战略管理'">
        <circle cx="12" cy="12" r="7.2" />
        <path d="M12 6.2v2.2M12 15.6v2.2M6.2 12h2.2M15.6 12h2.2" />
      </template>
      <template v-else-if="name === '供应链管理'">
        <path d="M10 8.5H7.8A2.8 2.8 0 0 0 7.8 14H11" />
        <path d="M14 15.5h2.2a2.8 2.8 0 0 0 0-5.5H13" />
      </template>
      <template v-else-if="name === '行政管理'">
        <path d="M5 19.5h14M7 19.5V9.5h10v10M9.5 9.5V6h5v3.5" />
        <path d="M9.2 13h1.4M13.4 13h1.4M9.2 16.2h1.4M13.4 16.2h1.4" />
      </template>
      <template v-else-if="name === '财务管理'">
        <rect x="6" y="4" width="12" height="16" rx="1.5" />
        <path d="M9 9h6M9 12.5h6M9 16h4" />
      </template>
      <template v-else-if="name === '客服管理'">
        <path d="M5 6.5h12.5a1.5 1.5 0 0 1 1.5 1.5v6a1.5 1.5 0 0 1-1.5 1.5H10l-3.2 2.6V15.5H5A1.5 1.5 0 0 1 3.5 14V8A1.5 1.5 0 0 1 5 6.5z" />
      </template>
      <template v-else-if="name === '产品管理'">
        <path d="M4.5 12.2 12 4.7h6.2V11l-7.5 7.5z" />
        <circle cx="15.6" cy="8.2" r="1" />
      </template>
      <template v-else-if="name === '工程管理'">
        <path d="M6 18 18 6" />
        <path d="M8.2 15.8v2.2h2.2M11 13v2.2h2.2M13.8 10.2V12h2.2" />
      </template>
      <template v-else-if="name === '人力资源管理'">
        <circle cx="12" cy="8" r="2.6" />
        <path d="M6.8 18.2c.6-3 2.6-4.5 5.2-4.5s4.6 1.5 5.2 4.5" />
      </template>
      <template v-else-if="name === '印章与档案管理'">
        <circle cx="12" cy="9" r="4.2" />
        <path d="M9.2 9h5.6M12 6.8v4.4M8 16.2h8l-1 2.6H9z" />
      </template>
      <template v-else-if="name === '品质管理'">
        <circle cx="12" cy="12" r="7" />
        <path d="M8.6 12.2 11 14.6l4.6-5" />
      </template>
      <template v-else-if="name === '研发管理'">
        <path d="M14.2 5.2 18.8 9.8 9.2 19.4H4.6v-4.6z" />
        <path d="M12.4 7 17 11.6" />
      </template>
      <template v-else-if="name === '营销管理'">
        <path d="M5 10h3.2L16 6.2v11.6L8.2 14H5z" />
        <path d="M18.2 9.4c1.1.8 1.1 4.4 0 5.2" />
      </template>
      <template v-else>
        <circle cx="12" cy="12" r="2" />
      </template>
    </g>
  </svg>
</template>

<script setup lang="ts">
defineProps<{ name: string }>()
</script>

<style scoped>
.catalog-mark {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
  color: #0a5c58;
  display: block;
}
</style>
