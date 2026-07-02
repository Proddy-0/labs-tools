<script setup lang="ts">
import { marked } from 'marked'

const markdown = ref(`# Markdown Preview

Escreva seu **markdown** aqui e veja o _resultado_ ao vivo.

## Lista
- Item 1
- Item 2
- Item 3

## Código
\`\`\`js
const hello = () => console.log('Hello!')
\`\`\`

> Citação de exemplo aqui.
`)

const showHtml = ref(false)
const html = computed(() => marked(markdown.value) as string)

const copied = ref(false)
async function copy() {
  await navigator.clipboard.writeText(showHtml.value ? html.value : markdown.value)
  copied.value = true; setTimeout(() => copied.value = false, 1500)
}
</script>

<template>
  <div class="tool-layout">
    <div class="tool-row" style="gap:0.5rem;align-items:center">
      <div style="flex:1" />
      <button class="tool-btn secondary" :class="{ 'hbtn-active': showHtml }" @click="showHtml = !showHtml">
        {{ showHtml ? 'Preview' : 'HTML raw' }}
      </button>
      <button class="copy-btn" :class="{ copied }" @click="copy">{{ copied ? '✓' : 'copiar' }}</button>
    </div>

    <div class="tool-row" style="height:440px">
      <div class="tool-col">
        <label class="tool-label">Markdown</label>
        <textarea v-model="markdown" class="tool-ta" style="height:100%;resize:none" />
      </div>
      <div class="tool-col">
        <label class="tool-label">{{ showHtml ? 'HTML' : 'Preview' }}</label>
        <div v-if="showHtml" class="tool-output" style="height:100%;overflow-y:auto;font-family:var(--mono);font-size:0.78rem">{{ html }}</div>
        <div
          v-else
          class="md-preview"
          v-html="html"
          style="height:100%;overflow-y:auto;padding:0.75rem;background:var(--bg);border:1px solid var(--line);border-radius:6px;font-size:0.88rem;line-height:1.6"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.md-preview :deep(h1),:deep(h2),:deep(h3) { color:var(--text); margin:0.75rem 0 0.4rem; font-weight:700 }
.md-preview :deep(h1) { font-size:1.4rem }
.md-preview :deep(h2) { font-size:1.15rem }
.md-preview :deep(h3) { font-size:1rem }
.md-preview :deep(p)  { margin:0 0 0.6rem; color:var(--text) }
.md-preview :deep(code) { background:rgba(255,255,255,0.07); padding:0.1rem 0.35rem; border-radius:4px; font-family:var(--mono); font-size:0.82em }
.md-preview :deep(pre) { background:var(--bg-hover); padding:0.75rem; border-radius:6px; overflow-x:auto; margin:0.5rem 0 }
.md-preview :deep(pre code) { background:none; padding:0 }
.md-preview :deep(blockquote) { border-left:3px solid var(--amber); padding-left:0.75rem; color:var(--muted); margin:0.5rem 0 }
.md-preview :deep(ul),:deep(ol) { padding-left:1.5rem; margin:0 0 0.6rem }
.md-preview :deep(li) { margin-bottom:0.2rem }
.md-preview :deep(a) { color:var(--amber) }
.md-preview :deep(hr) { border:none; border-top:1px solid var(--line); margin:0.75rem 0 }
</style>
