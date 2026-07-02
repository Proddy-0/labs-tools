<script setup lang="ts">
const raw = ref('11987654321')

function digits(s: string): string { return s.replace(/\D/g, '') }

const results = computed(() => {
  const d = digits(raw.value)

  const brFormats: { label: string; value: string }[] = []
  const d11 = d.slice(0, 11)
  const d10 = d.slice(0, 10)

  if (d.length >= 10) {
    const area = d11.slice(0, 2)
    const isMobile = d11.length === 11
    const num = isMobile ? d11.slice(2) : d10.slice(2)
    const p1 = isMobile ? num.slice(0, 5) : num.slice(0, 4)
    const p2 = num.slice(-4)
    brFormats.push(
      { label: 'BR local',       value: `${p1}-${p2}` },
      { label: 'BR com DDD',     value: `(${area}) ${p1}-${p2}` },
      { label: 'BR +55',         value: `+55 (${area}) ${p1}-${p2}` },
      { label: 'BR compacto',    value: `+55${area}${num}` },
      { label: 'BR só dígitos',  value: d11 },
    )
  }

  const usFormats: { label: string; value: string }[] = []
  if (d.length >= 10) {
    const area = d.slice(0, 3)
    const mid  = d.slice(3, 6)
    const last = d.slice(6, 10)
    usFormats.push(
      { label: 'US (xxx) xxx-xxxx', value: `(${area}) ${mid}-${last}` },
      { label: 'US xxx-xxx-xxxx',   value: `${area}-${mid}-${last}` },
      { label: 'US +1',             value: `+1 (${area}) ${mid}-${last}` },
      { label: 'US E.164',          value: `+1${area}${mid}${last}` },
    )
  }

  const intl: { label: string; value: string }[] = []
  if (d.length >= 7) {
    intl.push(
      { label: 'Só dígitos',   value: d },
      { label: 'E.164 (+XX)',  value: `+${d}` },
    )
  }

  return { br: brFormats, us: usFormats, intl }
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
      <label class="tool-label">Número (somente dígitos)</label>
      <input v-model="raw" class="tool-input" placeholder="11987654321" maxlength="20" />
      <div class="small" style="margin-top:0.3rem">{{ digits(raw).length }} dígitos</div>
    </div>

    <template v-if="results.br.length">
      <div>
        <label class="tool-label" style="color:var(--amber)">Brasil 🇧🇷</label>
        <div style="display:flex;flex-direction:column;gap:0.3rem;margin-top:0.3rem">
          <div v-for="r in results.br" :key="r.label" class="result-row">
            <span class="result-label">{{ r.label }}</span>
            <div class="row-actions">
              <span class="result-value">{{ r.value }}</span>
              <button class="copy-btn" :class="{ copied: copied===r.label }" @click="copy(r.value,r.label)">
                {{ copied===r.label?'✓':'copiar' }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div>
        <label class="tool-label" style="color:var(--blue)">EUA / CA 🇺🇸</label>
        <div style="display:flex;flex-direction:column;gap:0.3rem;margin-top:0.3rem">
          <div v-for="r in results.us" :key="r.label" class="result-row">
            <span class="result-label">{{ r.label }}</span>
            <div class="row-actions">
              <span class="result-value">{{ r.value }}</span>
              <button class="copy-btn" :class="{ copied: copied===r.label }" @click="copy(r.value,r.label)">
                {{ copied===r.label?'✓':'copiar' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </template>

    <div>
      <label class="tool-label">Internacional</label>
      <div style="display:flex;flex-direction:column;gap:0.3rem;margin-top:0.3rem">
        <div v-for="r in results.intl" :key="r.label" class="result-row">
          <span class="result-label">{{ r.label }}</span>
          <div class="row-actions">
            <span class="result-value">{{ r.value }}</span>
            <button class="copy-btn" :class="{ copied: copied===r.label }" @click="copy(r.value,r.label)">
              {{ copied===r.label?'✓':'copiar' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
