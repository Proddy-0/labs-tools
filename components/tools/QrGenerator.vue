<script setup lang="ts">
import QRCode from 'qrcode'

const text      = ref('https://proddyt.site')
const fgColor   = ref('#ff7a18')
const bgColor   = ref('#111214')
const size      = ref(256)
const canvasRef = ref<HTMLCanvasElement | null>(null)
const error     = ref('')

async function generate() {
  if (!canvasRef.value) return
  error.value = ''
  try {
    await QRCode.toCanvas(canvasRef.value, text.value || ' ', {
      color: { dark: fgColor.value, light: bgColor.value },
      width: size.value,
      margin: 2,
    })
  } catch (e: any) {
    error.value = e.message
  }
}

function download() {
  const canvas = canvasRef.value
  if (!canvas) return
  const a = document.createElement('a')
  a.href = canvas.toDataURL('image/png')
  a.download = 'qrcode.png'
  a.click()
}

watch([text, fgColor, bgColor, size], generate)
watch(canvasRef, generate)
onMounted(generate)
</script>

<template>
  <div class="tool-layout">
    <div>
      <label class="tool-label">Texto ou URL</label>
      <textarea v-model="text" class="tool-ta" rows="3" placeholder="https://proddyt.site" />
    </div>

    <div class="tool-row">
      <div class="tool-col">
        <label class="tool-label">Cor do QR</label>
        <div style="display:flex;gap:0.5rem;align-items:center">
          <input type="color" v-model="fgColor" style="width:40px;height:36px;border:none;background:none;cursor:pointer" />
          <input v-model="fgColor" class="tool-input" style="flex:1" />
        </div>
      </div>
      <div class="tool-col">
        <label class="tool-label">Cor de fundo</label>
        <div style="display:flex;gap:0.5rem;align-items:center">
          <input type="color" v-model="bgColor" style="width:40px;height:36px;border:none;background:none;cursor:pointer" />
          <input v-model="bgColor" class="tool-input" style="flex:1" />
        </div>
      </div>
      <div class="tool-col">
        <label class="tool-label">Tamanho (px)</label>
        <input v-model.number="size" type="number" min="100" max="500" step="50" class="tool-input" />
      </div>
    </div>

    <div v-if="error" class="tool-output" style="color:var(--red)">{{ error }}</div>

    <div style="display:flex;flex-direction:column;align-items:center;gap:1rem">
      <canvas ref="canvasRef" :width="size" :height="size" style="border-radius:8px;border:1px solid var(--line)" />
      <button class="tool-btn" @click="download">⬇ Download PNG</button>
    </div>
  </div>
</template>
