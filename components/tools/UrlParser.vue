<script setup lang="ts">
const raw = ref('https://proddyt.site/tools?search=json&page=1#results')

const parsed = computed(() => {
  try {
    const u = new URL(raw.value)
    const params: {key:string;value:string}[] = []
    u.searchParams.forEach((v,k) => params.push({key:k, value:v}))
    return {
      ok: true,
      protocol: u.protocol.replace(':',''),
      host: u.hostname,
      port: u.port || (u.protocol === 'https:' ? '443' : '80'),
      path: u.pathname,
      params,
      hash: u.hash.replace('#',''),
      origin: u.origin,
      full: u.href,
    }
  } catch {
    return { ok: false }
  }
})

const encoded = computed(() => {
  try { return encodeURIComponent(raw.value) } catch { return '' }
})
const decoded = computed(() => {
  try { return decodeURIComponent(raw.value) } catch { return raw.value }
})

const copied = ref('')
async function copy(text: string, key: string) {
  await navigator.clipboard.writeText(text)
  copied.value = key; setTimeout(() => copied.value = '', 1500)
}
</script>

<template>
  <div class="tool-layout">
    <div>
      <label class="tool-label">URL</label>
      <input v-model="raw" class="tool-input" placeholder="https://example.com/path?key=value#hash" />
    </div>

    <div v-if="!parsed.ok" class="tool-output" style="color:var(--red)">URL inválida</div>

    <template v-if="parsed.ok">
      <div v-for="(val, key) in { Protocolo: parsed.protocol, Host: parsed.host, Porta: parsed.port, Caminho: parsed.path, Hash: parsed.hash || '—' }"
        :key="key" class="result-row">
        <span class="result-label">{{ key }}</span>
        <div class="row-actions">
          <span class="result-value">{{ val }}</span>
          <button v-if="val !== '—'" class="copy-btn" :class="{ copied: copied === key }" @click="copy(String(val), String(key))">
            {{ copied === key ? '✓' : 'copiar' }}
          </button>
        </div>
      </div>

      <div v-if="parsed.params?.length">
        <label class="tool-label" style="margin-top:0.5rem;display:block">Query params</label>
        <div v-for="p in parsed.params" :key="p.key" class="result-row">
          <span class="result-label" style="color:var(--amber)">{{ p.key }}</span>
          <div class="row-actions">
            <span class="result-value">{{ p.value }}</span>
            <button class="copy-btn" :class="{ copied: copied === p.key }" @click="copy(p.value, p.key)">
              {{ copied === p.key ? '✓' : 'copiar' }}
            </button>
          </div>
        </div>
      </div>
    </template>

    <div style="margin-top:0.5rem;display:flex;flex-direction:column;gap:0.5rem">
      <label class="tool-label">Encode / Decode</label>
      <div class="result-row">
        <span class="result-label">Encoded</span>
        <div class="row-actions">
          <span class="result-value" style="max-width:420px">{{ encoded }}</span>
          <button class="copy-btn" :class="{ copied: copied === 'enc' }" @click="copy(encoded,'enc')">{{ copied==='enc'?'✓':'copiar' }}</button>
        </div>
      </div>
      <div class="result-row">
        <span class="result-label">Decoded</span>
        <div class="row-actions">
          <span class="result-value" style="max-width:420px">{{ decoded }}</span>
          <button class="copy-btn" :class="{ copied: copied === 'dec' }" @click="copy(decoded,'dec')">{{ copied==='dec'?'✓':'copiar' }}</button>
        </div>
      </div>
    </div>
  </div>
</template>
