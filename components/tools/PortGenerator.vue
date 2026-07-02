<script setup lang="ts">
const count   = ref(5)
const minPort = ref(3000)
const maxPort = ref(9000)
const exclude = ref('22,80,443,3306,5432,6379,8080,27017')
const presets = ref<string[]>([])
const result  = ref<number[]>([])
const copied  = ref(false)

const commonPresets: { label: string; ports: number[] }[] = [
  { label: 'SSH (22)',          ports: [22] },
  { label: 'HTTP/S (80,443)',  ports: [80, 443] },
  { label: 'MySQL (3306)',     ports: [3306] },
  { label: 'PostgreSQL (5432)',ports: [5432] },
  { label: 'Redis (6379)',     ports: [6379] },
  { label: 'MongoDB (27017)',  ports: [27017] },
  { label: 'Docker (2375)',    ports: [2375, 2376] },
  { label: 'Kubernetes',       ports: [6443, 10250, 10255] },
]

const excludedSet = computed(() => {
  const base = exclude.value.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n))
  const fromPresets = presets.value.flatMap(p => commonPresets.find(c => c.label === p)?.ports ?? [])
  return new Set([...base, ...fromPresets])
})

function generate() {
  const available: number[] = []
  for (let p = minPort.value; p <= maxPort.value; p++) {
    if (!excludedSet.value.has(p)) available.push(p)
  }
  const picked: number[] = []
  const pool = [...available]
  for (let i = 0; i < Math.min(count.value, pool.length); i++) {
    const idx = Math.floor(Math.random() * pool.length)
    picked.push(pool[idx])
    pool.splice(idx, 1)
  }
  result.value = picked.sort((a, b) => a - b)
}

async function copy() {
  await navigator.clipboard.writeText(result.value.join(', '))
  copied.value = true; setTimeout(() => copied.value = false, 1500)
}

function togglePreset(label: string) {
  if (presets.value.includes(label)) presets.value = presets.value.filter(p => p !== label)
  else presets.value = [...presets.value, label]
}

onMounted(generate)
</script>

<template>
  <div class="tool-layout">
    <div class="tool-row">
      <div class="tool-col">
        <label class="tool-label">Quantidade</label>
        <input v-model.number="count" type="number" min="1" max="50" class="tool-input" />
      </div>
      <div class="tool-col">
        <label class="tool-label">Min</label>
        <input v-model.number="minPort" type="number" min="1" max="65534" class="tool-input" />
      </div>
      <div class="tool-col">
        <label class="tool-label">Max</label>
        <input v-model.number="maxPort" type="number" min="2" max="65535" class="tool-input" />
      </div>
    </div>

    <div>
      <label class="tool-label">Portas a excluir (manual)</label>
      <input v-model="exclude" class="tool-input" placeholder="22,80,443…" />
    </div>

    <div>
      <label class="tool-label">Excluir presets</label>
      <div style="display:flex;flex-wrap:wrap;gap:0.4rem;margin-top:0.3rem">
        <button
          v-for="p in commonPresets" :key="p.label"
          class="filter" :class="{ active: presets.includes(p.label) }"
          @click="togglePreset(p.label)"
        >{{ p.label }}</button>
      </div>
    </div>

    <div style="display:flex;gap:0.5rem">
      <button class="tool-btn" @click="generate">🎲 Gerar</button>
      <button v-if="result.length" class="copy-btn" :class="{ copied }" @click="copy">
        {{ copied ? '✓ copiado' : 'copiar lista' }}
      </button>
    </div>

    <div v-if="result.length" style="display:flex;flex-wrap:wrap;gap:0.5rem">
      <span v-for="p in result" :key="p"
        style="padding:0.35rem 0.8rem;background:var(--bg);border:1px solid var(--amber);border-radius:6px;font-family:var(--mono);font-size:0.9rem;color:var(--amber);font-weight:600">
        {{ p }}
      </span>
    </div>

    <div v-if="excludedSet.size" class="small">
      {{ excludedSet.size }} portas excluídas · range de {{ minPort }}-{{ maxPort }}
    </div>
  </div>
</template>
