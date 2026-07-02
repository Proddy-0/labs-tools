<script setup lang="ts">
import QRCode from 'qrcode'

const secret    = ref('')
const issuer    = ref('ProddytLabs')
const account   = ref('user@proddyt.site')
const code      = ref('------')
const secs      = ref(30)
const canvasRef = ref<HTMLCanvasElement | null>(null)
const copied    = ref(false)

const B32 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'

function genSecret() {
  const arr = new Uint8Array(20)
  crypto.getRandomValues(arr)
  secret.value = [...arr].map(b => B32[b % 32]).join('')
}

function b32Decode(s: string): Uint8Array {
  const bytes: number[] = []
  let buf = 0, bits = 0
  for (const c of s.toUpperCase().replace(/=+$/, '')) {
    const idx = B32.indexOf(c)
    if (idx < 0) continue
    buf = (buf << 5) | idx; bits += 5
    if (bits >= 8) { bits -= 8; bytes.push((buf >> bits) & 0xff) }
  }
  return new Uint8Array(bytes)
}

async function calcTOTP(sec: string): Promise<string> {
  const key = b32Decode(sec)
  const counter = Math.floor(Date.now() / 30000)
  const buf = new ArrayBuffer(8)
  new DataView(buf).setUint32(4, counter, false)
  const ck = await crypto.subtle.importKey('raw', key, { name:'HMAC', hash:'SHA-1' }, false, ['sign'])
  const sig = new Uint8Array(await crypto.subtle.sign('HMAC', ck, buf))
  const o = sig[sig.length - 1] & 0xf
  const n = ((sig[o] & 0x7f) << 24 | (sig[o+1] & 0xff) << 16 | (sig[o+2] & 0xff) << 8 | sig[o+3]) % 1_000_000
  return String(n).padStart(6, '0')
}

async function tick() {
  secs.value = 30 - (Math.floor(Date.now() / 1000) % 30)
  if (secret.value.length >= 16) {
    try { code.value = await calcTOTP(secret.value) } catch { code.value = '------' }
  }
}

async function updateQR() {
  if (!canvasRef.value || !secret.value) return
  const uri = `otpauth://totp/${encodeURIComponent(issuer.value)}:${encodeURIComponent(account.value)}?secret=${secret.value}&issuer=${encodeURIComponent(issuer.value)}`
  try {
    await QRCode.toCanvas(canvasRef.value, uri, {
      color: { dark: '#ff7a18', light: '#111214' }, width: 180, margin: 1
    })
  } catch {}
}

let timer: ReturnType<typeof setInterval>
onMounted(() => { genSecret(); timer = setInterval(tick, 1000) })
onUnmounted(() => clearInterval(timer))
watch(secret, async () => { await tick(); await updateQR() })
watch([issuer, account], updateQR)
watch(canvasRef, updateQR)

async function copyCode() {
  await navigator.clipboard.writeText(code.value)
  copied.value = true; setTimeout(() => copied.value = false, 1500)
}
</script>

<template>
  <div class="tool-layout">
    <div class="tool-row">
      <div class="tool-col">
        <label class="tool-label">Secret (Base32)</label>
        <div style="display:flex;gap:0.5rem">
          <input v-model="secret" class="tool-input" placeholder="JBSWY3DPEHPK3PXP" />
          <button class="tool-btn secondary" @click="genSecret" style="white-space:nowrap">Gerar</button>
        </div>
        <label class="tool-label" style="margin-top:0.75rem">Issuer</label>
        <input v-model="issuer" class="tool-input" />
        <label class="tool-label" style="margin-top:0.75rem">Account</label>
        <input v-model="account" class="tool-input" />
      </div>
      <div class="tool-col" style="flex:0 0 auto;align-items:center">
        <label class="tool-label" style="text-align:center">QR Code</label>
        <canvas ref="canvasRef" width="180" height="180" style="border-radius:8px" />
      </div>
    </div>

    <div style="display:flex;align-items:center;justify-content:center;gap:1.5rem;padding:1rem;background:var(--bg);border:1px solid var(--line);border-radius:8px">
      <div style="text-align:center">
        <div style="font-size:0.7rem;color:var(--muted);text-transform:uppercase;letter-spacing:0.1em;margin-bottom:0.5rem">Código atual</div>
        <div style="font-size:2.5rem;font-family:var(--mono);font-weight:700;letter-spacing:0.25em;color:var(--amber)">
          {{ code.slice(0,3) }} {{ code.slice(3) }}
        </div>
      </div>
      <div style="text-align:center">
        <div style="font-size:0.7rem;color:var(--muted);text-transform:uppercase;letter-spacing:0.1em;margin-bottom:0.5rem">Expira em</div>
        <div style="font-size:2rem;font-family:var(--mono);font-weight:700" :style="{ color: secs <= 5 ? 'var(--red)' : 'var(--text)' }">{{ secs }}s</div>
      </div>
      <button class="tool-btn" @click="copyCode">{{ copied ? '✓ copiado' : 'copiar código' }}</button>
    </div>
  </div>
</template>
