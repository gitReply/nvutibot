const API = '/api'

export async function fetchBalance(user_id) {
  const res = await fetch(`${API}/balance`, {
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify({user_id})
  })
  return res.json()
}

export async function playNVUTI(user_id, bet) {
  const res = await fetch(`${API}/play`, {
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify({user_id,bet})
  })
  return res.json()
}

export async function sendNotification(message) {
  await fetch(`${API}/notify`,{
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify({message})
  })
}
