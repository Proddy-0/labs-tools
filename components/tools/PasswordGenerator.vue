<script setup lang="ts">
const length    = ref(16)
const useUpper  = ref(true)
const useLower  = ref(true)
const useDigits = ref(true)
const useSymbols= ref(true)
const noAmbig   = ref(false)
const qty       = ref(5)
const passwords = ref<string[]>([])

const UPPER   = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const LOWER   = 'abcdefghijklmnopqrstuvwxyz'
const DIGITS  = '0123456789'
const SYMBOLS = '!@#$%^&*()_+-=[]{}|;:,.<>?'
const AMBIG   = 'Il1O0o'

function genPassword(): string {
  let pool = ''
  if (useUpper.value)   pool += UPPER
  if (useLower.value)   pool += LOWER
  if (useDigits.value)  pool += DIGITS
  if (useSymbols.value) pool += SYMBOLS
  if (noAmbig.value) pool = [...pool].filter(c => !AMBIG.includes(c)).join('')
  if (!pool) pool = LOWER

  const arr = new Uint32Array(length.value)
  crypto.getRandomValues(arr)
  return [...arr].map(n => pool[n % pool.length]).join('')
}

function generate() {
  passwords.value = Array.from({ length: qty.value }, genPassword)
}

const strength = computed(() => {
  let score = 0
  if (length.value >= 12) score++
  if (length.value >= 16) score++
  if (length.value >= 24) score++
  if (useUpper.value && useLower.value) score++
  if (useDigits.value) score++
  if (useSymbols.value) score++
  if (score <= 2) return { label: 'Fraca', color: 'var(--red)', pct: 25 }
  if (score <= 3) return { label: 'Média', color: 'var(--amber)', pct: 50 }
  if (score <= 4) return { label: 'Boa',   color: '#facc15', pct: 75 }
  return { label: 'Forte', color: 'var(--green)', pct: 100 }
})

const copied = ref('')
async function copy(text: string, key: string) {
  await navigator.clipboard.writeText(text)
  copied.value = key; setTimeout(() => copied.value = '', 1500)
}

async function copyAll() {
  await copy(passwords.value.join('\n'), '__all')
}

onMounted(generate)
</script>

<template>
  <div class="tool-layout">
    <div>
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.5rem">
        <label class="tool-label" style="margin:0">Comprimento: {{ length }}</label>
        <span style="font-family:var(--mono);font-size:0.8rem" :style="{ color: strength.color }">{{ strength.label }}</span>
      </div>
      <input v-model.number="length" type="range" min="4" max="128" class="tool-input" style="padding:0;height:4px;cursor:pointer;accent-color:var(--amber)" />
      <div style="display:flex;gap:2px;margin-top:0.5rem;height:4px;border-radius:2px;background:var(--line);overflow:hidden">
        <div :style="{ width: strength.pct + '%', background: strength.color, transition:'width .3s' }" />
      </div>
    </div>

    <div style="display:flex;flex-wrap:wrap;gap:0.75rem">
      <label v-for="opt in [
        { label:'A-Z',     model: useUpper },
        { label:'a-z',     model: useLower },
        { label:'0-9',     model: useDigits },
        { label:'!@#…',    model: useSymbols },
        { label:'Sem ambíguos', model: noAmbig },
      ]" :key="opt.label" style="display:flex;align-items:center;gap:0.4rem;font-size:0.82rem;color:var(--muted);cursor:pointer">
        <input type="checkbox" v-model="opt.model.value" />
        <span style="font-family:var(--mono)">{{ opt.label }}</span>
      </label>
      <div style="flex:1" />
      <label style="display:flex;align-items:center;gap:0.4rem;font-size:0.82rem;color:var(--muted)">
        Qtd <input v-model.number="qty" type="number" min="1" max="20" class="tool-input" style="width:60px" />
      </label>
    </div>

    <div style="display:flex;gap:0.5rem">
      <button class="tool-btn" @click="generate">Gerar</button>
      <button class="copy-btn" :class="{ copied: copied === '__all' }" @click="copyAll">{{ copied==='__all'?'✓':'copiar todos' }}</button>
    </div>

    <div style="display:flex;flex-direction:column;gap:0.35rem">
      <div v-for="(pw, i) in passwords" :key="i" class="result-row">
        <span class="result-value" style="font-family:var(--mono);font-size:0.85rem;letter-spacing:0.05em;flex:1">{{ pw }}</span>
        <button class="copy-btn" :class="{ copied: copied === pw }" @click="copy(pw, pw)">{{ copied===pw?'✓':'copiar' }}</button>
      </div>
    </div>
  </div>
</template>
