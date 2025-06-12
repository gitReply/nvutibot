import { useState, useEffect } from 'react'
import useSWR from 'swr'
import { fetchBalance, playNVUTI, sendNotif } from './api'
import { WebApp } from '@twa-dev/sdk'

export default function App() {
  const tg = WebApp.initDataUnsafe.user
  const [bet, setBet] = useState('')
  const [result, setResult] = useState('')
  const [notif, setNotif] = useState('')
  const { data, mutate } = useSWR(['bal', tg.id], () => fetchBalance(tg.id))

  useEffect(() => { WebApp.ready(); WebApp.expand() }, [])

  if (!data) return <div className="p-4">Загрузка...</div>

  const onPlay = async () => {
    const b = parseInt(bet)
    if (!b || b<1) return alert('Неверная ставка')
    const res = await playNVUTI(tg.id, b)
    setResult(res.result)
    mutate()
  }

  const onNotify = () => {
    sendNotif(notif)
    setNotif('')
    alert('Уведомление отправлено')
  }

  return (
    <div className="p-4 flex flex-col min-h-screen">
      <header className="flex items-center mb-4">
        <img src={tg.photo_url} className="w-12 h-12 rounded-full mr-2"/>
        <div>
          <div className="text-lg font-bold">{tg.username}</div>
          <div>⭐ {data.balance} | 🎁 {data.bonus}</div>
        </div>
      </header>

      <div className="mb-4">
        <input
          type="number"
          className="p-2 rounded text-black w-32"
          placeholder="Ставка"
          value={bet}
          onChange={e=>setBet(e.target.value)}
        />
        <button className="ml-2 px-4 py-2 bg-green-500 rounded" onClick={onPlay}>
          Играть
        </button>
        {result && <div className="mt-2">{result}</div>}
      </div>

      {data.is_admin && (
        <div className="p-4 mb-4 bg-gray-800 rounded">
          <h2 className="font-bold mb-2">Админ</h2>
          <input
            className="p-2 rounded text-black w-full mb-2"
            placeholder="Текст уведомления"
            value={notif}
            onChange={e=>setNotif(e.target.value)}
          />
          <button className="px-4 py-2 bg-blue-500 rounded" onClick={onNotify}>
            Отправить
          </button>
        </div>
      )}

      <footer className="mt-auto text-center text-gray-500 text-sm">
        © NVUTI Casino 2025
      </footer>
    </div>
  )
}
