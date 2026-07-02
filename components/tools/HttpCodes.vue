<script setup lang="ts">
const codes = [
  // 1xx
  { code:100, name:'Continue',                         desc:'O servidor recebeu os headers e o cliente deve continuar.' },
  { code:101, name:'Switching Protocols',               desc:'O servidor aceita o upgrade de protocolo solicitado.' },
  { code:102, name:'Processing',                        desc:'O servidor está processando a requisição, sem resposta ainda.' },
  { code:103, name:'Early Hints',                       desc:'Usado com link header para pré-carregar recursos.' },
  // 2xx
  { code:200, name:'OK',                                desc:'Requisição bem-sucedida.' },
  { code:201, name:'Created',                           desc:'Recurso criado com sucesso.' },
  { code:202, name:'Accepted',                          desc:'Requisição aceita mas ainda não processada.' },
  { code:203, name:'Non-Authoritative Information',     desc:'Informação modificada por proxy.' },
  { code:204, name:'No Content',                        desc:'Sucesso, sem conteúdo no body.' },
  { code:205, name:'Reset Content',                     desc:'Sucesso, cliente deve reiniciar a view.' },
  { code:206, name:'Partial Content',                   desc:'Resposta parcial (Range request).' },
  { code:207, name:'Multi-Status',                      desc:'Múltiplos status (WebDAV).' },
  { code:208, name:'Already Reported',                  desc:'Membros já enumerados (WebDAV).' },
  { code:226, name:'IM Used',                           desc:'Resposta é resultado de instance manipulations.' },
  // 3xx
  { code:301, name:'Moved Permanently',                 desc:'Recurso movido permanentemente para nova URL.' },
  { code:302, name:'Found',                             desc:'Redirecionamento temporário.' },
  { code:303, name:'See Other',                         desc:'Recurso em outra URL, usar GET.' },
  { code:304, name:'Not Modified',                      desc:'Cache ainda válido, sem body.' },
  { code:307, name:'Temporary Redirect',                desc:'Redirecionamento temporário, manter método.' },
  { code:308, name:'Permanent Redirect',                desc:'Redirecionamento permanente, manter método.' },
  // 4xx
  { code:400, name:'Bad Request',                       desc:'Requisição malformada ou parâmetros inválidos.' },
  { code:401, name:'Unauthorized',                      desc:'Autenticação necessária.' },
  { code:402, name:'Payment Required',                  desc:'Pagamento necessário (reservado).' },
  { code:403, name:'Forbidden',                         desc:'Servidor entende mas recusa a requisição.' },
  { code:404, name:'Not Found',                         desc:'Recurso não encontrado.' },
  { code:405, name:'Method Not Allowed',                desc:'Método HTTP não permitido para este recurso.' },
  { code:406, name:'Not Acceptable',                    desc:'Nenhum conteúdo aceito pelo cliente.' },
  { code:407, name:'Proxy Authentication Required',     desc:'Autenticação de proxy necessária.' },
  { code:408, name:'Request Timeout',                   desc:'Servidor expirou aguardando a requisição.' },
  { code:409, name:'Conflict',                          desc:'Conflito no estado atual do recurso.' },
  { code:410, name:'Gone',                              desc:'Recurso permanentemente removido.' },
  { code:411, name:'Length Required',                   desc:'Content-Length necessário.' },
  { code:412, name:'Precondition Failed',               desc:'Pré-condição dos headers falhou.' },
  { code:413, name:'Payload Too Large',                 desc:'Body maior que o servidor aceita.' },
  { code:414, name:'URI Too Long',                      desc:'URL muito longa.' },
  { code:415, name:'Unsupported Media Type',            desc:'Tipo de mídia não suportado.' },
  { code:416, name:'Range Not Satisfiable',             desc:'Range solicitado não disponível.' },
  { code:417, name:'Expectation Failed',                desc:'Header Expect não satisfeito.' },
  { code:418, name:"I'm a teapot",                      desc:'O servidor se recusa a fazer café em um bule de chá (RFC 2324).' },
  { code:421, name:'Misdirected Request',               desc:'Requisição direcionada ao servidor errado.' },
  { code:422, name:'Unprocessable Entity',              desc:'Corpo bem formado mas semanticamente errado.' },
  { code:423, name:'Locked',                            desc:'Recurso bloqueado.' },
  { code:424, name:'Failed Dependency',                 desc:'Falha em dependência de outra requisição.' },
  { code:425, name:'Too Early',                         desc:'Servidor não processa requests replayed.' },
  { code:426, name:'Upgrade Required',                  desc:'Cliente deve fazer upgrade de protocolo.' },
  { code:428, name:'Precondition Required',             desc:'Servidor requer request condicional.' },
  { code:429, name:'Too Many Requests',                 desc:'Rate limit atingido.' },
  { code:431, name:'Request Header Fields Too Large',   desc:'Headers muito grandes.' },
  { code:451, name:'Unavailable For Legal Reasons',     desc:'Conteúdo bloqueado por razões legais.' },
  // 5xx
  { code:500, name:'Internal Server Error',             desc:'Erro genérico do servidor.' },
  { code:501, name:'Not Implemented',                   desc:'Método não implementado.' },
  { code:502, name:'Bad Gateway',                       desc:'Gateway recebeu resposta inválida do upstream.' },
  { code:503, name:'Service Unavailable',               desc:'Serviço indisponível (sobrecarga ou manutenção).' },
  { code:504, name:'Gateway Timeout',                   desc:'Gateway não recebeu resposta do upstream a tempo.' },
  { code:505, name:'HTTP Version Not Supported',        desc:'Versão HTTP não suportada.' },
  { code:506, name:'Variant Also Negotiates',           desc:'Erro de negociação de conteúdo circular.' },
  { code:507, name:'Insufficient Storage',              desc:'Sem espaço para completar a requisição.' },
  { code:508, name:'Loop Detected',                     desc:'Loop infinito detectado (WebDAV).' },
  { code:510, name:'Not Extended',                      desc:'Extensões adicionais necessárias.' },
  { code:511, name:'Network Authentication Required',   desc:'Autenticação de rede necessária.' },
]

