<script setup lang="ts">
const input    = ref('maçã\nbanana\nlaranja\nabacaxi')
const inSep    = ref('newline')
const outFmt   = ref('comma')

const sepMap: Record<string, string> = {
  newline: '\n', comma: ',', semicolon: ';', tab: '\t', pipe: '|',
}

const items = computed(() => {
  const sep = sepMap[inSep.value] ?? '\n'
  return input.value.split(sep).map(s => s.trim()).filter(Boolean)
})

const output = computed(() => {
  const list = items.value
  switch (outFmt.value) {
    case 'comma':    return list.join(', ')
    case 'semicolon':return list.join('; ')
    case 'pipe':     return list.join(' | ')
    case 'newline':  return list.join('\n')
    case 'bullet':   return list.map(i => `• ${i}`).join('\n')
    case 'numbered': return list.map((i,n) => `${n+1}. ${i}`).join('\n')
    case 'json':     return JSON.stringify(list, null, 2)
    case 'sqlin':    return `IN (${list.map(i=>`'${i}'`).join(', ')})`
    case 'tsv':      return list.join('\t')
    case 'lower':    return list.map(i=>i.toLowerCase()).join('\n')
    case 'upper':    return list.map(i=>i.toUpperCase()).join('\n')
    default: return list.join('\n')
  }
})

const inSepOpts = [
  { value: 'newline', label: 'Nova linha' },
  { value: 'comma', label: 'Vírgula' },
  { value: 'semicolon', label: 'Ponto e vírgula' },
  { value: 'tab', label: 'Tab' },
  { value: 'pipe', label: 'Pipe |' },
]
const outFmtOpts = [
  { value: 'newline', label: 'Nova linha' },
  { value: 'comma', label: 'Vírgula' },
  { value: 'semicolon', label: 'Ponto e vírgula' },
  { value: 'bullet', label: '• Bullet' },
  { value: 'numbered', label: '1. Numerado' },
  { value: 'json', label: 'JSON array' },
  { value: 'sqlin', label: 'SQL IN (…)' },
  { value: 'tsv', label: 'TSV (tab)' },
  { value: 'pipe', label: 'Pipe |' },
  { value: 'lower', label: 'lowercase' },
  { value: 'upper', label: 'UPPERCASE' },
]

const copied = ref(false)
async function copy() {
  await navigator.clipboard.writeText(output.value)
  copied.value = true; setTimeout(() => copied.value = false, 1500)
}
</script>

<template>
  <div class="tool-layout">
    <div class="tool-row">
      <div class="tool-col">
        <label class="tool-label">Separador de entrada</label>
        <select v-model="inSep" class="tool-sel">
          <option v-for="o in inSepOpts" :key="o.value" :value="o.value">{{ o.label }}</option>
        </select>
      </div>
      <div class="tool-col">
        <label class="tool-label">Formato de saída</label>
        <select v-model="outFmt" class="tool-sel">
          <option v-for="o in outFmtOpts" :key="o.value" :value="o.value">{{ o.label }}</option>
        </select>
      </div>
      <div style="display:flex;align-items:flex-end;padding-bottom:0.5rem">
        <span class="small">{{ items.length }} itens</span>
      </div>
    </div>

    <div class="tool-row">
      <div class="tool-col">
        <label class="tool-label">Entrada</label>
        <textarea v-model="input" class="tool-ta" rows="10" />
      </div>
      <div class="tool-col">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.25rem">
          <label class="tool-label" style="margin:0">Saída</label>
          <button class="copy-btn" :class="{ copied }" @click="copy">{{ copied ? '✓' : 'copiar' }}</button>
        </div>
        <textarea :value="output" class="tool-ta" rows="10" readonly />
      </div>
    </div>
  </div>
</template>
