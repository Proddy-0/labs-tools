<script setup lang="ts">
import { evaluate, format as mformat } from 'mathjs'

const expr    = ref('')
const result  = ref('')
const error   = ref('')
const history = ref<{expr:string; result:string}[]>([])
const showHelp= ref(false)

function calc() {
  if (!expr.value.trim()) return
  error.value = ''
  try {
    const res = evaluate(expr.value)
    result.value = typeof res === 'number' ? mformat(res, { precision: 14 }) : String(res)
    history.value = [{ expr: expr.value, result: result.value }, ...history.value.slice(0, 19)]
  } catch (e: any) {
    error.value = e.message
    result.value = ''
  }
}

function useHistory(item: { expr: string }) {
  expr.value = item.expr
}

function onKey(e: KeyboardEvent) {
  if (e.key === 'Enter') calc()
}

const helpItems = [
  { cat:'Básico',       items:['+ - * / ^', 'sqrt(x)', 'abs(x)', 'mod(a,b)', 'floor(x)', 'ceil(x)', 'round(x)', 'sign(x)'] },
  { cat:'Trig',         items:['sin(x)', 'cos(x)', 'tan(x)', 'asin(x)', 'acos(x)', 'atan(x)', 'atan2(y,x)', 'deg (=π/180)'] },
  { cat:'Log / Exp',   items:['log(x)', 'log(x,b)', 'log2(x)', 'log10(x)', 'exp(x)', 'e', 'pi', 'phi'] },
  { cat:'Estatística', items:['mean(a,b,...)', 'median(a,b,...)', 'std(a,b,...)', 'variance(a,b,...)', 'sum(a,b,...)', 'prod(a,b,...)'] },
  { cat:'Combinatória',items:['factorial(n)', 'combinations(n,k)', 'permutations(n,k)'] },
  { cat:'Unidades',    items:['2 km to m', '1 hour to min', '100 kg to g', '30 degC to degF'] },
  { cat:'Matrizes',    items:['[1,2;3,4]', 'det([1,2;3,4])', 'inv([1,0;0,1])', 'transpose([1,2;3,4])'] },
  { cat:'Exemplos',    items:['sin(pi/2)', '2^32', 'sqrt(2)', '1+2+3+4+5', '100! / (50! * 50!)', '2 km to m'] },
]

const copied = ref('')
async function copy(text: string, key: string) {
  await navigator.clipboard.writeText(text)
  copied.value = key; setTimeout(() => copied.value = '', 1500)
}
</script>

<template>
  <div class="tool-layout">
    <div>
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.25rem">
        <label class="tool-label" style="margin:0">Expressão</label>
        <button class="copy-btn" @click="showHelp = !showHelp" :style="{ color: showHelp ? 'var(--amber)' : undefined }">
          ℹ ajuda
        </button>
      </div>
      <div style="display:flex;gap:0.5rem">
        <input v-model="expr" class="tool-input" placeholder="ex: sin(pi/4) * sqrt(2)" @keydown="onKey" style="flex:1" />
        <button class="tool-btn" @click="calc">=</button>
      </div>
    </div>

    <div v-if="result" style="padding:1rem;background:var(--bg);border:1px solid var(--amber);border-radius:8px;display:flex;align-items:center;justify-content:space-between">
      <span style="font-family:var(--mono);font-size:1.5rem;color:var(--amber);font-weight:700">= {{ result }}</span>
      <button class="copy-btn" :class="{ copied: copied==='r' }" @click="copy(result,'r')">{{ copied==='r'?'✓':'copiar' }}</button>
    </div>
    <div v-if="error" class="tool-output" style="color:var(--red)">{{ error }}</div>

    <!-- Help panel -->
    <div v-if="showHelp" style="background:var(--bg);border:1px solid var(--line);border-radius:8px;padding:0.75rem;display:flex;flex-direction:column;gap:0.75rem">
      <div v-for="group in helpItems" :key="group.cat">
        <div style="font-size:0.68rem;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:var(--amber);margin-bottom:0.4rem">{{ group.cat }}</div>
        <div style="display:flex;flex-wrap:wrap;gap:0.3rem">
          <button v-for="fn in group.items" :key="fn"
            class="copy-btn"
            @click="expr = fn; showHelp = false"
            style="font-family:var(--mono);font-size:0.73rem">{{ fn }}</button>
        </div>
      </div>
    </div>

    <!-- History -->
    <div v-if="history.length">
      <label class="tool-label">Histórico</label>
      <div style="display:flex;flex-direction:column;gap:0.3rem;max-height:200px;overflow-y:auto">
        <div v-for="(h, i) in history" :key="i"
          class="result-row" style="cursor:pointer"
          @click="useHistory(h)">
          <span class="result-label" style="font-family:var(--mono)">{{ h.expr }}</span>
          <div class="row-actions">
            <span class="result-value">{{ h.result }}</span>
            <button class="copy-btn" :class="{ copied: copied===h.expr }" @click.stop="copy(h.result, h.expr)">
              {{ copied===h.expr ? '✓' : 'copiar' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
