<script setup lang="ts">
const mode = ref<'diff'|'add'|'sub'>('diff')

// Diff mode
const startDt = ref('')
const endDt   = ref('')

// Add/Sub mode
const baseDt  = ref('')
const addD    = ref(0)
const addH    = ref(0)
const addM    = ref(0)
const addS    = ref(0)

function now() { return new Date().toISOString().slice(0, 16) }

onMounted(() => {
  startDt.value = now()
  baseDt.value  = now()
  const end = new Date(Date.now() + 3 * 3600 * 1000)
  endDt.value = end.toISOString().slice(0, 16)
})

interface Diff { days:number; hours:number; minutes:number; seconds:number; total_ms:number }

function calcDiff(a: Date, b: Date): Diff {
  const ms = b.getTime() - a.getTime()
  const abs = Math.abs(ms)
  return {
    total_ms: ms,
    days:    Math.floor(abs / 86400000),
    hours:   Math.floor((abs % 86400000) / 3600000),
    minutes: Math.floor((abs % 3600000) / 60000),
    seconds: Math.floor((abs % 60000) / 1000),
  }
}

const diffResult = computed<Diff | null>(() => {
  if (!startDt.value || !endDt.value) return null
  try { return calcDiff(new Date(startDt.value), new Date(endDt.value)) } catch { return null }
})

const addResult = computed<string | null>(() => {
  if (!baseDt.value) return null
  try {
    const ms = (addD.value * 86400 + addH.value * 3600 + addM.value * 60 + addS.value) * 1000
    const sign = mode.value === 'sub' ? -1 : 1
    const dt = new Date(new Date(baseDt.value).getTime() + sign * ms)
    return dt.toLocaleString('pt-BR', { dateStyle: 'full', timeStyle: 'medium' })
  } catch { return null }
})

function fmtFull(d: Diff): string {
  const parts = []
  if (d.days) parts.push(`${d.days} dia${d.days !== 1 ? 's' : ''}`)
  if (d.hours) parts.push(`${d.hours}h`)
  if (d.minutes) parts.push(`${d.minutes}min`)
  if (d.seconds) parts.push(`${d.seconds}s`)
  return parts.join(' ') || '0s'
}

const copied = ref(false)
async function copy(text: string) {
  await navigator.clipboard.writeText(text)
  copied.value = true; setTimeout(() => copied.value = false, 1500)
}
</script>

<template>
  <div class="tool-layout">
    <div style="display:flex;gap:0.5rem">
      <button class="tool-btn" :class="{ secondary: mode !== 'diff' }" @click="mode = 'diff'">Diferença</button>
      <button class="tool-btn" :class="{ secondary: mode !== 'add' }" @click="mode = 'add'">Somar tempo</button>
      <button class="tool-btn" :class="{ secondary: mode !== 'sub' }" @click="mode = 'sub'">Subtrair tempo</button>
    </div>

    <!-- Diff mode -->
    <template v-if="mode === 'diff'">
      <div class="tool-row">
        <div class="tool-col">
          <label class="tool-label">Data / hora de início</label>
          <input v-model="startDt" type="datetime-local" class="tool-input" />
        </div>
        <div class="tool-col">
          <label class="tool-label">Data / hora de fim</label>
          <input v-model="endDt" type="datetime-local" class="tool-input" />
        </div>
      </div>

      <div v-if="diffResult" style="display:flex;flex-direction:column;gap:0.4rem">
        <div v-for="row in [
          { label: 'Total',           value: fmtFull(diffResult) },
          { label: 'Dias',            value: String(diffResult.days) },
          { label: 'Horas totais',    value: String(Math.floor(Math.abs(diffResult.total_ms) / 3600000)) },
          { label: 'Minutos totais',  value: String(Math.floor(Math.abs(diffResult.total_ms) / 60000)) },
          { label: 'Segundos totais', value: String(Math.floor(Math.abs(diffResult.total_ms) / 1000)) },
          { label: 'Milissegundos',   value: String(Math.abs(diffResult.total_ms)) },
        ]" :key="row.label" class="result-row">
          <span class="result-label">{{ row.label }}</span>
          <span class="result-value" :style="{ color: diffResult.total_ms < 0 ? 'var(--muted)' : 'var(--text)' }">
            {{ diffResult.total_ms < 0 ? '-' : '' }}{{ row.value }}
          </span>
        </div>
      </div>
    </template>

    <!-- Add / Sub mode -->
    <template v-else>
      <div>
        <label class="tool-label">Data / hora base</label>
        <input v-model="baseDt" type="datetime-local" class="tool-input" />
      </div>
      <div class="tool-row">
        <div class="tool-col">
          <label class="tool-label">Dias</label>
          <input v-model.number="addD" type="number" min="0" class="tool-input" />
        </div>
        <div class="tool-col">
          <label class="tool-label">Horas</label>
          <input v-model.number="addH" type="number" min="0" class="tool-input" />
        </div>
        <div class="tool-col">
          <label class="tool-label">Minutos</label>
          <input v-model.number="addM" type="number" min="0" class="tool-input" />
        </div>
        <div class="tool-col">
          <label class="tool-label">Segundos</label>
          <input v-model.number="addS" type="number" min="0" class="tool-input" />
        </div>
      </div>

      <div v-if="addResult" class="result-row">
        <span class="result-label">Resultado</span>
        <div class="row-actions">
          <span class="result-value" style="color:var(--amber)">{{ addResult }}</span>
          <button class="copy-btn" :class="{ copied }" @click="copy(addResult!)">{{ copied ? '✓' : 'copiar' }}</button>
        </div>
      </div>
    </template>
  </div>
</template>
