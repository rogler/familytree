<template>
  <div>
    <p v-if="error" class="wrap error">{{ error }}</p>
    <div ref="el" class="f3 tree-canvas" />
  </div>
</template>

<script setup>
import * as f3 from 'family-chart'
import 'family-chart/styles/family-chart.css'

const el = ref(null)
const error = ref('')
const route = useRoute()

onMounted(async () => {
  try {
    const data = await $fetch('/tree.json')
    if (!data?.length) { error.value = 'The tree has no people yet.'; return }

    const chart = f3.createChart(el.value, data)
    chart.setCardHtml().setCardDisplay([['first name', 'last name'], ['birthday']])

    const start = route.query.id || data[0].id
    chart.updateMainId(start)
    chart.updateTree({ initial: true })
  } catch (e) {
    error.value = `Could not load the family tree: ${e?.message || e}`
    console.error(e)
  }
})
</script>
