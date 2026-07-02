export interface Tool {
  id: string
  name: string
  icon: string
  desc: string
  tags: string[]
  component: string
}

export const TOOLS: Tool[] = [
  { id: 'base-converter',     name: 'Base Converter',       icon: '🔢', desc: 'Bin, Oct, Dec, Hex, Base64',           tags: ['conversor'],              component: 'BaseConverter' },
  { id: 'color-converter',    name: 'Color Converter',      icon: '🎨', desc: 'HEX, RGB, HSL, CMYK, HSV',             tags: ['conversor'],              component: 'ColorConverter' },
  { id: 'case-converter',     name: 'Case Converter',       icon: '🔡', desc: 'camelCase, snake, kebab, UPPER…',       tags: ['texto', 'conversor'],     component: 'CaseConverter' },
  { id: 'data-converter',     name: 'JSON / YAML / TOML',   icon: '🔄', desc: 'Converte entre formatos de dados',      tags: ['conversor', 'formato'],   component: 'DataConverter' },
  { id: 'list-converter',     name: 'List Converter',       icon: '📋', desc: 'CSV, bullets, numerado, JSON array…',   tags: ['conversor', 'texto'],     component: 'ListConverter' },
  { id: 'markdown-html',      name: 'Markdown → HTML',      icon: '📝', desc: 'Preview e conversão em tempo real',     tags: ['web', 'texto'],           component: 'MarkdownHtml' },
  { id: 'url-parser',         name: 'URL Parser',           icon: '🔗', desc: 'Decompõe, encode e decode URLs',        tags: ['web'],                    component: 'UrlParser' },
  { id: 'device-info',        name: 'Device Info',          icon: '💻', desc: 'OS, browser, tela, viewport',           tags: ['utilidade', 'web'],       component: 'DeviceInfo' },
  { id: 'otp-generator',      name: 'OTP Generator',        icon: '🔐', desc: 'TOTP com QR code e código ao vivo',     tags: ['gerador', 'segurança'],   component: 'OtpGenerator' },
  { id: 'jwt-parser',         name: 'JWT Parser',           icon: '🎟', desc: 'Decodifica header, payload e expiry',   tags: ['web', 'segurança'],       component: 'JwtParser' },
  { id: 'keycode-info',       name: 'Keycode Info',         icon: '⌨',  desc: 'KeyCode, code, key de qualquer tecla',  tags: ['web'],                    component: 'KeycodeInfo' },
  { id: 'html-wysiwyg',       name: 'HTML WYSIWYG',         icon: '🖊',  desc: 'Editor rico com saída HTML ao vivo',    tags: ['web', 'texto'],           component: 'HtmlWysiwyg' },
  { id: 'http-codes',         name: 'HTTP Status Codes',    icon: '🌐', desc: 'Referência de todos os códigos HTTP',   tags: ['web', 'referência'],      component: 'HttpCodes' },
  { id: 'qr-generator',       name: 'QR Code Generator',   icon: '📱', desc: 'Gera QR de qualquer texto ou URL',      tags: ['gerador', 'web'],         component: 'QrGenerator' },
  { id: 'git-cheatsheet',     name: 'Git Cheatsheet',       icon: '🗂', desc: 'Referência rápida de comandos git',     tags: ['referência'],             component: 'GitCheatsheet' },
  { id: 'port-generator',     name: 'Port Generator',       icon: '🔌', desc: 'Portas aleatórias com lista de exclusão', tags: ['gerador', 'utilidade'], component: 'PortGenerator' },
  { id: 'json-formatter',     name: 'JSON Formatter',       icon: '{}', desc: 'Prettify, minify e ordenar JSON',       tags: ['formato'],                component: 'JsonFormatter' },
  { id: 'sql-formatter',      name: 'SQL Formatter',        icon: '🗄', desc: 'Formata e indenta SQL',                 tags: ['formato'],                component: 'SqlFormatter' },
  { id: 'xml-formatter',      name: 'XML Formatter',        icon: '🏷', desc: 'Formata e valida XML',                  tags: ['formato'],                component: 'XmlFormatter' },
  { id: 'math-evaluator',     name: 'Math Evaluator',       icon: '🧮', desc: 'Expressões com funções avançadas',      tags: ['utilidade'],              component: 'MathEvaluator' },
  { id: 'eta-calculator',     name: 'ETA Calculator',       icon: '🕐', desc: 'Cálculos de data, hora e duração',      tags: ['utilidade'],              component: 'EtaCalculator' },
  { id: 'chronometer',        name: 'Chronometer',          icon: '⏱', desc: 'Cronômetro com laps e temporizador',    tags: ['utilidade'],              component: 'Chronometer' },
  { id: 'temp-converter',     name: 'Temperature',          icon: '🌡', desc: 'Celsius, Fahrenheit, Kelvin',           tags: ['conversor'],              component: 'TempConverter' },
  { id: 'lorem-ipsum',        name: 'Lorem Ipsum',          icon: '📄', desc: 'Gera texto de placeholder configurável', tags: ['texto', 'gerador'],      component: 'LoremIpsum' },
  { id: 'text-stats',         name: 'Text Statistics',      icon: '📊', desc: 'Palavras, chars, tempo de leitura…',    tags: ['texto'],                  component: 'TextStats' },
  { id: 'emoji-picker',       name: 'Emoji Picker',         icon: '😀', desc: 'Busca e copia emojis por categoria',    tags: ['texto', 'utilidade'],     component: 'EmojiPicker' },
  { id: 'string-obfuscator',  name: 'String Obfuscator',    icon: '🔀', desc: 'ROT13, Base64, unicode, hex…',          tags: ['texto', 'segurança'],     component: 'StringObfuscator' },
  { id: 'phone-formatter',    name: 'Phone Formatter',      icon: '📞', desc: 'Formata número de telefone',            tags: ['conversor'],              component: 'PhoneFormatter' },
  { id: 'cpf-cnpj',           name: 'CPF / CNPJ',           icon: '🪪', desc: 'Gera e valida CPF e CNPJ',             tags: ['gerador', 'brasil'],      component: 'CpfCnpjGenerator' },
  { id: 'password-generator', name: 'Password Generator',   icon: '🔑', desc: 'Senhas seguras configuráveis',          tags: ['gerador', 'segurança'],   component: 'PasswordGenerator' },
  { id: 'fake-data',          name: 'Fake Data',            icon: '🤖', desc: 'Nome, email, telefone, endereço PT-BR', tags: ['gerador', 'brasil'],      component: 'FakeDataGenerator' },
  { id: 'token-generator',    name: 'Token Generator',      icon: '🎲', desc: 'UUID, hex, base64, alfanumérico',       tags: ['gerador', 'segurança'],   component: 'TokenGenerator' },
]

export const ALL_TAGS = [...new Set(TOOLS.flatMap(t => t.tags))].sort()
