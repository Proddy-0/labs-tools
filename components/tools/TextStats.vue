<script setup lang="ts">
const text = ref(`Cole ou digite seu texto aqui para ver as estatísticas em tempo real. O analisador conta palavras, caracteres, frases, parágrafos, estima o tempo de leitura e fala, e mostra as palavras mais frequentes no texto.

É uma ferramenta útil para escritores, blogueiros e desenvolvedores que precisam monitorar o tamanho do conteúdo.`)

const stats = computed(() => {
  const t = text.value
  const chars         = t.length
  const charsNoSpace  = t.replace(/\s/g, '').length
  const words         = t.trim() ? t.trim().split(/\s+/).length : 0
  const sentences     = t.split(/[.!?]+/).filter(s => s.trim()).length
  const paragraphs    = t.split(/\n\s*\n/).filter(p => p.trim()).length || (t.trim() ? 1 : 0)
  const lines         = t.split('\n').length
  const readSec       = Math.ceil(words / 200 * 60)
  const speakSec      = Math.ceil(words / 130 * 60)
  const uniqueWords   = new Set(t.toLowerCase().match(/\b[a-záàãâéêíóôõúç]+\b/gi) ?? []).size

  // Top words
  const wordFreq = new Map<string, number>()
  ;(t.toLowerCase().match(/\b[a-záàãâéêíóôõúç]{3,}\b/gi) ?? []).forEach(w => {
    wordFreq.set(w, (wordFreq.get(w) ?? 0) + 1)
  })
  const topWords = [...wordFreq.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)

  return { chars, charsNoSpace, words, sentences, paragraphs, lines, readSec, speakSec, uniqueWords, topWords }
})

function fmtTime(sec: number): string {
  if (sec < 60) return `${sec}s`
  return `${Math.floor(sec / 60)}min ${sec % 60}s`
}
</script>

<template>
  <div class="tool-layout">
    <div>
      <label class="tool-label">Texto</label>
      <textarea v-model="text" class="tool-ta" rows="8" placeholder="Cole ou digite seu texto aqui…" />
    </div>

    <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:0.5rem">
      <div v-for="row in [
        { label:'Palavras',             value: stats.words,           color: 'var(--amber)' },
        { label:'Caracteres',           value: stats.chars,           color: 'var(--text)' },
        { label:'Sem espaços',          value: stats.charsNoSpace,    color: 'var(--text)' },
        { label:'Frases',               value: stats.sentences,       color: 'var(--blue)' },
        { label:'Parágrafos',           value: stats.paragraphs,      color: 'var(--text)' },
        { label:'Linhas',               value: stats.lines,           color: 'var(--text)' },
        { label:'Palavras únicas',      value: stats.uniqueWords,     color: 'var(--green)' },
        { label:'Tempo de leitura',     value: fmtTime(stats.readSec), color: 'var(--amber)' },
        { label:'Tempo de fala',        value: fmtTime(stats.speakSec),color: 'var(--amber)' },
      ]" :key="row.label"
        style="background:var(--bg);border:1px solid var(--line);border-radius:8px;padding:0.75rem;display:flex;flex-direction:column;gap:0.25rem">
        <span style="font-size:0.68rem;color:var(--muted);text-transform:uppercase;letter-spacing:0.08em">{{ row.label }}</span>
        <span :style="{ color: row.color, fontFamily:'var(--mono)', fontSize:'1.3rem', fontWeight:'700' }">{{ row.value }}</span>
      </div>
    </div>

    <div v-if="stats.topWords.length">
      <label class="tool-label">Palavras mais frequentes</label>
      <div style="display:flex;flex-wrap:wrap;gap:0.4rem">
        <span v-for="[word, freq] in stats.topWords" :key="word"
          style="display:flex;align-items:center;gap:0.4rem;padding:0.3rem 0.65rem;background:var(--bg);border:1px solid var(--line);border-radius:20px">
          <span style="font-size:0.82rem;color:var(--text)">{{ word }}</span>
          <span style="font-size:0.7rem;color:var(--amber);font-family:var(--mono)">×{{ freq }}</span>
        </span>
      </div>
    </div>
  </div>
</template>
