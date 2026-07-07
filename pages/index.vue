<script setup lang="ts">
import { TOOLS, ALL_TAGS, type Tool } from '~/composables/useTools'

const { pins, isPinned, toggle } = usePins()

const query      = ref('')
const activeTag  = ref('all')
const activeTool = ref<Tool | null>(null)
const startOpen  = ref(false)

const filtered = computed(() => {
  let list = TOOLS
  if (activeTag.value !== 'all') list = list.filter(t => t.tags.includes(activeTag.value))
  if (query.value.trim()) {
    const q = query.value.toLowerCase()
    list = list.filter(t =>
      t.name.toLowerCase().includes(q) ||
      t.desc.toLowerCase().includes(q) ||
      t.tags.some(g => g.includes(q))
    )
  }
  return list
})

const tagCount = (tag: string) =>
  tag === 'all' ? TOOLS.length : TOOLS.filter(t => t.tags.includes(tag)).length

const pinnedTools = computed(() => pins.value.map(id => TOOLS.find(t => t.id === id)).filter(Boolean) as Tool[])

function openTool(tool: Tool) {
  activeTool.value = tool
  startOpen.value = false
}

function handleEsc(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    if (activeTool.value) activeTool.value = null
    else if (startOpen.value) startOpen.value = false
  }
}
onMounted(() => window.addEventListener('keydown', handleEsc))
onUnmounted(() => window.removeEventListener('keydown', handleEsc))
</script>

<template>
  <div class="wrap">

    <a href="https://craft.proddyt.site" class="craft-back">← craft</a>

    <header>
      <div class="header-left">
        <p class="kicker">proddyt labs</p>
        <h1>Tools<span class="dot">.</span></h1>
        <p class="sub">{{ TOOLS.length }} ferramentas · {{ pins.length }} fixadas</p>
      </div>
      <div class="header-actions">
        <a href="https://proddyt.site" target="_blank" rel="noopener" class="hbtn">home ↗</a>
        <button class="hbtn" :class="{ 'hbtn-active': startOpen }" @click="startOpen = !startOpen" title="Favoritos">
          ⊞ favoritos
        </button>
      </div>
    </header>

    <!-- Search -->
    <div class="search-wrap">
      <span class="search-icon">🔍</span>
      <input
        v-model="query"
        class="search-input"
        placeholder="Buscar ferramenta…"
        autofocus
      />
    </div>

    <!-- Tags -->
    <div class="filters">
      <button class="filter" :class="{ active: activeTag === 'all' }" @click="activeTag = 'all'">
        todas <span class="fn">{{ TOOLS.length }}</span>
      </button>
      <button
        v-for="tag in ALL_TAGS" :key="tag"
        class="filter" :class="{ active: activeTag === tag }"
        @click="activeTag = tag"
      >
        {{ tag }} <span class="fn">{{ tagCount(tag) }}</span>
      </button>
    </div>

    <!-- Grid -->
    <div v-if="filtered.length" class="tool-grid">
      <ToolCard
        v-for="tool in filtered"
        :key="tool.id"
        :tool="tool"
        :pinned="isPinned(tool.id)"
        @open="openTool(tool)"
        @toggle-pin="toggle(tool.id)"
      />
    </div>
    <div v-else class="no-results">
      <span class="no-results-icon">🔍</span>
      Nenhuma ferramenta para <strong>{{ query }}</strong>
    </div>

    <footer>proddyt tools — {{ TOOLS.length }} ferramentas</footer>

    <!-- Modal -->
    <Transition name="fade">
      <ToolModal
        v-if="activeTool"
        :tool="activeTool"
        :pinned="isPinned(activeTool.id)"
        @close="activeTool = null"
        @toggle-pin="toggle(activeTool!.id)"
      />
    </Transition>

    <!-- Start Menu -->
    <template v-if="startOpen">
      <div class="start-overlay" @click="startOpen = false" />
      <StartMenu :tools="pinnedTools" @open="openTool" @unpin="toggle" @close="startOpen = false" />
    </template>

  </div>
</template>
