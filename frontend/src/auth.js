const KEY = 'orbita:session'

export function isAuthed() {
  try {
    return localStorage.getItem(KEY) === '1'
  } catch {
    return false
  }
}

export function setAuthed() {
  try {
    localStorage.setItem(KEY, '1')
  } catch {
    // ignore
  }
}

export function clearAuth() {
  try {
    localStorage.removeItem(KEY)
  } catch {
    // ignore
  }
}
