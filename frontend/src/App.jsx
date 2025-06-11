import { useEffect, useState } from 'react'
import { fetchBalance, playNVUTI, sendNotification } from './api'
import { WebApp } from '@twa-dev/sdk'
import useSWR from 'swr'

function App() {
  const tg = WebApp.initDataUnsafe.user
  const user_id = tg.id

  const { data, mutate } = useSWR(['balance',user_id], ()=> fetchBalance(user_id))
  const [bet,setBet] = useState('')
  const [result,setResult] = useState('')
  const [notif,setNotif] = useState('')

  useEffect(()=>{ WebApp.ready(); WebApp.expand() },[])

  const onPlay = async ()=>{
    const res = await playNVUTI(user_id, parseInt(bet))
    setResult(res.result)
    mutate()
  }
  const onNotify = ()=>{
    sendNotification(notif)
    setNotif('')
    alert('Уведомление отправлено')
  }

  if(!data) return <div>Загрузка...</div>

  return (
    <div className="p-4 flex flex-col min-h-screen bg-gray-900 text-white">
      <header className="flex items-center mb-4">
        <img src={tg.photo_url} className="w-12 h-12 rounded-full mr-2"/>
        <div>
          <div className="text-lg font-bold">{tg.username}</div>
          <div>⭐ {data.balance} | 🎁 {data.bonus}</div>
        </div>
      </header>
      <div className="mb-4">
        <input type="number" 
          className="p-2 rounded text-black w-32" 
          placeholder="Ставка" value={bet} 
          onChange={e=>setBet(e.target.value)}/>
        <button className="ml-2 px-4 py-2 bg-green-500 rounded" onClick={onPlay}>Играть</button>
        {result && <div className="mt-2">{result}</div>}
      </div>
      {data.is_admin && (
        <div className="mb-4 p-2 bg-gray-800 rounded">
          <h3 className="font-bold mb-2">Админ‑панель</h3>
          <input className="p-1 rounded text-black mr-2" 
            placeholder="Уведомление" 
            value={notif} onChange={e=>setNotif(e.target.value)}/>
          <button className="px-3 py-1 bg-blue-500 rounded" onClick={onNotify}>Отправить</button>
        </div>
      )}
      <footer className="mt-auto text-center text-gray-500 text-sm">
        © NVUTI Casino {new Date().getFullYear()}
      </footer>
    </div>
  )
}

export default App
