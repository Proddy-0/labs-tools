<script setup lang="ts">
const input  = ref(`<catalog><book id="1"><title>Clean Code</title><author>Robert Martin</author><year>2008</year></book><book id="2"><title>The Pragmatic Programmer</title><author>Hunt &amp; Thomas</author><year>1999</year></book></catalog>`)
const output = ref('')
const error  = ref('')
const copied = ref(false)

function formatXml(xml: string): string {
  const PADDING = '  '
  let formatted = ''
  let pad = 0

  // Normalize whitespace between tags
  const normalized = xml.replace(/>\s*</g, '><').trim()

  // Split on tag boundaries keeping delimiters
  const tokens = normalized.split(/(<[^>]+>)/).filter(t => t.trim())

  for (const token of tokens) {
    if (token.match(/^<\/\w/)) {
      // Closing tag
      pad--
      formatted += PADDING.repeat(Math.max(0, pad)) + token + '\n'
    } else if (token.match(/^<\w[^>]*[^\/]>$/) && !token.includes('</')) {
      // Opening tag (not self-closing)
      formatted += PADDING.repeat(pad) + token + '\n'
      pad++
    } else if (token.match(/^<\?/) || token.match(/^<!/)) {
      // Declaration / comment
      formatted += PADDING.repeat(pad) + token + '\n'
    } else if (token.match(/\/>$/)) {
      // Self-closing
      formatted += PADDING.repeat(pad) + token + '\n'
    } else if (token.startsWith('<')) {
      // Tag with inline content or self-closing
      formatted += PADDING.repeat(pad) + token + '\n'
    } else {
      // Text content
      formatted += PADDING.repeat(pad) + token.trim() + '\n'
    }
  }
  return formatted.trim()
}

function validateXml(xml: string): string | null {
  try {
    const parser = new DOMParser()
    const doc = parser.parseFromString(xml, 'text/xml')
    const err = doc.querySelector('parsererror')
    if (err) return err.textContent ?? 'XML inválido'
    return null
  } catch (e: any) { return e.message }
}

function process() {
  error.value = ''
  const valErr = validateXml(input.value)
  if (valErr) { error.value = valErr; output.value = ''; return }
  try { output.value = formatXml(input.value) }
  catch (e: any) { error.value = e.message; output.value = '' }
}

function minify() {
  error.value = ''
  const valErr = validateXml(input.value)
  if (valErr) { error.value = valErr; return }
  output.value = input.value.replace(/>\s+</g, '><').trim()
}

async function copy() {
  await navigator.clipboard.writeText(output.value)
  copied.value = true; setTimeout(() => copied.value = false, 1500)
}

watch(input, process)
onMounted(process)
</script>

<template>
  <div class="tool-layout">
    <div class="tool-row" style="align-items:center">
      <button class="tool-btn" @click="process">Formatar</button>
      <button class="tool-btn secondary" @click="minify">Minify</button>
      <div style="flex:1" />
      <button v-if="output" class="copy-btn" :class="{ copied }" @click="copy">{{ copied ? '✓' : 'copiar' }}</button>
    </div>

    <div class="tool-row" style="height:380px">
      <div class="tool-col">
        <label class="tool-label">XML de entrada</label>
        <textarea v-model="input" class="tool-ta" style="height:100%;resize:none" />
      </div>
      <div class="tool-col">
        <label class="tool-label">XML formatado</label>
        <div v-if="error" class="tool-output" style="height:100%;overflow-y:auto;color:var(--red);white-space:pre-wrap">{{ error }}</div>
        <textarea v-else :value="output" class="tool-ta" style="height:100%;resize:none" readonly />
      </div>
    </div>
  </div>
</template>
