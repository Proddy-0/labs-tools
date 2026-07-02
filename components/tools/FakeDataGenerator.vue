<script setup lang="ts">
const PRIMEIROS_M = ['Lucas','Gabriel','Matheus','Rafael','Felipe','Guilherme','Pedro','Thiago','Bruno','Eduardo','Rodrigo','Daniel','Marcelo','Paulo','Carlos','Leonardo','André','Diego','Fernando','Henrique']
const PRIMEIROS_F = ['Ana','Julia','Mariana','Larissa','Fernanda','Camila','Beatriz','Leticia','Gabriela','Isabela','Amanda','Bruna','Patricia','Carolina','Renata','Priscila','Tatiane','Vanessa','Monica','Sandra']
const SOBRENOMES  = ['Silva','Santos','Oliveira','Souza','Rodrigues','Ferreira','Alves','Pereira','Lima','Gomes','Costa','Ribeiro','Carvalho','Almeida','Lopes','Sousa','Martins','Araújo','Barbosa','Nascimento','Cardoso','Melo','Dias','Correia','Nunes','Mendes','Freitas','Castro','Teixeira','Monteiro']
const DOMINIOS    = ['gmail.com','outlook.com','hotmail.com','yahoo.com.br','proton.me','icloud.com']
const ESTADOS     = ['SP','RJ','MG','RS','BA','PR','PE','CE','SC','GO','AM','PA','MT','MS','RN','AL','PI','PB','TO','MA','ES','SE','AC','RO','AP','RR','DF']
const CIDADES_SP  = ['São Paulo','Campinas','Santos','São Bernardo do Campo','Osasco','São José dos Campos','Ribeirão Preto','Sorocaba','Mauá','São José do Rio Preto']
const RUAS        = ['Rua das Flores','Av. Paulista','Rua Sete de Setembro','Av. Brasil','Rua da Liberdade','Av. Atlântica','Rua XV de Novembro','Av. Getúlio Vargas','Rua Ipiranga','Av. São João']

function pick<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)] }
function rnd(min: number, max: number): number { return Math.floor(Math.random() * (max - min + 1)) + min }

function genCpf(): string {
  const n = Array.from({ length: 9 }, () => rnd(0, 9))
  let s1 = n.reduce((s,v,i) => s+v*(10-i), 0) % 11; const d1 = s1 < 2 ? 0 : 11-s1; n.push(d1)
  let s2 = n.reduce((s,v,i) => s+v*(11-i), 0) % 11; const d2 = s2 < 2 ? 0 : 11-s2; n.push(d2)
  return n.join('').replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
}

function genPhone(): string {
  const ddd = pick(['11','21','31','41','51','61','71','81','85','91'])
  const num  = `9${rnd(1000,9999)}${rnd(1000,9999)}`
  return `(${ddd}) ${num.slice(0,5)}-${num.slice(5)}`
}

function genEmail(nome: string): string {
  const clean = nome.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/\s+/g,'.')
  const suffix = rnd(1,99)
  return `${clean}${rnd(0,1)?suffix:''}@${pick(DOMINIOS)}`
}

function genBirthdate(): string {
  const d = new Date(rnd(1970, 2005), rnd(0,11), rnd(1,28))
  return d.toLocaleDateString('pt-BR')
}

function genAddress(): string {
  return `${pick(RUAS)}, ${rnd(1,9999)} - ${pick(CIDADES_SP)}/${pick(ESTADOS)}`
}

function genCep(): string {
  return `${rnd(10000,99999)}-${String(rnd(0,999)).padStart(3,'0')}`
}

interface Record_ { name: string; email: string; cpf: string; phone: string; birth: string; address: string; cep: string }

const qty     = ref(5)
const records = ref<Record_[]>([])
const copied  = ref(false)

function generate() {
  records.value = Array.from({ length: qty.value }, () => {
    const isFem = Math.random() > 0.5
    const first = pick(isFem ? PRIMEIROS_F : PRIMEIROS_M)
    const last  = `${pick(SOBRENOMES)} ${pick(SOBRENOMES)}`
    const name  = `${first} ${last}`
    return {
      name, email: genEmail(name), cpf: genCpf(),
      phone: genPhone(), birth: genBirthdate(),
      address: genAddress(), cep: genCep(),
    }
  })
}

function toJson(): string { return JSON.stringify(records.value, null, 2) }
function toCsv(): string {
  const h = 'Nome,Email,CPF,Telefone,Nascimento,Endereço,CEP'
  const rows = records.value.map(r => `"${r.name}","${r.email}","${r.cpf}","${r.phone}","${r.birth}","${r.address}","${r.cep}"`)
  return [h, ...rows].join('\n')
}

const exportFmt = ref<'table'|'json'|'csv'>('table')

async function copy() {
  const text = exportFmt.value === 'json' ? toJson() : exportFmt.value === 'csv' ? toCsv() : records.value.map(r => Object.values(r).join(' | ')).join('\n')
  await navigator.clipboard.writeText(text)
  copied.value = true; setTimeout(() => copied.value = false, 1500)
}

onMounted(generate)
</script>

<template>
  <div class="tool-layout">
    <div class="tool-row" style="align-items:flex-end">
      <div style="display:flex;align-items:center;gap:0.5rem">
        <label class="tool-label" style="margin:0;margin-right:0.5rem">Quantidade</label>
        <input v-model.number="qty" type="number" min="1" max="50" class="tool-input" style="width:80px" />
      </div>
      <button class="tool-btn" @click="generate">Gerar</button>
      <div style="flex:1" />
      <div style="display:flex;gap:0.3rem">
        <button v-for="f in [['table','Tabela'],['json','JSON'],['csv','CSV']] as [string,string][]" :key="f[0]"
          class="tool-btn" :class="{ secondary: exportFmt !== f[0] }" style="padding:0.3rem 0.65rem;font-size:0.78rem"
          @click="exportFmt = f[0] as any">{{ f[1] }}</button>
      </div>
      <button class="copy-btn" :class="{ copied }" @click="copy">{{ copied ? '✓' : 'copiar' }}</button>
    </div>

    <!-- Table view -->
    <div v-if="exportFmt === 'table'" style="overflow-x:auto;max-height:360px;overflow-y:auto">
      <table style="width:100%;border-collapse:collapse;font-size:0.78rem">
        <thead>
          <tr style="background:var(--bg);position:sticky;top:0">
            <th v-for="h in ['Nome','Email','CPF','Telefone','Nascimento','Endereço']" :key="h"
              style="text-align:left;padding:0.4rem 0.75rem;border-bottom:1px solid var(--line);color:var(--muted);font-weight:600;text-transform:uppercase;letter-spacing:0.06em;font-size:0.68rem;white-space:nowrap">
              {{ h }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="r in records" :key="r.cpf" style="border-bottom:1px solid var(--line)">
            <td style="padding:0.4rem 0.75rem;color:var(--text)">{{ r.name }}</td>
            <td style="padding:0.4rem 0.75rem;color:var(--muted)">{{ r.email }}</td>
            <td style="padding:0.4rem 0.75rem;font-family:var(--mono)">{{ r.cpf }}</td>
            <td style="padding:0.4rem 0.75rem;font-family:var(--mono)">{{ r.phone }}</td>
            <td style="padding:0.4rem 0.75rem">{{ r.birth }}</td>
            <td style="padding:0.4rem 0.75rem;color:var(--muted);font-size:0.73rem">{{ r.address }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- JSON / CSV view -->
    <textarea v-else :value="exportFmt === 'json' ? toJson() : toCsv()" class="tool-ta" rows="14" readonly />
  </div>
</template>
