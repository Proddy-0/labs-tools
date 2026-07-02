<script setup lang="ts">
const value     = ref('255')
const inputBase = ref('10')

const bases = [
  { label: 'Binário (2)',   base: '2'    },
  { label: 'Octal (8)',     base: '8'    },
  { label: 'Decimal (10)', base: '10'   },
  { label: 'Hex (16)',      base: '16'   },
  { label: 'Texto (ASCII)', base: 'text' },
  { label: 'Base64',        base: 'b64'  },
]

const num = computed<number | null>(() => {
  const v = value.value.trim()
  if (!v) return null
  if (inputBase.value === 'text' || inputBase.value === 'b64') return null
  const n = parseInt(v, Number(inputBase.value))
  return isNaN(n) ? null : n
})

const textVal = computed<string>(() => {
  const v = value.value.trim()
  if (!v) return ''
  if (inputBase.value === 'text') return v
  if (inputBase.value === 'b64') { try { return atob(v) } catch { return '?' } }
  const n = num.value
  if (n === null) return ''
  try { return String.fromCharCode(n) } catch { return '' }
})

function toB64(): string {
  const v = value.value.trim()
  if (!v) return ''
  if (inputBase.value === 'text') return btoa(unescape(encodeURIComponent(v)))
  if (inputBase.value === 'b64') return v
  const n = num.value
  return n !== null ? btoa(String.fromCharCode(n)) : '?'
}

function conv(base: number): string {
  const v = value.value.trim()
  if (!v) return ''
  if (inputBase.value === 'text') {
    return [...v].map(c => c.charCodeAt(0).toString(base)).join(' ')
  }
  if (inputBase.value === 'b64') {
    const decoded = textVal.value
    return [...decoded].map(c => c.charCodeAt(0).toString(base)).join(' ')
  }
  const n = num.value
  return n !== null ? n.toString(base).toUpperCase() : '?'
}

const rows = computed(() => [
  { label: 'Binário',  base: 2,  value: conv(2) },
  { label: 'Octal',   base: 8,  value: conv(8) },
  { label: 'Decimal', base: 10, value: conv(10) },
  { label: 'Hex',     base: 16, value: conv(16) },
  { label: 'Base64',  base: 64, value: toB64() },
  { label: 'ASCII',   base: 0,  value: textVal.value },
])

const copied = ref('')
async function copy(text: string, key: string) {
  await navigator.clipboard.writeText(text)
  copied.value = key
  setTimeout(() => copied.value = '', 1500)
}
</script>

<template>
  <div class="tool-layout">
    <div class="tool-row">
      <div class="tool-col" style="flex:1.5">
        <label class="tool-label">Valor de entrada</label>
        <input v-model="value" class="tool-input" placeholder="Ex: 255, FF, 11111111…" />
      </div>
      <div class="tool-col">
        <label class="tool-label">Base de entrada</label>
        <select v-model="inputBase" class="tool-sel">
          <option v-for="b in bases" :key="b.base" :value="b.base">{{ b.label }}</option>
        </select>
      </div>
    </div>

    <div v-for="row in rows" :key="row.label" class="result-row">
      <span class="result-label">{{ row.label }}</span>
      <div class="row-actions">
        <span class="result-value" style="max-width:350px">{{ row.value || '—' }}</span>
        <button v-if="row.value" class="copy-btn" :class="{ copied: copied === row.label }" @click="copy(row.value, row.label)">
          {{ copied === row.label ? '✓' : 'copiar' }}
        </button>
      </div>
    </div>
  </div>
</template>
