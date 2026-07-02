<script setup lang="ts">
const WORDS = 'lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua enim ad minim veniam quis nostrud exercitation ullamco laboris nisi aliquip ex ea commodo consequat duis aute irure dolor reprehenderit voluptate velit esse cillum dolore eu fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt in culpa qui officia deserunt mollit anim id est laborum pellentesque habitant morbi tristique senectus netus malesuada fames turpis egestas curabitur pretium tincidunt lacus fermentum ligula condimentum imperdiet proin gravida fringilla viverra augue metus dictum mattis urna eleifend mauris aenean faucibus lacinia erat'.split(' ')

const type   = ref<'paragraphs'|'sentences'|'words'>('paragraphs')
const count  = ref(3)
const startLorem = ref(true)
const result = ref('')
const copied = ref(false)

function pick(): string { return WORDS[Math.floor(Math.random() * WORDS.length)] }

function sentence(): string {
  const len = 8 + Math.floor(Math.random() * 12)
  const words = Array.from({ length: len }, pick)
  words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1)
  return words.join(' ') + '.'
}

function paragraph(): string {
  const n = 4 + Math.floor(Math.random() * 4)
  return Array.from({ length: n }, sentence).join(' ')
}

function generate() {
  let text = ''
  if (type.value === 'words') {
    const words = Array.from({ length: count.value }, pick)
    if (startLorem.value) { words[0] = 'Lorem'; words[1] = 'ipsum' }
    text = words.join(' ')
  } else if (type.value === 'sentences') {
    const sents = Array.from({ length: count.value }, sentence)
    if (startLorem.value) sents[0] = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
    text = sents.join(' ')
  } else {
    const paras = Array.from({ length: count.value }, paragraph)
    if (startLorem.value) paras[0] = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
    text = paras.join('\n\n')
  }
  result.value = text
}

async function copy() {
  await navigator.clipboard.writeText(result.value)
  copied.value = true; setTimeout(() => copied.value = false, 1500)
}

onMounted(generate)
</script>

<template>
  <div class="tool-layout">
    <div class="tool-row" style="align-items:flex-end">
      <div class="tool-col">
        <label class="tool-label">Tipo</label>
        <select v-model="type" class="tool-sel">
          <option value="paragraphs">Parágrafos</option>
          <option value="sentences">Frases</option>
          <option value="words">Palavras</option>
        </select>
      </div>
      <div class="tool-col">
        <label class="tool-label">Quantidade</label>
        <input v-model.number="count" type="number" min="1" max="100" class="tool-input" />
      </div>
      <div class="tool-col" style="flex:0 0 auto;justify-content:flex-end">
        <label style="display:flex;align-items:center;gap:0.5rem;cursor:pointer;font-size:0.8rem;color:var(--muted)">
          <input type="checkbox" v-model="startLorem" />
          Começar com "Lorem ipsum"
        </label>
      </div>
    </div>

    <div style="display:flex;gap:0.5rem">
      <button class="tool-btn" @click="generate">Gerar</button>
      <button class="copy-btn" :class="{ copied }" @click="copy">{{ copied ? '✓ copiado' : 'copiar texto' }}</button>
    </div>

    <div>
      <label class="tool-label">Resultado</label>
      <textarea :value="result" class="tool-ta" rows="12" readonly style="line-height:1.7" />
    </div>

    <div class="small">
      {{ result.split(/\s+/).filter(Boolean).length }} palavras ·
      {{ result.length }} caracteres
    </div>
  </div>
</template>
