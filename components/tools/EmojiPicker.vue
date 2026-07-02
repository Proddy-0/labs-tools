<script setup lang="ts">
const cats = [
  { name: 'Smileys', icon: '😀', emojis: '😀😃😄😁😆🥹😅😂🤣🥲☺️😊😇🙂🙃😉😌😍🥰😘😗😙😚😋😛😝😜🤪🤨🧐🤓😎🥸🤩🥳😏😒😞😔😟😕🙁☹️😣😖😫😩🥺😢😭😤😠😡🤬🤯😳🥵🥶😱😨😰😥😓🤗🤔🫣🤭🤫🤥😶😐😑😬🙄😯😦😧😮😲🥱😴🤤😪😵🫠🤐🥴🤢🤮🤧🤠🥸😷🤒🤕🤑🤗😈👿👹👺💀☠️👻👽👾🤖💩😺😸😹😻😼😽🙀😿😾' },
  { name: 'Gestos',  icon: '👋', emojis: '👋🤚🖐✋🖖🫱🫲🫳🫴👌🤌🤏✌️🤞🫰🤟🤘🤙👈👉👆🖕👇☝️🫵👍👎✊👊🤛🤜👏🫶🙌👐🤲🤝🙏✍️💅🤳💪🦾🦿🦵🦶👂🦻👃🦰🦱🦳🦲👁👀🫦🦷🦴👄🫁🫀🧠🦷' },
  { name: 'Pessoas', icon: '👤', emojis: '👶🧒👦👧🧑👱👨🧔👩🧓👴👵🙍🙎🙅🙆💁🙋🧏🙇🤦🤷👮🕵️💂🥷👷🫅🤴👸👼🎅🤶🦸🦹🧙🧚🧛🧜🧝🧞🧟🧌💆💇🚶🧍🧎🏃🤸🏌️🏇⛷️🏂🤺🤼🤽🤾🤹🧗🏋️🚴🤼👫👬👭💏💑👪' },
  { name: 'Animais', icon: '🐶', emojis: '🐶🐱🐭🐹🐰🦊🐻🐼🐻‍❄️🐨🐯🦁🐮🐷🐸🐵🙈🙉🙊🐔🐧🐦🐤🦆🦅🦉🦇🐺🐗🐴🦄🐝🪱🐛🦋🐌🐞🐜🪲🦟🦗🕷🦂🐢🐍🦎🦖🦕🐙🦑🦐🦞🦀🐡🐠🐟🐬🐳🐋🦈🦭🐊🐅🐆🦓🦍🦧🦣🐘🦛🦏🐪🐫🦒🦘🦬🐃🐂🐄🐎🐖🐏🐑🦙🐐🦌🐕🐩🦮🐕‍🦺🐈🐈‍⬛🐓🦃🦤🦚🦜🦢🦩🕊🐇🦝🦨🦡🦫🦦🦥🐁🐀🐿🦔' },
  { name: 'Comida',  icon: '🍕', emojis: '🍏🍎🍐🍊🍋🍌🍉🍇🍓🫐🍈🍒🍑🥭🍍🥥🥝🍅🍆🥑🥦🥬🥒🌶🫑🌽🥕🧄🧅🥔🍠🫘🥐🥯🍞🥖🥨🧀🥚🍳🧈🥞🧇🥓🥩🍗🍖🌭🍔🍟🍕🫓🥪🥙🧆🌮🌯🫔🥗🥘🫕🥫🍝🍜🍲🍛🍣🍱🥟🦪🍤🍙🍚🍘🍥🥮🍢🧁🍰🎂🍮🍭🍬🍫🍿🍩🍪🌰🥜🍯🧃🥤🧋☕🍵🧉🍺🍻🥂🍷🥃🍸🍹🧊🍾' },
  { name: 'Viagem',  icon: '✈️', emojis: '🚗🚕🚙🚌🚎🏎🚓🚑🚒🚐🛻🚚🚛🚜🏍🛵🛺🚲🛴🛹🛼🚏🛣🛤🛞⛽🚨🚥🚦🛑🚧⚓🛟🪝⛵🚤🛥🛳⛴🚢✈️🛩🛫🛬🪂💺🚁🚟🚠🚡🛰🚀🛸🪐🌍🌎🌏🌐🗺🧭🏔⛰🌋🗻🏕🏖🏜🏝🏞🏟🏛🏗🏘🏚🏠🏡🏢🏣🏤🏥🏦🏨🏩🏪🏫🏬🏭🗼🗽⛪🕌🛕🕍⛩🕍🗾🎑🏞🌅🌄🌠🎇🎆🌇🌆🏙🌃🌌🌉🌁' },
  { name: 'Objetos', icon: '📱', emojis: '⌚📱📲💻⌨️🖥🖨🖱🖲💽💾💿📀🧮📷📸📹🎥📽🎞📞☎️📟📠📺📻🧭⏱⏲⏰🕰⌛⏳📡🔋🔌💡🔦🕯🪔🧯🛢💰💴💵💶💷💸💳🪙💹📈📉📊📋📌📍📎🖇📏📐✂️🗃🗄🗑🔒🔓🔏🔐🔑🗝🔨🪓⛏⚒🛠🗡⚔🔫🪃🏹🛡🪚🔧🪛🔩⚙🗜⚖🦯🔗⛓🪝🧲🪜🧰🧲🪤🪣🚿🛁⚗🧪🧫🧬🔬🔭📡💊💉🩸🩹🩺🏷🔮🔯♟🎈🎏🎀🎁🎊🎉🎎🎍🎑🎃🎗🎟🎫🎖🏆🥇🥈🥉🏅🎠🎡🎢🎪🎭🎨🎬🎤🎧🎼🎵🎶' },
  { name: 'Símbolos',icon: '❤️', emojis: '❤️🧡💛💚💙💜🖤🤍🤎💔❤️‍🔥❤️‍🩹❣️💕💞💓💗💖💘💝💟☮️✝️☪️🕉☸️✡️🔯🕎☯️☦️🛐⛎♈♉♊♋♌♍♎♏♐♑♒♓🆔⚕♻️⚜🔰📛🔱⭕✅❎🆗🆖🆙🆒🆕🆓0️⃣1️⃣2️⃣3️⃣4️⃣5️⃣6️⃣7️⃣8️⃣9️⃣🔟🔠🔡🔢🔣🔤🅰️🆎🅱️🆑🆘❌⭕🛑⛔📵🚫🚳🚭🚯🚱🚷📵🔞☢️☣️⬆️↗️➡️↘️⬇️↙️⬅️↖️↕️↔️↩️↪️⤴️⤵️🔃🔄🔙🔚🔛🔜🔝🛐♀️♂️⚧✖️➕➖➗🟰♾️‼️⁉️❓❔❕❗〰️⚕♻️✔️☑️🔘🔵🔴🟤🟠🟡🟢🔶🔷🔸🔹🔺🔻💠🔲🔳⬛⬜◼️◻️◾◽▪️▫️' },
]

