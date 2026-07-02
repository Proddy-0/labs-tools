<script setup lang="ts">
const mode      = ref<'cpf'|'cnpj'>('cpf')
const formatted = ref(true)
const qty       = ref(5)
const results   = ref<string[]>([])
const validateInput = ref('')
const validationResult = ref<null | { ok: boolean; msg: string }>(null)
const copied    = ref(false)

// ── CPF ──────────────────────────────────────────────────────
function genCpf(): string {
  const n = Array.from({ length: 9 }, () => Math.floor(Math.random() * 10))
  let s1 = n.reduce((sum, v, i) => sum + v * (10 - i), 0) % 11
  const d1 = s1 < 2 ? 0 : 11 - s1; n.push(d1)
  let s2 = n.reduce((sum, v, i) => sum + v * (11 - i), 0) % 11
  const d2 = s2 < 2 ? 0 : 11 - s2; n.push(d2)
  return n.join('')
}
function fmtCpf(s: string): string { return s.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4') }

function validateCpf(raw: string): boolean {
  const s = raw.replace(/\D/g, '')
  if (s.length !== 11 || /^(.)\1+$/.test(s)) return false
  let d1 = s.slice(0,9).split('').reduce((acc, c, i) => acc + +c * (10 - i), 0) % 11
  d1 = d1 < 2 ? 0 : 11 - d1
  if (+s[9] !== d1) return false
  let d2 = s.slice(0,10).split('').reduce((acc, c, i) => acc + +c * (11 - i), 0) % 11
  d2 = d2 < 2 ? 0 : 11 - d2
  return +s[10] === d2
}

// ── CNPJ ─────────────────────────────────────────────────────
function genCnpj(): string {
  const n = [...Array.from({ length: 8 }, () => Math.floor(Math.random() * 10)), 0, 0, 0, 1]
  const w1 = [5,4,3,2,9,8,7,6,5,4,3,2]
  let s1 = n.slice(0,12).reduce((acc, v, i) => acc + v * w1[i], 0) % 11
  const d1 = s1 < 2 ? 0 : 11 - s1; n.push(d1)
  const w2 = [6,5,4,3,2,9,8,7,6,5,4,3,2]
  let s2 = n.slice(0,13).reduce((acc, v, i) => acc + v * w2[i], 0) % 11
  const d2 = s2 < 2 ? 0 : 11 - s2; n.push(d2)
  return n.join('')
}
function fmtCnpj(s: string): string { return s.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5') }

function validateCnpj(raw: string): boolean {
  const s = raw.replace(/\D/g, '')
  if (s.length !== 14 || /^(.)\1+$/.test(s)) return false
  const calc = (n: string, w: number[]): number => {
    const sum = n.split('').reduce((acc, c, i) => acc + +c * w[i], 0) % 11
    return sum < 2 ? 0 : 11 - sum
  }
  const d1 = calc(s.slice(0,12), [5,4,3,2,9,8,7,6,5,4,3,2])
  if (+s[12] !== d1) return false
  const d2 = calc(s.slice(0,13), [6,5,4,3,2,9,8,7,6,5,4,3,2])
  return +s[13] === d2
}

// ── Generate ─────────────────────────────────────────────────
function generate() {
  results.value = Array.from({ length: qty.value }, () => {
    const raw = mode.value === 'cpf' ? genCpf() : genCnpj()
    return formatted.value ? (mode.value === 'cpf' ? fmtCpf(raw) : fmtCnpj(raw)) : raw
  })
}

function validate() {
  const ok = mode.value === 'cpf' ? validateCpf(validateInput.value) : validateCnpj(validateInput.value)
  validationResult.value = {
    ok,
    msg: ok ? `${mode.value.toUpperCase()} válido ✓` : `${mode.value.toUpperCase()} inválido ✗`
  }
}

async function copy() {
  await navigator.clipboard.writeText(results.value.join('\n'))
  copied.value = true; setTimeout(() => copied.value = false, 1500)
}

const copiedItem = ref('')
async function copyItem(v: string) {
  await navigator.clipboard.writeText(v)
  copiedItem.value = v; setTimeout(() => copiedItem.value = '', 1500)
}

onMounted(generate)
watch(mode, generate)
</script>

<template>
  <div class="tool-layout">
    <div class="tool-row" style="align-items:center">
      <button class="tool-btn" :class="{ secondary: mode !== 'cpf' }" @click="mode = 'cpf'">CPF</button>
      <button class="tool-btn" :class="{ secondary: mode !== 'cnpj' }" @click="mode = 'cnpj'">CNPJ</button>
      <div style="flex:1" />
      <label style="display:flex;align-items:center;gap:0.4rem;font-size:0.8rem;color:var(--muted);cursor:pointer">
        <input type="checkbox" v-model="formatted" />
        Formatado
      </label>
      <label class="tool-label" style="margin:0;margin-left:1rem;margin-right:0.4rem">Qtd</label>
      <input v-model.number="qty" type="number" min="1" max="50" class="tool-input" style="width:70px" />
    </div>

    <div style="display:flex;gap:0.5rem">
      <button class="tool-btn" @click="generate">Gerar</button>
      <button v-if="results.length" class="copy-btn" :class="{ copied }" @click="copy">
        {{ copied ? '✓ copiado' : 'copiar todos' }}
      </button>
    </div>

    <div style="display:flex;flex-direction:column;gap:0.35rem;max-height:220px;overflow-y:auto">
      <div v-for="v in results" :key="v" class="result-row">
        <span class="result-value" style="font-size:0.9rem">{{ v }}</span>
        <button class="copy-btn" :class="{ copied: copiedItem === v }" @click="copyItem(v)">
          {{ copiedItem === v ? '✓' : 'copiar' }}
        </button>
      </div>
    </div>

    <div style="border-top:1px solid var(--line);padding-top:1rem">
      <label class="tool-label">Validar {{ mode.toUpperCase() }}</label>
      <div style="display:flex;gap:0.5rem;margin-top:0.3rem">
        <input v-model="validateInput" class="tool-input" :placeholder="mode === 'cpf' ? '000.000.000-00' : '00.000.000/0000-00'" @keydown.enter="validate" />
        <button class="tool-btn" @click="validate">Validar</button>
      </div>
      <div v-if="validationResult" style="margin-top:0.5rem;font-weight:600;font-size:0.9rem"
        :style="{ color: validationResult.ok ? 'var(--green)' : 'var(--red)' }">
        {{ validationResult.msg }}
      </div>
    </div>
  </div>
</template>
