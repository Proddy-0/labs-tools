<script setup lang="ts">
const input = ref('hello world example text')

function toCamel(s: string) { return s.replace(/[-_\s]+(.)?/g, (_,c) => c ? c.toUpperCase() : '').replace(/^(.)/, m => m.toLowerCase()) }
function toPascal(s: string) { return s.replace(/[-_\s]+(.)?/g, (_,c) => c ? c.toUpperCase() : '').replace(/^(.)/, m => m.toUpperCase()) }
function toSnake(s: string) { return s.replace(/([a-z])([A-Z])/g,'$1_$2').replace(/[-\s]+/g,'_').toLowerCase() }
function toKebab(s: string) { return s.replace(/([a-z])([A-Z])/g,'$1-$2').replace(/[_\s]+/g,'-').toLowerCase() }
function toTitle(s: string) { return s.replace(/\w\S*/g, t => t.charAt(0).toUpperCase()+t.slice(1).toLowerCase()) }
function toScreaming(s: string) { return toSnake(s).toUpperCase() }
function toFlat(s: string) { return toSnake(s).replace(/_/g,'') }
function toCobol(s: string) { return toScreaming(s).replace(/_/g,'-') }
function toDot(s: string) { return toSnake(s).replace(/_/g,'.') }
function toPath(s: string) { return toSnake(s).replace(/_/g,'/') }
function toSponge(s: string) { return [...s].map((c,i)=>i%2===0?c.toLowerCase():c.toUpperCase()).join('') }

const variants = computed(() => {
  const s = input.value
  return [
    { label: 'camelCase',        value: toCamel(s) },
    { label: 'PascalCase',       value: toPascal(s) },
    { label: 'snake_case',       value: toSnake(s) },
    { label: 'kebab-case',       value: toKebab(s) },
    { label: 'SCREAMING_SNAKE',  value: toScreaming(s) },
    { label: 'Title Case',       value: toTitle(s) },
    { label: 'UPPERCASE',        value: s.toUpperCase() },
    { label: 'lowercase',        value: s.toLowerCase() },
    { label: 'flatcase',         value: toFlat(s) },
    { label: 'COBOL-CASE',       value: toCobol(s) },
    { label: 'dot.case',         value: toDot(s) },
    { label: 'path/case',        value: toPath(s) },
    { label: 'SpOnGeBoB',        value: toSponge(s) },
  ]
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
      <label class="tool-label">Texto de entrada</label>
      <textarea v-model="input" class="tool-ta" rows="2" placeholder="Digite ou cole seu texto aqui…" />
    </div>

    <div v-for="v in variants" :key="v.label" class="result-row">
      <span class="result-label">{{ v.label }}</span>
      <div class="row-actions">
        <span class="result-value" style="max-width:400px">{{ v.value }}</span>
        <button class="copy-btn" :class="{ copied: copied === v.label }" @click="copy(v.value, v.label)">
          {{ copied === v.label ? '✓' : 'copiar' }}
        </button>
      </div>
    </div>
  </div>
</template>
