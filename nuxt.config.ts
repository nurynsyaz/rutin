// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2026-11-03',
  ssr: false,
  devtools: { enabled: true },

  modules: [
    '@pinia/nuxt',
    '@nuxtjs/i18n',
    '@nuxt/icon',
    '@nuxt/fonts',
    '@vite-pwa/nuxt',
    '@nuxt/eslint',
  ],

  css: ['~/assets/css/main.css'],

  vite: {
    plugins: [tailwindcss()],
  },

  runtimeConfig: {
    public: {
      dataSource: 'mock',
      mockLatencyMinMs: 150,
      mockLatencyMaxMs: 600,
    },
  },

  fonts: {
    families: [
      { name: 'Plus Jakarta Sans', provider: 'google' },
      { name: 'JetBrains Mono', provider: 'google' },
    ],
  },

  // Bundle the Lucide icon set at build time instead of fetching
  // from a CDN at runtime. Required for offline (SH-01) and CSP.
  icon: {
    serverBundle: 'local',
  },

  i18n: {
    strategy: 'no_prefix',
    defaultLocale: 'en',
    langDir: 'locales',
    locales: [
      { code: 'en', name: 'English', file: 'en.json' },
      { code: 'ms', name: 'Bahasa Melayu', file: 'ms.json' },
    ],
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'rutin_locale',
      redirectOn: 'root',
    },
  },

  pwa: {
    registerType: 'prompt',
    client: {
      installPrompt: true,
    },
    manifest: {
      name: 'Rutin',
      short_name: 'Rutin',
      description: 'Plan the day once. Repeat what works.',
      display: 'standalone',
      start_url: '/today',
      theme_color: '#0F766E',
      background_color: '#F6F7F9',
      icons: [
        { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
        { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
        {
          src: '/icons/icon-maskable-512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'maskable',
        },
      ],
    },
    workbox: {
      navigateFallback: '/200.html',
      globPatterns: ['**/*.{js,css,html,png,svg,ico,woff2}'],
      runtimeCaching: [
        {
          urlPattern: ({ request }: { request: { destination: string } }) =>
            request.destination === 'image',
          handler: 'CacheFirst',
          options: { cacheName: 'rutin-images' },
        },
      ],
    },
  },

  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      title: 'Rutin',
      meta: [
        { name: 'theme-color', content: '#0F766E' },
        {
          name: 'viewport',
          content: 'width=device-width, initial-scale=1, viewport-fit=cover',
        },
      ],
    },
  },

  typescript: { strict: true },
})