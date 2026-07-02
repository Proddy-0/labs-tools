<script setup lang="ts">
const type   = ref<'uuid'|'hex'|'base64'|'alphanum'|'nano'>('uuid')
const length = ref(32)
const qty    = ref(5)
const tokens = ref<string[]>([])
const copied = ref('')

const ALPHANUM = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
const NANO_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-'

function uuidv4(): string {
  const h = () => Math.random().toString(16).slice(2)
  return `${h().slice(0,8)}-${h().slice(0,4)}-4${h().slice(0,3)}-${['8','9','a','b'][Math.floor(Math.random()*4)]}${h().slice(0,3)}-${h().slice(0,12)}`
}

function randBytes(n: number): Uint8Array {
  const arr = new Uint8Array(n)
  crypto.getRandomValues(arr)
  return arr
}

function genToken(): string {
  switch (type.value) {
    case 'uuid':     return uuidv4()
    case 'hex':      return [...randBytes(Math.ceil(length.value / 2))].map(b => b.toString(16).padStart(2,'0')).join('').slice(0, length.value)
    case 'base64':   return btoa(String.fromCharCode(...randBytes(Math.ceil(length.value * 0.75)))).replace(/[+/=]/g, c => ({'+':'-','/':'_','=':''}[c] ?? c)).slice(0, length.value)
    case 'alphanum': {
      const arr = randBytes(length.value)
      return [...arr].map(b => ALPHANUM[b % ALPHANUM.length]).join('')
    }
    case 'nano': {
      const arr = randBytes(length.value)
      return [...arr].map(b => NANO_CHARS[b % NANO_CHARS.length]).join('')
    }
  }
}

function generate() { tokens.value = Array.from({ length: qty.value }, genToken) }

async function copy(text: string, key: string) {
  await navigator.clipboard.writeText(text)
  copied.value = key; setTimeout(() => copied.value = '', 1500)
}
async function copyAll() {
  await copy(tokens.value.join('\n'), '__all')
}

const showLength = computed(() => type.value !== 'uuid')

onMounted(generate)
watch(type, generate)
</script>

<template>
  <div class="tool-layout">
    <div class="tool-row" style="align-items:flex-end">
      <div class="tool-col">
        <label class="tool-label">Tipo</label>
        <select v-model="type" class="tool-sel">
          <option value="uuid">UUID v4</option>
          <option value="hex">Hex</option>
          <option value="base64">Base64url</option>
          <option value="alphanum">Alfanumérico</option>
          <option value="nano">Nano ID</option>
        </select>
      </div>
      <div v-if="showLength" class="tool-col">
        <label class="tool-label">Comprimento</label>
        <input v-model.number="length" type="number" min="4" max="512" class="tool-input" />
      </div>
      <div class="tool-col">
        <label class="tool-label">Quantidade</label>
        <input v-model.number="qty" type="number" min="1" max="50" class="tool-input" />
      </div>
    </div>

    <div style="display:flex;gap:0.5rem">
      <button class="tool-btn" @click="generate">🎲 Gerar</button>
      <button class="copy-btn" :class="{ copied: copied === '__all' }" @click="copyAll">
        {{ copied === '__all' ? '✓ copiado' : 'copiar todos' }}
      </button>
    </div>

    <div style="display:flex;flex-direction:column;gap:0.35rem">
      <div v-for="(tok, i) in tokens" :key="i" class="result-row">
        <span class="result-value" style="font-family:var(--mono);font-size:0.82rem;flex:1;word-break:break-all">{{ tok }}</span>
        <button class="copy-btn" :class="{ copied: copied === tok }" @click="copy(tok, tok)">
          {{ copied === tok ? '✓' : 'copiar' }}
        </button>
      </div>
    </div>

    <div class="small">
      {{ type === 'uuid' ? '128 bits (RFC 4122)' : `${length * 4} bits de entropia aprox.` }}
    </div>
  </div>
</template>