const q = ref('')
const filtered = computed(() => {
  if (!q.value) return codes
  const lq = q.value.toLowerCase()
  return codes.filter(c => String(c.code).includes(lq) || c.name.toLowerCase().includes(lq) || c.desc.toLowerCase().includes(lq))
})

function colorFor(code: number): string {
  if (code < 200) return 'var(--blue)'
  if (code < 300) return 'var(--green)'
  if (code < 400) return 'var(--amber)'
  if (code < 500) return 'var(--red)'
  return '#c084fc'
}
</script>

<template>
  <div class="tool-layout">
    <div class="search-wrap" style="margin-bottom:0">
      <span class="search-icon">🔍</span>
      <input v-model="q" class="search-input" placeholder="Buscar código, nome ou descrição…" />
    </div>

    <div style="font-size:0.75rem;color:var(--muted)">{{ filtered.length }} códigos</div>

    <div style="display:flex;flex-direction:column;gap:0.4rem;max-height:360px;overflow-y:auto">
      <div v-for="c in filtered" :key="c.code"
        style="display:flex;align-items:flex-start;gap:0.75rem;padding:0.5rem 0.75rem;background:var(--bg);border:1px solid var(--line);border-radius:6px">
        <span style="font-family:var(--mono);font-weight:700;font-size:0.9rem;flex-shrink:0" :style="{color:colorFor(c.code)}">{{ c.code }}</span>
        <div style="flex:1;min-width:0">
          <div style="font-size:0.85rem;font-weight:600;color:var(--text)">{{ c.name }}</div>
          <div style="font-size:0.75rem;color:var(--muted);margin-top:0.1rem">{{ c.desc }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
