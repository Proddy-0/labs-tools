<script setup lang="ts">
const value   = ref(100)
const fromUnit= ref('C')

const units = ['C', 'F', 'K', 'R', 'De', 'N', 'Re', 'Rø']
const names: Record<string, string> = {
  C: 'Celsius', F: 'Fahrenheit', K: 'Kelvin',
  R: 'Rankine', De: 'Delisle', N: 'Newton', Re: 'Réaumur', Rø: 'Rømer',
}

function toCelsius(v: number, unit: string): number {
  switch (unit) {
    case 'C':  return v
    case 'F':  return (v - 32) * 5/9
    case 'K':  return v - 273.15
    case 'R':  return (v - 491.67) * 5/9
    case 'De': return 100 - v * 2/3
    case 'N':  return v * 100/33
    case 'Re': return v * 5/4
    case 'Rø': return (v - 7.5) * 40/21
    default: return v
  }
}

function fromCelsius(c: number, unit: string): number {
  switch (unit) {
    case 'C':  return c
    case 'F':  return c * 9/5 + 32
    case 'K':  return c + 273.15
    case 'R':  return (c + 273.15) * 9/5
    case 'De': return (100 - c) * 3/2
    case 'N':  return c * 33/100
    case 'Re': return c * 4/5
    case 'Rø': return c * 21/40 + 7.5
    default: return c
  }
}

const results = computed(() => {
  const celsius = toCelsius(value.value, fromUnit.value)
  return units.map(u => ({
    unit: u,
    name: names[u],
    value: fromCelsius(celsius, u),
  }))
})

function fmt(n: number): string {
  if (Math.abs(n) >= 1e6 || (Math.abs(n) < 0.001 && n !== 0)) return n.toExponential(4)
  return n.toFixed(4).replace(/\.?0+$/, '')
}

const copied = ref('')
async function copy(text: string, key: string) {
  await navigator.clipboard.writeText(text)
  copied.value = key; setTimeout(() => copied.value = '', 1500)
}
</script>

<template>
  <div class="tool-layout">
    <div class="tool-row">
      <div class="tool-col" style="flex:1.5">
        <label class="tool-label">Valor</label>
        <input v-model.number="value" type="number" class="tool-input" />
      </div>
      <div class="tool-col">
        <label class="tool-label">Unidade de entrada</label>
        <select v-model="fromUnit" class="tool-sel">
          <option v-for="u in units" :key="u" :value="u">° {{ u }} — {{ names[u] }}</option>
        </select>
      </div>
    </div>

    <div style="display:flex;flex-direction:column;gap:0.4rem">
      <div v-for="r in results" :key="r.unit" class="result-row" :style="{ borderColor: r.unit === fromUnit ? 'var(--amber)' : undefined }">
        <span class="result-label" style="min-width:100px">° {{ r.unit }} <span style="font-weight:400">{{ r.name }}</span></span>
        <div class="row-actions">
          <span class="result-value" style="color: r.unit === fromUnit ? 'var(--amber)' : 'var(--text)'">{{ fmt(r.value) }}</span>
          <button class="copy-btn" :class="{ copied: copied === r.unit }" @click="copy(fmt(r.value), r.unit)">
            {{ copied === r.unit ? '✓' : 'copiar' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
