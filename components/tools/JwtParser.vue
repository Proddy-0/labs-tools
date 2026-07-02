<script setup lang="ts">
const token = ref('')
const sample = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkF5c2xsYW4iLCJpYXQiOjE1MTYyMzkwMjIsImV4cCI6OTk5OTk5OTk5OX0.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'

function b64urlDecode(s: string): string {
  const base64 = s.replace(/-/g,'+').replace(/_/g,'/')
  try {
    return decodeURIComponent(atob(base64).split('').map(c => '%' + c.charCodeAt(0).toString(16).padStart(2,'0')).join(''))
  } catch { return '' }
}

const parsed = computed(() => {
  const t = token.value.trim()
  if (!t) return null
  const parts = t.split('.')
  if (parts.length !== 3) return { error: 'JWT inválido — precisa ter 3 partes separadas por ponto' }
  try {
    return {
      header:    JSON.parse(b64urlDecode(parts[0])),
      payload:   JSON.parse(b64urlDecode(parts[1])),
      signature: parts[2],
    }
  } catch (e: any) {
    return { error: e.message }
  }
})

const status = computed(() => {
  const exp = parsed.value?.payload?.exp
  if (!exp) return null
  const now = Date.now() / 1000
  const diff = exp - now
  if (diff < 0) return { text: `Expirado há ${fmtDur(-diff)}`, color: 'var(--red)' }
  return { text: `Expira em ${fmtDur(diff)}`, color: 'var(--green)' }
})

function fmtDur(sec: number): string {
  if (sec < 60) return `${Math.round(sec)}s`
  if (sec < 3600) return `${Math.floor(sec/60)}min`
  if (sec < 86400) return `${Math.floor(sec/3600)}h`
  return `${Math.floor(sec/86400)} dias`
}

function fmtDate(ts: number): string {
  return new Date(ts * 1000).toLocaleString('pt-BR')
}

const copied = ref('')
async function copy(text: string, key: string) {
  await navigator.clipboard.writeText(typeof text === 'object' ? JSON.stringify(text, null, 2) : text)
  copied.value = key; setTimeout(() => copied.value = '', 1500)
}
</script>

<template>
  <div class="tool-layout">
    <div>
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.25rem">
        <label class="tool-label" style="margin:0">JWT Token</label>
        <button class="copy-btn" @click="token = sample" style="color:var(--amber)">usar exemplo</button>
      </div>
      <textarea v-model="token" class="tool-ta" rows="4" placeholder="Cole seu JWT aqui…" style="word-break:break-all" />
    </div>

    <div v-if="parsed?.error" class="tool-output" style="color:var(--red)">{{ parsed.error }}</div>

    <template v-if="parsed && !parsed.error">
      <div v-if="status" style="padding:0.5rem 0.75rem;border-radius:6px;border:1px solid currentColor;font-size:0.82rem" :style="{ color: status.color }">
        {{ status.text }}
        <span v-if="parsed.payload?.exp" class="small" style="margin-left:0.5rem">({{ fmtDate(parsed.payload.exp) }})</span>
      </div>

      <div>
        <div style="display:flex;justify-content:space-between;align-items:center">
          <label class="tool-label">Header</label>
          <button class="copy-btn" :class="{ copied: copied==='h' }" @click="copy(JSON.stringify(parsed.header, null, 2),'h')">{{ copied==='h'?'✓':'copiar' }}</button>
        </div>
        <pre class="tool-output" style="font-size:0.8rem">{{ JSON.stringify(parsed.header, null, 2) }}</pre>
      </div>

      <div>
        <div style="display:flex;justify-content:space-between;align-items:center">
          <label class="tool-label">Payload</label>
          <button class="copy-btn" :class="{ copied: copied==='p' }" @click="copy(JSON.stringify(parsed.payload, null, 2),'p')">{{ copied==='p'?'✓':'copiar' }}</button>
        </div>
        <pre class="tool-output" style="font-size:0.8rem">{{ JSON.stringify(parsed.payload, null, 2) }}</pre>
      </div>

      <div>
        <label class="tool-label">Signature (raw)</label>
        <div class="tool-output" style="word-break:break-all;color:var(--muted)">{{ parsed.signature }}</div>
      </div>
    </template>
  </div>
</template>
