<script setup lang="ts">
interface KeyInfo {
  key: string; code: string; keyCode: number; which: number
  location: number; altKey: boolean; ctrlKey: boolean; shiftKey: boolean; metaKey: boolean
}

const last    = ref<KeyInfo | null>(null)
const paused  = ref(false)
const history = ref<KeyInfo[]>([])

const locationMap: Record<number, string> = { 0:'Standard', 1:'Left', 2:'Right', 3:'Numpad' }

function handleKey(e: KeyboardEvent) {
  if (paused.value) return
  e.preventDefault()
  e.stopPropagation()
  const info: KeyInfo = {
    key: e.key, code: e.code,
    keyCode: e.keyCode, which: e.which,
    location: e.location,
    altKey: e.altKey, ctrlKey: e.ctrlKey, shiftKey: e.shiftKey, metaKey: e.metaKey,
  }
  last.value = info
  history.value = [info, ...history.value.slice(0, 9)]
}

onMounted(() => window.addEventListener('keydown', handleKey, true))
onUnmounted(() => window.removeEventListener('keydown', handleKey, true))

const copied = ref('')
async function copy(text: string | number, key: string) {
  await navigator.clipboard.writeText(String(text))
  copied.value = key; setTimeout(() => copied.value = '', 1500)
}
</script>

<template>
  <div class="tool-layout">
    <div
      style="padding:1.5rem;text-align:center;background:var(--bg);border:2px dashed var(--line);border-radius:8px;cursor:pointer;transition:border-color .15s"
      :style="{ borderColor: paused ? 'var(--line)' : 'var(--amber)' }"
      tabindex="0"
    >
      <div style="font-size:0.75rem;color:var(--muted);text-transform:uppercase;letter-spacing:0.1em;margin-bottom:0.5rem">
        {{ paused ? '⏸ pausado' : '⌨ Pressione qualquer tecla' }}
      </div>
      <div v-if="last" style="font-size:3rem;font-family:var(--mono);font-weight:700;color:var(--amber)">
        {{ last.key === ' ' ? '(espaço)' : last.key }}
      </div>
    </div>

    <div style="display:flex;justify-content:flex-end">
      <button class="tool-btn secondary" @click="paused = !paused">{{ paused ? '▶ retomar' : '⏸ pausar' }}</button>
    </div>

    <template v-if="last">
      <div v-for="row in [
        { label:'key',       value: last.key      },
        { label:'code',      value: last.code     },
        { label:'keyCode',   value: last.keyCode  },
        { label:'which',     value: last.which    },
        { label:'location',  value: `${last.location} (${locationMap[last.location]})` },
        { label:'Modificadores', value: [last.ctrlKey&&'Ctrl', last.altKey&&'Alt', last.shiftKey&&'Shift', last.metaKey&&'Meta'].filter(Boolean).join(' + ') || 'nenhum' },
      ]" :key="row.label" class="result-row">
        <span class="result-label">{{ row.label }}</span>
        <div class="row-actions">
          <span class="result-value">{{ row.value }}</span>
          <button class="copy-btn" :class="{ copied: copied===row.label }" @click="copy(row.value, row.label)">
            {{ copied===row.label ? '✓' : 'copiar' }}
          </button>
        </div>
      </div>
    </template>

    <div v-if="history.length > 1">
      <label class="tool-label">Histórico</label>
      <div style="display:flex;flex-wrap:wrap;gap:0.4rem">
        <span v-for="(h, i) in history.slice(1)" :key="i"
          style="padding:0.3rem 0.6rem;background:var(--bg);border:1px solid var(--line);border-radius:5px;font-family:var(--mono);font-size:0.8rem;color:var(--muted)">
          {{ h.key === ' ' ? '·space·' : h.key }}
        </span>
      </div>
    </div>
  </div>
</template>
