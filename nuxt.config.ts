export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: false },
  ssr: true, // `nuxt generate` prerenders to static HTML
  css: ['~/assets/main.css'],
  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      title: 'The Family Site',
      meta: [{ name: 'description', content: 'Our family tree and stories.' }]
    }
  },
  nitro: { prerender: { routes: ['/', '/tree'] } }
})
