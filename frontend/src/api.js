const API = '/api'

export async function fetchBalance(tg_id) {
  const res = await fetch(`${API}/balance`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({ tg_id })
  })
  return res.json()
}

export async function playNVUTI(tg_id, bet) {
  const res = await fetch(`${API}/play`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({ tg_id, bet })
  })
  return res.json()
}

export async function sendNotif(content) {
  await fetch(`${API}/admin/notify`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({ content })
  })
}
