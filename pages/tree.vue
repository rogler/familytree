<template>
  <section class="tree-page">
    <h1 class="wrap">Family tree</h1>
    <p class="wrap hint">Click a person to center the tree on them. Drag to pan, scroll to zoom.</p>
    <ClientOnly>
      <FamilyTree />
      <template #fallback><p class="wrap">Loading the tree…</p></template>
    </ClientOnly>
  </section>
</template>
