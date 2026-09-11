import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const disableHmr = env.VITE_DISABLE_HMR === '1'

  return {
    plugins: [vue()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    server: {
      host: true,
      port: 5173,
      strictPort: false,
      // 手机通过局域网 IP 访问时，HMR WebSocket 连错地址会导致 Safari 反复崩溃
      hmr: disableHmr ? false : undefined,
      proxy: {
        '/api': {
          target: 'http://localhost:3000',
          changeOrigin: true,
        },
      },
    },
    preview: {
      host: true,
      port: 4173,
      strictPort: false,
    },
  }
})
