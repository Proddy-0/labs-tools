<script setup lang="ts">
import type { Tool } from '~/composables/useTools'

const props  = defineProps<{ tool: Tool; pinned: boolean }>()
const emit   = defineEmits<{ close: []; togglePin: [] }>()

const toolMap: Record<string, ReturnType<typeof defineAsyncComponent>> = {
  BaseConverter:     defineAsyncComponent(() => import('~/components/tools/BaseConverter.vue')),
  ColorConverter:    defineAsyncComponent(() => import('~/components/tools/ColorConverter.vue')),
  CaseConverter:     defineAsyncComponent(() => import('~/components/tools/CaseConverter.vue')),
  DataConverter:     defineAsyncComponent(() => import('~/components/tools/DataConverter.vue')),
  ListConverter:     defineAsyncComponent(() => import('~/components/tools/ListConverter.vue')),
  MarkdownHtml:      defineAsyncComponent(() => import('~/components/tools/MarkdownHtml.vue')),
  UrlParser:         defineAsyncComponent(() => import('~/components/tools/UrlParser.vue')),
  DeviceInfo:        defineAsyncComponent(() => import('~/components/tools/DeviceInfo.vue')),
  OtpGenerator:      defineAsyncComponent(() => import('~/components/tools/OtpGenerator.vue')),
  JwtParser:         defineAsyncComponent(() => import('~/components/tools/JwtParser.vue')),
  KeycodeInfo:       defineAsyncComponent(() => import('~/components/tools/KeycodeInfo.vue')),
  HtmlWysiwyg:       defineAsyncComponent(() => import('~/components/tools/HtmlWysiwyg.vue')),
  HttpCodes:         defineAsyncComponent(() => import('~/components/tools/HttpCodes.vue')),
  QrGenerator:       defineAsyncComponent(() => import('~/components/tools/QrGenerator.vue')),
  GitCheatsheet:     defineAsyncComponent(() => import('~/components/tools/GitCheatsheet.vue')),
  PortGenerator:     defineAsyncComponent(() => import('~/components/tools/PortGenerator.vue')),
  JsonFormatter:     defineAsyncComponent(() => import('~/components/tools/JsonFormatter.vue')),
  SqlFormatter:      defineAsyncComponent(() => import('~/components/tools/SqlFormatter.vue')),
  XmlFormatter:      defineAsyncComponent(() => import('~/components/tools/XmlFormatter.vue')),
  MathEvaluator:     defineAsyncComponent(() => import('~/components/tools/MathEvaluator.vue')),
  EtaCalculator:     defineAsyncComponent(() => import('~/components/tools/EtaCalculator.vue')),
  Chronometer:       defineAsyncComponent(() => import('~/components/tools/Chronometer.vue')),
  TempConverter:     defineAsyncComponent(() => import('~/components/tools/TempConverter.vue')),
  LoremIpsum:        defineAsyncComponent(() => import('~/components/tools/LoremIpsum.vue')),
  TextStats:         defineAsyncComponent(() => import('~/components/tools/TextStats.vue')),
  EmojiPicker:       defineAsyncComponent(() => import('~/components/tools/EmojiPicker.vue')),
  StringObfuscator:  defineAsyncComponent(() => import('~/components/tools/StringObfuscator.vue')),
  PhoneFormatter:    defineAsyncComponent(() => import('~/components/tools/PhoneFormatter.vue')),
  CpfCnpjGenerator: defineAsyncComponent(() => import('~/components/tools/CpfCnpjGenerator.vue')),
  PasswordGenerator: defineAsyncComponent(() => import('~/components/tools/PasswordGenerator.vue')),
  FakeDataGenerator: defineAsyncComponent(() => import('~/components/tools/FakeDataGenerator.vue')),
  TokenGenerator:    defineAsyncComponent(() => import('~/components/tools/TokenGenerator.vue')),
}

const component = computed(() => toolMap[props.tool.component])
</script>

<template>
  <div class="modal-backdrop" @click.self="emit('close')">
    <div class="modal-box">
      <div class="modal-header">
        <span class="modal-icon">{{ tool.icon }}</span>
        <span class="modal-title">{{ tool.name }}</span>
        <button class="modal-pin" :class="{ pinned }" @click="emit('togglePin')">
          {{ pinned ? '📌 fixado' : '📍 fixar' }}
        </button>
        <button class="modal-close" @click="emit('close')" title="Fechar (Esc)">✕</button>
      </div>
      <div class="modal-body">
        <Suspense>
          <component :is="component" v-if="component" />
          <template #fallback>
            <div class="small" style="text-align:center;padding:2rem">Carregando…</div>
          </template>
        </Suspense>
      </div>
    </div>
  </div>
</template>
