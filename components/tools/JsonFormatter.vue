<script setup lang="ts">
const input   = ref('{"name":"proddyt","version":1,"tags":["homelab","tools"],"nested":{"active":true}}')
const indent  = ref(2)
const output  = ref('')
const error   = ref('')
const mode    = ref<'pretty'|'minify'|'sort'>('pretty')
const copied  = ref(false)

function sortKeys(obj: any): any {
  if (Array.isArray(obj)) return obj.map(sortKeys)
  if (obj && typeof obj === 'object') {
    return Object.fromEntries(Object.keys(obj).sort().map(k => [k, sortKeys(obj[k])]))
  }
  return obj
}

function process() {
  error.value = ''
  try {
    const parsed = JSON.parse(input.value)
    if (mode.value === 'minify') output.value = JSON.stringify(parsed)
    else if (mode.value === 'sort') output.value = JSON.stringify(sortKeys(parsed), null, indent.value)
    else output.value = JSON.stringify(parsed, null, indent.value)
  } catch (e: any) {
    error.value = e.message
    output.value = ''
  }
}

async function copy() {
  await navigator.clipboard.writeText(output.value)
  copied.value = true; setTimeout(() => copied.value = false, 1500)
}

watch([input, indent, mode], process)
onMounted(process)
</script>

<template>
  <div class="tool-layout">
    <div class="tool-row" style="align-items:center">
      <button v-for="m in [['pretty','Prettify'],['minify','Minify'],['sort','Ordenar keys']] as [string,string][]"
        :key="m[0]" class="tool-btn" :class="{ secondary: mode !== m[0] }" @click="mode = m[0] as any">
        {{ m[1] }}
      </button>
      <div style="flex:1" />
      <label class="tool-label" style="margin:0;margin-right:0.5rem">Indent</label>
      <select v-model.number="indent" class="tool-sel" style="width:80px">
        <option :value="2">2</option>
        <option :value="4">4</option>
        <option :value="8">8</option>
      </select>
    </div>

    <div class="tool-row" style="height:380px">
      <div class="tool-col">
        <label class="tool-label">Entrada</label>
        <textarea v-model="input" class="tool-ta" style="height:100%;resize:none" />
      </div>
      <div class="tool-col">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.25rem">
          <label class="tool-label" style="margin:0">Saída</label>
          <button v-if="output" class="copy-btn" :class="{ copied }" @click="copy">{{ copied ? '✓' : 'copiar' }}</button>
        </div>
        <div v-if="error" class="tool-output" style="height:100%;overflow-y:auto;color:var(--red)">{{ error }}</div>
        <textarea v-else :value="output" class="tool-ta" style="height:100%;resize:none" readonly />
      </div>
    </div>
  </div>
</template>
