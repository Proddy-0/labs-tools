<script setup lang="ts">
const hex = ref('#ff7a18')

function hexToRgb(h: string) {
  const c = h.replace('#','')
  const n = parseInt(c.length === 3 ? c.split('').map(x=>x+x).join('') : c, 16)
  return { r: (n>>16)&255, g: (n>>8)&255, b: n&255 }
}

const rgb = computed(() => hexToRgb(hex.value))

const hsl = computed(() => {
  let { r, g, b } = rgb.value
  r /= 255; g /= 255; b /= 255
  const max = Math.max(r,g,b), min = Math.min(r,g,b)
  let h = 0, s = 0, l = (max+min)/2
  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d/(2-max-min) : d/(max+min)
    switch (max) {
      case r: h = ((g-b)/d + (g<b?6:0))/6; break
      case g: h = ((b-r)/d + 2)/6; break
      case b: h = ((r-g)/d + 4)/6; break
    }
  }
  return { h: Math.round(h*360), s: Math.round(s*100), l: Math.round(l*100) }
})

const hsv = computed(() => {
  let { r, g, b } = rgb.value
  r /= 255; g /= 255; b /= 255
  const max = Math.max(r,g,b), min = Math.min(r,g,b), d = max - min
  let h = 0, s = max === 0 ? 0 : d/max, v = max
  if (d !== 0) {
    switch (max) {
      case r: h = ((g-b)/d + (g<b?6:0))/6; break
      case g: h = ((b-r)/d + 2)/6; break
      case b: h = ((r-g)/d + 4)/6; break
    }
  }
  return { h: Math.round(h*360), s: Math.round(s*100), v: Math.round(v*100) }
})

const cmyk = computed(() => {
  let { r, g, b } = rgb.value
  r /= 255; g /= 255; b /= 255
  const k = 1 - Math.max(r,g,b)
  if (k === 1) return { c:0, m:0, y:0, k:100 }
  return {
    c: Math.round((1-r-k)/(1-k)*100),
    m: Math.round((1-g-k)/(1-k)*100),
    y: Math.round((1-b-k)/(1-k)*100),
    k: Math.round(k*100),
  }
})

const rows = computed(() => {
  const { r,g,b } = rgb.value
  const { h:hl, s:sl, l } = hsl.value
  const { h:hv, s:sv, v } = hsv.value
  const { c, m, y, k } = cmyk.value
  return [
    { label: 'HEX',  value: hex.value.toUpperCase() },
    { label: 'RGB',  value: `rgb(${r}, ${g}, ${b})` },
    { label: 'HSL',  value: `hsl(${hl}, ${sl}%, ${l}%)` },
    { label: 'HSV',  value: `hsv(${hv}, ${sv}%, ${v}%)` },
    { label: 'CMYK', value: `cmyk(${c}%, ${m}%, ${y}%, ${k}%)` },
    { label: 'CSS rgba', value: `rgba(${r}, ${g}, ${b}, 1)` },
  ]
})

const copied = ref('')
async function copy(text: string, key: string) {
  await navigator.clipboard.writeText(text)
  copied.value = key; setTimeout(() => copied.value = '', 1500)
}

function onHexInput(e: Event) {
  const v = (e.target as HTMLInputElement).value
  if (/^#[0-9a-fA-F]{6}$/.test(v) || /^#[0-9a-fA-F]{3}$/.test(v)) hex.value = v
}
</script>

<template>
  <div class="tool-layout">
    <div class="tool-row" style="align-items:center;gap:1rem">
      <div class="tool-col" style="flex:0 0 auto">
        <label class="tool-label">Color picker</label>
        <input type="color" :value="hex" @input="e => hex = (e.target as HTMLInputElement).value"
          style="width:56px;height:56px;border:none;background:none;cursor:pointer;border-radius:8px;" />
      </div>
      <div class="tool-col">
        <label class="tool-label">HEX manual</label>
        <input class="tool-input" :value="hex" @change="onHexInput" placeholder="#ffffff" />
      </div>
      <div class="tool-col" style="flex:0 0 80px">
        <label class="tool-label">Preview</label>
        <div :style="{background:hex, width:'80px', height:'56px', borderRadius:'8px', border:'1px solid var(--line)'}" />
      </div>
    </div>

    <div v-for="row in rows" :key="row.label" class="result-row">
      <span class="result-label">{{ row.label }}</span>
      <div class="row-actions">
        <span class="result-value">{{ row.value }}</span>
        <button class="copy-btn" :class="{ copied: copied === row.label }" @click="copy(row.value, row.label)">
          {{ copied === row.label ? '✓' : 'copiar' }}
        </button>
      </div>
    </div>
  </div>
</template>
