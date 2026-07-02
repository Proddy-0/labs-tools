<script setup lang="ts">
import type { Tool } from '~/composables/useTools'
defineProps<{ tools: Tool[] }>()
const emit = defineEmits<{ open: [Tool]; unpin: [string]; close: [] }>()
</script>

<template>
  <div class="start-menu">
    <div class="start-header">
      <span class="start-title">⊞ Favoritos</span>
      <button class="start-close" @click="emit('close')">✕</button>
    </div>
    <div class="start-list">
      <div v-if="!tools.length" class="start-empty">
        Nenhuma ferramenta fixada.<br>
        Clique em 📍 em qualquer ferramenta para adicionar aqui.
      </div>
      <div
        v-for="tool in tools"
        :key="tool.id"
        class="start-item"
        @click="emit('open', tool)"
      >
        <span class="start-item-icon">{{ tool.icon }}</span>
        <span class="start-item-name">{{ tool.name }}</span>
        <button class="start-unpin" title="Remover dos favoritos" @click.stop="emit('unpin', tool.id)">✕</button>
      </div>
    </div>
  </div>
</template>
