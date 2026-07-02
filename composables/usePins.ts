const STORAGE_KEY = 'proddyt-tools-pins'

export function usePins() {
  const pins = ref<string[]>([])

  function load() {
    try {
      pins.value = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]')
    } catch {
      pins.value = []
    }
  }

  function save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(pins.value))
  }

  function isPinned(id: string) {
    return pins.value.includes(id)
  }

  function toggle(id: string) {
    if (isPinned(id)) {
      pins.value = pins.value.filter(p => p !== id)
    } else {
      pins.value = [...pins.value, id]
    }
    save()
  }

  function unpin(id: string) {
    pins.value = pins.value.filter(p => p !== id)
    save()
  }

  if (import.meta.client) load()

  return { pins, isPinned, toggle, unpin }
}
