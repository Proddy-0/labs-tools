<script setup lang="ts">
import yaml from 'js-yaml'
import * as TOML from 'smol-toml'

const fromFmt = ref('json')
const toFmt   = ref('yaml')
const input   = ref(`{
  "name": "proddyt",
  "version": 1,
  "tags": ["homelab", "tools"]
}`)
const output  = ref('')
const error   = ref('')

const formats = ['json', 'yaml', 'toml']

function parse(src: string, fmt: string): any {
  if (fmt === 'json') return JSON.parse(src)
  if (fmt === 'yaml') return yaml.load(src)
  if (fmt === 'toml') return TOML.parse(src)
}

function stringify(obj: any, fmt: string): string {
  if (fmt === 'json') return JSON.stringify(obj, null, 2)
  if (fmt === 'yaml') return yaml.dump(obj)
  if (fmt === 'toml') return TOML.stringify(obj as any)
  return ''
}

function convert() {
  error.value = ''
  try {
    const parsed = parse(input.value, fromFmt.value)
    output.value = stringify(parsed, toFmt.value)
  } catch (e: any) {
    error.value = e.message
    output.value = ''
  }
}

const copied = ref(false)
async function copy() {
  await navigator.clipboard.writeText(output.value)
  copied.value = true; setTimeout(() => copied.value = false, 1500)
}

onMounted(() => convert())
watch([fromFmt, toFmt, input], convert)
</script>

<template>
  <div class="tool-layout">
    <div class="tool-row">
      <div class="tool-col">
        <label class="tool-label">De</label>
        <select v-model="fromFmt" class="tool-sel">
          <option v-for="f in formats" :key="f" :value="f">{{ f.toUpperCase() }}</option>
        </select>
      </div>
      <div style="display:flex;align-items:flex-end;padding-bottom:0.5rem;color:var(--muted)">→</div>
      <div class="tool-col">
        <label class="tool-label">Para</label>
        <select v-model="toFmt" class="tool-sel">
          <option v-for="f in formats" :key="f" :value="f">{{ f.toUpperCase() }}</option>
        </select>
      </div>
    </div>

    <div class="tool-row">
      <div class="tool-col">
        <label class="tool-label">Entrada ({{ fromFmt.toUpperCase() }})</label>
        <textarea v-model="input" class="tool-ta" rows="12" />
      </div>
      <div class="tool-col">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.25rem">
          <label class="tool-label" style="margin:0">Saída ({{ toFmt.toUpperCase() }})</label>
          <button v-if="output" class="copy-btn" :class="{ copied }" @click="copy">{{ copied ? '✓' : 'copiar' }}</button>
        </div>
        <div v-if="error" class="tool-output" style="color:var(--red)">{{ error }}</div>
        <textarea v-else v-model="output" class="tool-ta" rows="12" readonly />
      </div>
    </div>
  </div>
</template>
