<script setup lang="ts">
import { format } from 'sql-formatter'

const input  = ref(`SELECT u.id, u.name, u.email, COUNT(o.id) as orders FROM users u LEFT JOIN orders o ON u.id = o.user_id WHERE u.created_at > '2024-01-01' GROUP BY u.id, u.name, u.email HAVING COUNT(o.id) > 0 ORDER BY orders DESC LIMIT 10;`)
const lang   = ref<'sql'|'mysql'|'postgresql'>('sql')
const output = ref('')
const error  = ref('')
const copied = ref(false)

function process() {
  error.value = ''
  try {
    output.value = format(input.value, { language: lang.value, tabWidth: 2, keywordCase: 'upper' })
  } catch (e: any) {
    error.value = e.message
    output.value = ''
  }
}

async function copy() {
  await navigator.clipboard.writeText(output.value)
  copied.value = true; setTimeout(() => copied.value = false, 1500)
}

watch([input, lang], process)
onMounted(process)
</script>

<template>
  <div class="tool-layout">
    <div class="tool-row" style="align-items:center">
      <label class="tool-label" style="margin:0;margin-right:0.5rem">Dialeto</label>
      <select v-model="lang" class="tool-sel" style="width:150px">
        <option value="sql">SQL (genérico)</option>
        <option value="mysql">MySQL</option>
        <option value="postgresql">PostgreSQL</option>
      </select>
      <div style="flex:1" />
      <button v-if="output" class="copy-btn" :class="{ copied }" @click="copy">{{ copied ? '✓' : 'copiar' }}</button>
    </div>

    <div class="tool-row" style="height:380px">
      <div class="tool-col">
        <label class="tool-label">SQL de entrada</label>
        <textarea v-model="input" class="tool-ta" style="height:100%;resize:none" />
      </div>
      <div class="tool-col">
        <label class="tool-label">SQL formatado</label>
        <div v-if="error" class="tool-output" style="height:100%;overflow-y:auto;color:var(--red)">{{ error }}</div>
        <textarea v-else :value="output" class="tool-ta" style="height:100%;resize:none" readonly />
      </div>
    </div>
  </div>
</template>
