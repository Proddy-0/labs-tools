<script setup lang="ts">
// ── Stopwatch ──────────────────────────────────────────────────
const swMs      = ref(0)
const swRunning = ref(false)
const swLaps    = ref<number[]>([])
let swTimer: ReturnType<typeof setInterval>
let swStart = 0

function swToggle() {
  if (swRunning.value) {
    clearInterval(swTimer)
    swRunning.value = false
  } else {
    swStart = Date.now() - swMs.value
    swTimer = setInterval(() => { swMs.value = Date.now() - swStart }, 10)
    swRunning.value = true
  }
}
function swReset() {
  clearInterval(swTimer)
  swRunning.value = false
  swMs.value = 0
  swLaps.value = []
}
function swLap() {
  if (swRunning.value) swLaps.value = [...swLaps.value, swMs.value]
}

// ── Timer ──────────────────────────────────────────────────────
const tmH       = ref(0)
const tmM       = ref(0)
const tmS       = ref(10)
const tmMs      = ref(0)
const tmRunning = ref(false)
const tmDone    = ref(false)
let tmTimer: ReturnType<typeof setInterval>

function tmStart() {
  const total = (tmH.value * 3600 + tmM.value * 60 + tmS.value) * 1000
  if (!tmMs.value) tmMs.value = total
  if (!tmMs.value) return
  tmDone.value = false
  const end = Date.now() + tmMs.value
  tmTimer = setInterval(() => {
    tmMs.value = Math.max(0, end - Date.now())
    if (tmMs.value === 0) { clearInterval(tmTimer); tmRunning.value = false; tmDone.value = true }
  }, 50)
  tmRunning.value = true
}
function tmPause() {
  clearInterval(tmTimer)
  tmRunning.value = false
}
function tmReset() {
  clearInterval(tmTimer)
  tmRunning.value = false
  tmDone.value = false
  tmMs.value = 0
}

function fmt(ms: number) {
  const h = Math.floor(ms / 3600000)
  const m = Math.floor((ms % 3600000) / 60000)
  const s = Math.floor((ms % 60000) / 1000)
  const cs= Math.floor((ms % 1000) / 10)
  return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}.${String(cs).padStart(2,'0')}`
}
function fmtLap(ms: number) { return fmt(ms) }

onUnmounted(() => { clearInterval(swTimer); clearInterval(tmTimer) })
</script>

<template>
  <div class="tool-layout">
    <div class="tool-row" style="gap:1.5rem;align-items:flex-start">

      <!-- Stopwatch -->
      <div class="tool-col" style="text-align:center">
        <div style="font-size:0.7rem;font-weight:700;text-transform:uppercase;letter-spacing:0.12em;color:var(--amber);margin-bottom:1rem">Cronômetro</div>
        <div style="font-size:3rem;font-family:var(--mono);font-weight:700;color:var(--text);margin-bottom:1rem;letter-spacing:0.05em">{{ fmt(swMs) }}</div>
        <div style="display:flex;justify-content:center;gap:0.5rem;margin-bottom:1rem">
          <button class="tool-btn" @click="swToggle">{{ swRunning ? '⏸ Pausar' : '▶ Iniciar' }}</button>
          <button class="tool-btn secondary" @click="swLap" :disabled="!swRunning">Lap</button>
          <button class="tool-btn secondary" @click="swReset">Reset</button>
        </div>
        <div v-if="swLaps.length" style="text-align:left;max-height:180px;overflow-y:auto">
          <div v-for="(lap, i) in swLaps" :key="i"
            style="display:flex;justify-content:space-between;padding:0.3rem 0.5rem;border-bottom:1px solid var(--line);font-family:var(--mono);font-size:0.8rem">
            <span style="color:var(--muted)">Lap {{ i+1 }}</span>
            <span>{{ fmtLap(lap) }}</span>
            <span style="color:var(--muted)">{{ i > 0 ? '+' + fmtLap(lap - swLaps[i-1]) : '+' + fmtLap(lap) }}</span>
          </div>
        </div>
      </div>

      <div style="width:1px;background:var(--line);align-self:stretch" />

      <!-- Timer -->
      <div class="tool-col" style="text-align:center">
        <div style="font-size:0.7rem;font-weight:700;text-transform:uppercase;letter-spacing:0.12em;color:var(--amber);margin-bottom:1rem">Temporizador</div>

        <div v-if="!tmRunning && !tmMs" style="display:flex;justify-content:center;gap:0.5rem;margin-bottom:1rem">
          <div style="display:flex;flex-direction:column;align-items:center;gap:0.25rem">
            <label class="tool-label">h</label>
            <input v-model.number="tmH" type="number" min="0" max="99" class="tool-input" style="width:60px;text-align:center" />
          </div>
          <div style="display:flex;flex-direction:column;align-items:center;gap:0.25rem">
            <label class="tool-label">min</label>
            <input v-model.number="tmM" type="number" min="0" max="59" class="tool-input" style="width:60px;text-align:center" />
          </div>
          <div style="display:flex;flex-direction:column;align-items:center;gap:0.25rem">
            <label class="tool-label">s</label>
            <input v-model.number="tmS" type="number" min="0" max="59" class="tool-input" style="width:60px;text-align:center" />
          </div>
        </div>

        <div
          style="font-size:3rem;font-family:var(--mono);font-weight:700;margin-bottom:1rem;letter-spacing:0.05em"
          :style="{ color: tmDone ? 'var(--green)' : tmMs < 10000 && tmMs > 0 ? 'var(--red)' : 'var(--text)' }"
        >{{ fmt(tmMs) }}</div>

        <div v-if="tmDone" style="color:var(--green);font-weight:600;margin-bottom:0.75rem">✓ Tempo esgotado!</div>

        <div style="display:flex;justify-content:center;gap:0.5rem">
          <button v-if="!tmRunning" class="tool-btn" @click="tmStart">▶ Iniciar</button>
          <button v-else class="tool-btn secondary" @click="tmPause">⏸ Pausar</button>
          <button class="tool-btn secondary" @click="tmReset">Reset</button>
        </div>
      </div>
    </div>
  </div>
</template>
