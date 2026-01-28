export async function processSplit({ mode, pdf, excel }) {
  const formData = new FormData()
  formData.append('mode', mode)
  formData.append('pdf', pdf)
  if (mode === 'rename' && excel) formData.append('excel', excel)

  const res = await fetch('https://splitorabe.onrender.com/api/process', {
    method: 'POST',
    body: formData,
  })

  if (!res.ok) {
    let msg = 'Server error'
    try {
      const j = await res.json()
      msg = j.error || msg
    } catch {}
    throw new Error(msg)
  }

  return await res.blob()
}