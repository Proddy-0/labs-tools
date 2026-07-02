<script setup lang="ts">
const editorRef = ref<HTMLDivElement | null>(null)
const htmlOut   = ref('')
const showHtml  = ref(false)
const copied    = ref(false)

function exec(cmd: string, val?: string) {
  document.execCommand(cmd, false, val)
  update()
  editorRef.value?.focus()
}

function update() {
  htmlOut.value = editorRef.value?.innerHTML ?? ''
}

function insertLink() {
  const url = prompt('URL do link:')
  if (url) exec('createLink', url)
}

function insertColor() {
  const color = prompt('Cor (HEX ou nome):')
  if (color) exec('foreColor', color)
}

async function copy() {
  await navigator.clipboard.writeText(showHtml.value ? htmlOut.value : (editorRef.value?.innerText ?? ''))
  copied.value = true; setTimeout(() => copied.value = false, 1500)
}

const btns = [
  { label:'B',     cmd:'bold',          title:'Negrito',         style:'font-weight:700' },
  { label:'I',     cmd:'italic',        title:'Itálico',         style:'font-style:italic' },
  { label:'U',     cmd:'underline',     title:'Sublinhado',      style:'text-decoration:underline' },
  { label:'S',     cmd:'strikeThrough', title:'Tachado',         style:'text-decoration:line-through' },
  { label:'H1',    cmd:'formatBlock',   title:'Título 1',        val:'h1' },
  { label:'H2',    cmd:'formatBlock',   title:'Título 2',        val:'h2' },
  { label:'P',     cmd:'formatBlock',   title:'Parágrafo',       val:'p' },
  { label:'≡',     cmd:'justifyLeft',   title:'Alinhar esquerda' },
  { label:'≡·',    cmd:'justifyCenter', title:'Centralizar' },
  { label:'·≡',    cmd:'justifyRight',  title:'Alinhar direita' },
  { label:'UL',    cmd:'insertUnorderedList', title:'Lista bullets' },
  { label:'OL',    cmd:'insertOrderedList',   title:'Lista numerada' },
  { label:'</>',   cmd:'removeFormat',  title:'Remover formatação' },
]
</script>

<template>
  <div class="tool-layout">
    <div style="display:flex;flex-wrap:wrap;gap:0.3rem;padding:0.5rem;background:var(--bg);border:1px solid var(--line);border-radius:6px 6px 0 0">
      <button
        v-for="b in btns" :key="b.cmd + (b.val??'')"
        class="wysiwyg-btn"
        :title="b.title"
        :style="b.style"
        @click.prevent="exec(b.cmd, b.val)"
      >{{ b.label }}</button>
      <button class="wysiwyg-btn" @click.prevent="insertLink">🔗</button>
      <button class="wysiwyg-btn" @click.prevent="insertColor">🎨</button>
      <div style="flex:1" />
      <button class="tool-btn secondary" style="padding:0.2rem 0.6rem;font-size:0.75rem" @click="showHtml = !showHtml">
        {{ showHtml ? 'Editor' : 'HTML' }}
      </button>
      <button class="copy-btn" :class="{ copied }" @click="copy">{{ copied ? '✓' : 'copiar' }}</button>
    </div>

    <div
      v-show="!showHtml"
      ref="editorRef"
      contenteditable
      class="wysiwyg-body"
      @input="update"
      style="min-height:280px;background:var(--bg);border:1px solid var(--line);border-top:none;border-radius:0 0 6px 6px;padding:0.75rem 1rem;outline:none;color:var(--text);font-size:0.9rem;line-height:1.6"
    >Comece a escrever aqui…</div>

    <textarea
      v-show="showHtml"
      :value="htmlOut"
      class="tool-ta"
      rows="14"
      readonly
      style="font-size:0.78rem;border-radius:0 0 6px 6px;border-top:none"
    />
  </div>
</template>

<style scoped>
.wysiwyg-btn {
  padding: 0.25rem 0.5rem;
  background: transparent;
  border: 1px solid var(--line);
  border-radius: 4px;
  color: var(--muted);
  font-family: var(--mono);
  font-size: 0.78rem;
  cursor: pointer;
  transition: all .1s;
  min-width: 28px;
}
.wysiwyg-btn:hover { color: var(--text); border-color: rgba(255,255,255,0.2); background: var(--bg-hover); }
</style>
