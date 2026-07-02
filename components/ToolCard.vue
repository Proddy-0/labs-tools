<script setup lang="ts">
import type { Tool } from '~/composables/useTools'
defineProps<{ tool: Tool; pinned: boolean }>()
const emit = defineEmits<{ open: []; togglePin: [] }>()
</script>

<template>
  <div class="tool-card" @click="emit('open')">
    <button
      class="pin-btn" :class="{ pinned }"
      title="Fixar nos favoritos"
      @click.stop="emit('togglePin')"
    >{{ pinned ? '📌' : '📍' }}</button>
    <div class="tool-icon">{{ tool.icon }}</div>
    <div class="tool-name">{{ tool.name }}</div>
    <div class="tool-desc">{{ tool.desc }}</div>
    <div class="tool-tags">
      <span v-for="tag in tool.tags" :key="tag" class="tool-tag">{{ tag }}</span>
    </div>
  </div>
</template>
