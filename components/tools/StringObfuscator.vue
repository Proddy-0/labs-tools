<script setup lang="ts">
const input = ref('Proddyt Labs — Homelab Server')

function rot13(s: string): string {
  return s.replace(/[a-zA-Z]/g, c => {
    const b = c <= 'Z' ? 65 : 97
    return String.fromCharCode(((c.charCodeAt(0) - b + 13) % 26) + b)
  })
}
function rot47(s: string): string {
  return s.replace(/[\x21-\x7e]/g, c => String.fromCharCode(((c.charCodeAt(0) - 33 + 47) % 94) + 33))
}
function toBase64(s: string): string { try { return btoa(unescape(encodeURIComponent(s))) } catch { return '?' } }
function fromBase64(s: string): string { try { return decodeURIComponent(escape(atob(s))) } catch { return '?' } }
function toUrlEnc(s: string): string { return encodeURIComponent(s) }
function toHtmlEntities(s: string): string {
  return [...s].map(c => `&#${c.charCodeAt(0)};`).join('')
}
function toUnicodeEscape(s: string): string {
  return [...s].map(c => '\\u' + c.charCodeAt(0).toString(16).padStart(4, '0')).join('')
}
function toHexStr(s: string): string {
  return [...s].map(c => c.charCodeAt(0).toString(16).padStart(2, '0')).join(' ')
}
function toBinaryStr(s: string): string {
  return [...s].map(c => c.charCodeAt(0).toString(2).padStart(8, '0')).join(' ')
}
function reverse(s: string): string { return [...s].reverse().join('') }
function toMorse(s: string): string {
  const MAP: Record<string, string> = {
    a:'.-', b:'-...', c:'-.-.', d:'-..', e:'.', f:'..-.', g:'--.', h:'....', i:'..', j:'.---',
    k:'-.-', l:'.-..', m:'--', n:'-.', o:'---', p:'.--.', q:'--.-', r:'.-.', s:'...', t:'-',
    u:'..-', v:'...-', w:'.--', x:'-..-', y:'-.--', z:'--..',
    '0':'-----','1':'.----','2':'..---','3':'...--','4':'....-','5':'.....','6':'-....','7':'--...','8':'---..','9':'----.',
    ' ':'/'
  }
  return s.toLowerCase().split('').map(c => MAP[c] ?? '?').join(' ')
}

const rows = computed(() => [
  { label: 'ROT13',           value: rot13(input.value) },
  { label: 'ROT47',           value: rot47(input.value) },
  { label: 'Base64 encode',   value: toBase64(input.value) },
  { label: 'Base64 decode',   value: fromBase64(input.value) },
  { label: 'URL encode',      value: toUrlEnc(input.value) },
  { label: 'HTML entities',   value: toHtmlEntities(input.value) },
  { label: 'Unicode escape',  value: toUnicodeEscape(input.value) },
  { label: 'Hex string',      value: toHexStr(input.value) },
  { label: 'Binary string',   value: toBinaryStr(input.value) },
  { label: 'Reversed',        value: reverse(input.value) },
  { label: 'Morse code',      value: toMorse(input.value) },
])

const copied = ref('')
async function copy(text: string, key: string) {
  await navigator.clipboard.writeText(text)
  copied.value = key; setTimeout(() => copied.value = '', 1500)
}
</script>

<template>
  <div class="tool-layout">
    <div>
      <label class="tool-label">Texto de entrada</label>
      <input v-model="input" class="tool-input" placeholder="Digite o texto a transformar…" />
    </div>

    <div style="display:flex;flex-direction:column;gap:0.4rem;max-height:400px;overflow-y:auto">
      <div v-for="row in rows" :key="row.label" class="result-row">
        <span class="result-label" style="min-width:120px">{{ row.label }}</span>
        <div class="row-actions" style="flex:1;min-width:0">
          <span class="result-value" style="max-width:none;flex:1;word-break:break-all;font-size:0.78rem">{{ row.value }}</span>
          <button class="copy-btn" :class="{ copied: copied === row.label }" @click="copy(row.value, row.label)" style="flex-shrink:0">
            {{ copied === row.label ? '✓' : 'copiar' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