const q       = ref('')
const activeCat = ref('Smileys')
const toast   = ref('')

const displayEmojis = computed(() => {
  if (q.value.trim()) {
    // search across all cats
    return cats.flatMap(c => [...c.emojis]).filter(e => true).join('')
  }
  return cats.find(c => c.name === activeCat.value)?.emojis ?? ''
})

async function pick(emoji: string) {
  await navigator.clipboard.writeText(emoji)
  toast.value = emoji
  setTimeout(() => toast.value = '', 1000)
}
</script>

<template>
  <div class="tool-layout">
    <div class="search-wrap" style="margin-bottom:0">
      <span class="search-icon">🔍</span>
      <input v-model="q" class="search-input" placeholder="Buscar emoji… (ou clique na categoria)" />
    </div>

    <div v-if="!q" style="display:flex;flex-wrap:wrap;gap:0.3rem">
      <button v-for="cat in cats" :key="cat.name"
        class="filter" :class="{ active: activeCat === cat.name }"
        @click="activeCat = cat.name">
        {{ cat.icon }} {{ cat.name }}
      </button>
    </div>

    <div style="display:flex;flex-wrap:wrap;gap:0.2rem;max-height:300px;overflow-y:auto;padding:0.5rem;background:var(--bg);border:1px solid var(--line);border-radius:8px">
      <button
        v-for="emoji in [...displayEmojis]"
        :key="emoji"
        @click="pick(emoji)"
        style="font-size:1.5rem;padding:0.25rem;background:transparent;border:none;cursor:pointer;border-radius:6px;transition:background .1s;line-height:1"
        :title="emoji"
        :style="{ background: toast === emoji ? 'rgba(61,220,151,0.15)' : undefined }"
      >{{ emoji }}</button>
    </div>

    <Transition name="fade">
      <div v-if="toast" style="position:fixed;bottom:1.5rem;left:50%;transform:translateX(-50%);background:var(--bg-card);border:1px solid var(--green);border-radius:8px;padding:0.5rem 1.25rem;font-size:1.5rem;display:flex;align-items:center;gap:0.5rem;z-index:200">
        {{ toast }} <span style="font-size:0.75rem;color:var(--green)">copiado!</span>
      </div>
    </Transition>
  </div>
</template>
