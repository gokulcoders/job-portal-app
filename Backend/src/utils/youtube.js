const YT_ID_RE = /(?:youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/

export function extractYouTubeId(url) {
  const match = String(url || '').match(YT_ID_RE)
  return match ? match[1] : null
}
