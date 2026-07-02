<script setup lang="ts">
const info = ref<{label:string;value:string}[]>([])

onMounted(() => {
  const nav = navigator
  const scr = screen
  const win = window
  info.value = [
    { label: 'User Agent',        value: nav.userAgent },
    { label: 'Plataforma',        value: nav.platform },
    { label: 'Linguagem',         value: nav.language },
    { label: 'Idiomas',           value: nav.languages?.join(', ') ?? '—' },
    { label: 'Cookies habilitados', value: nav.cookieEnabled ? 'Sim' : 'Não' },
    { label: 'Online',            value: nav.onLine ? 'Sim' : 'Não' },
    { label: 'CPUs',              value: String(nav.hardwareConcurrency ?? '—') },
    { label: 'Memória (GB)',      value: String((nav as any).deviceMemory ?? '—') },
    { label: 'Tela',             value: `${scr.width} × ${scr.height}` },
    { label: 'Tela disponível',   value: `${scr.availWidth} × ${scr.availHeight}` },
    { label: 'Profundidade de cor', value: `${scr.colorDepth} bit` },
    { label: 'Viewport',          value: `${win.innerWidth} × ${win.innerHeight}` },
    { label: 'Device Pixel Ratio',value: String(win.devicePixelRatio) },
    { label: 'Fuso horário',      value: Intl.DateTimeFormat().resolvedOptions().timeZone },
    { label: 'Toque',            value: 'ontouchstart' in win ? 'Sim' : 'Não' },
    { label: 'Pointer Events',    value: String((nav as any).maxTouchPoints ?? 0) + ' pontos' },
  ]
})

const copied = ref('')
async function copy(text: string, key: string) {
  await navigator.clipboard.writeText(text)
  copied.value = key; setTimeout(() => copied.value = '', 1500)
}

function copyAll() {
  const text = info.value.map(r => `${r.label}: ${r.value}`).join('\n')
  copy(text, '_all')
}
</script>

<template>
  <div class="tool-layout">
    <div style="display:flex;justify-content:flex-end">
      <button class="copy-btn" :class="{ copied: copied === '_all' }" @click="copyAll">
        {{ copied === '_all' ? '✓ copiado' : 'copiar tudo' }}
      </button>
    </div>
    <div v-for="row in info" :key="row.label" class="result-row">
      <span class="result-label">{{ row.label }}</span>
      <div class="row-actions">
        <span class="result-value" style="max-width:380px;font-family:var(--mono);font-size:0.75rem">{{ row.value }}</span>
        <button class="copy-btn" :class="{ copied: copied === row.label }" @click="copy(row.value, row.label)">
          {{ copied === row.label ? '✓' : 'copiar' }}
        </button>
      </div>
    </div>
  </div>
</template>
