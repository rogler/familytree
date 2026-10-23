<script setup lang="ts">
const GA_ID = 'G-L4DBG07T0H' // Google Analytics ID

useHead({
  script: [
    {
      src: `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`,
      async: true,
    },
    {
      innerHTML: `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        window.gtag = gtag;
        gtag('js', new Date());
        gtag('config', '${GA_ID}');
      `,
    },
  ],
})
</script>

<template>
  <header class="site-header">
    <NuxtLink to="/" class="brand">The Family</NuxtLink>
    <nav>
      <NuxtLink to="/">Home</NuxtLink>
      <NuxtLink to="/tree">Family tree</NuxtLink>
    </nav>
  </header>
  <main><NuxtPage /></main>
  <footer class="site-footer">
    Details of living family members are hidden.
  </footer>
</template>
