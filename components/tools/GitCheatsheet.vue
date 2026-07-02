<script setup lang="ts">
const q = ref('')
const sections = [
  { title: 'Setup', items: [
    { cmd: 'git config --global user.name "Nome"',       desc: 'Define nome de usuário' },
    { cmd: 'git config --global user.email "email"',     desc: 'Define email' },
    { cmd: 'git config --list',                          desc: 'Lista configurações' },
    { cmd: 'git init',                                   desc: 'Inicializa repositório' },
    { cmd: 'git clone <url>',                            desc: 'Clona repositório remoto' },
  ]},
  { title: 'Básico', items: [
    { cmd: 'git status',                                 desc: 'Status do working tree' },
    { cmd: 'git add <arquivo>',                          desc: 'Adiciona arquivo ao stage' },
    { cmd: 'git add .',                                  desc: 'Adiciona tudo ao stage' },
    { cmd: 'git commit -m "mensagem"',                   desc: 'Cria commit' },
    { cmd: 'git commit --amend',                         desc: 'Altera último commit' },
    { cmd: 'git diff',                                   desc: 'Diferenças não staged' },
    { cmd: 'git diff --staged',                          desc: 'Diferenças staged' },
    { cmd: 'git log --oneline',                          desc: 'Log resumido' },
    { cmd: 'git log --graph --all --oneline',            desc: 'Log visual com branches' },
  ]},
  { title: 'Branch', items: [
    { cmd: 'git branch',                                 desc: 'Lista branches locais' },
    { cmd: 'git branch <nome>',                          desc: 'Cria branch' },
    { cmd: 'git checkout <branch>',                      desc: 'Muda de branch' },
    { cmd: 'git checkout -b <branch>',                   desc: 'Cria e muda para branch' },
    { cmd: 'git switch -c <branch>',                     desc: 'Cria e muda (moderno)' },
    { cmd: 'git branch -d <branch>',                     desc: 'Remove branch (seguro)' },
    { cmd: 'git branch -D <branch>',                     desc: 'Remove branch (forçado)' },
    { cmd: 'git merge <branch>',                         desc: 'Merge de branch' },
    { cmd: 'git rebase <branch>',                        desc: 'Rebase em branch' },
  ]},
  { title: 'Remoto', items: [
    { cmd: 'git remote -v',                              desc: 'Lista remotos' },
    { cmd: 'git remote add origin <url>',                desc: 'Adiciona remoto' },
    { cmd: 'git push origin <branch>',                   desc: 'Envia para remoto' },
    { cmd: 'git push -u origin <branch>',                desc: 'Envia e define upstream' },
    { cmd: 'git pull',                                   desc: 'Busca e merge do remoto' },
    { cmd: 'git fetch',                                  desc: 'Busca sem merge' },
    { cmd: 'git fetch --prune',                          desc: 'Busca e limpa branches remotos' },
  ]},
  { title: 'Desfazer', items: [
    { cmd: 'git restore <arquivo>',                      desc: 'Descarta mudanças no arquivo' },
    { cmd: 'git restore --staged <arquivo>',             desc: 'Remove do stage' },
    { cmd: 'git reset HEAD~1',                           desc: 'Desfaz último commit (mantém mudanças)' },
    { cmd: 'git reset --hard HEAD~1',                    desc: 'Desfaz commit e mudanças' },
    { cmd: 'git revert <hash>',                          desc: 'Cria commit que desfaz outro' },
    { cmd: 'git stash',                                  desc: 'Guarda mudanças temporariamente' },
    { cmd: 'git stash pop',                              desc: 'Recupera mudanças guardadas' },
    { cmd: 'git stash list',                             desc: 'Lista stashes' },
  ]},
  { title: 'Tags', items: [
    { cmd: 'git tag',                                    desc: 'Lista tags' },
    { cmd: 'git tag v1.0.0',                             desc: 'Cria tag leve' },
    { cmd: 'git tag -a v1.0.0 -m "release"',             desc: 'Cria tag anotada' },
    { cmd: 'git push origin --tags',                     desc: 'Envia todas as tags' },
    { cmd: 'git tag -d v1.0.0',                          desc: 'Remove tag local' },
  ]},
  { title: 'Avançado', items: [
    { cmd: 'git cherry-pick <hash>',                     desc: 'Aplica commit específico' },
    { cmd: 'git bisect start',                           desc: 'Inicia busca binária de bug' },
    { cmd: 'git blame <arquivo>',                        desc: 'Autoria linha por linha' },
    { cmd: 'git shortlog -sn',                           desc: 'Contagem de commits por autor' },
    { cmd: 'git clean -fd',                              desc: 'Remove arquivos não rastreados' },
    { cmd: 'git submodule add <url>',                    desc: 'Adiciona submódulo' },
    { cmd: 'git worktree add <dir> <branch>',            desc: 'Working tree adicional' },
  ]},
]

const filtered = computed(() => {
  if (!q.value) return sections
  const lq = q.value.toLowerCase()
  return sections.map(s => ({
    ...s,
    items: s.items.filter(i => i.cmd.toLowerCase().includes(lq) || i.desc.toLowerCase().includes(lq))
  })).filter(s => s.items.length)
})

const copied = ref('')
async function copy(cmd: string) {
  await navigator.clipboard.writeText(cmd)
  copied.value = cmd; setTimeout(() => copied.value = '', 1500)
}
</script>

<template>
  <div class="tool-layout">
    <div class="search-wrap" style="margin-bottom:0">
      <span class="search-icon">🔍</span>
      <input v-model="q" class="search-input" placeholder="Buscar comando…" />
    </div>

    <div style="display:flex;flex-direction:column;gap:1.25rem;max-height:440px;overflow-y:auto">
      <div v-for="sec in filtered" :key="sec.title">
        <div style="font-size:0.7rem;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:var(--amber);margin-bottom:0.5rem">{{ sec.title }}</div>
        <div style="display:flex;flex-direction:column;gap:0.3rem">
          <div v-for="item in sec.items" :key="item.cmd"
            style="display:flex;align-items:center;gap:0.75rem;padding:0.4rem 0.6rem;background:var(--bg);border:1px solid var(--line);border-radius:6px;cursor:pointer;transition:border-color .1s"
            @click="copy(item.cmd)"
            :style="{ borderColor: copied===item.cmd ? 'var(--green)' : undefined }"
          >
            <code style="flex:1;font-size:0.78rem;color:var(--text)">{{ item.cmd }}</code>
            <span style="font-size:0.72rem;color:var(--muted);text-align:right;max-width:200px">{{ item.desc }}</span>
            <span style="font-size:0.7rem;color:var(--green);width:16px;text-align:center">{{ copied===item.cmd ? '✓' : '' }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
