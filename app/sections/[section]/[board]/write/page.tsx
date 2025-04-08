'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import supabase from '@/lib/supabaseClient'

export default function BoardWritePage() {
  const router = useRouter()
  const params = useParams()
  const section = params?.section as string
  const board = params?.board as string

  const [user, setUser] = useState<any>(null)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [category, setCategory] = useState('잡담') // 기본 카테고리
  const [error, setError] = useState('')

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) router.push('/login')
      else setUser(user)
    })
  }, [router])

  const getIpAddress = async () => {
    try {
      const res = await fetch('https://api64.ipify.org?format=json')
      const data = await res.json()
      return data.ip
    } catch {
      return 'unknown'
    }
  }

  const handleSubmit = async () => {
    if (!title || !content) {
      setError('제목과 내용을 입력해주세요.')
      return
    }

    const ip = await getIpAddress()
    const userAgent = navigator.userAgent
    const deviceInfo = `${navigator.platform} - ${navigator.language}`

    const { error } = await supabase.from('posts').insert({
      title,
      content,
      board_id: board,
      category,
      user_id: user.id,
      ip_address: ip,
      user_agent: userAgent,
      device_info: deviceInfo
    })

    if (error) setError(error.message)
    else router.push(`/sections/${section}/${board}`)
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">[{board}] 글쓰기</h2>
      <input
        type="text"
        placeholder="제목"
        className="w-full p-2 mb-2 border rounded"
        onChange={(e) => setTitle(e.target.value)}
      />
      <select
        className="w-full p-2 mb-2 border rounded"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      >
        <option value="잡담">잡담</option>
        <option value="정보">정보</option>
        <option value="기타">기타</option>
      </select>
      <textarea
        placeholder="내용"
        className="w-full p-2 mb-4 border rounded h-40"
        onChange={(e) => setContent(e.target.value)}
      />
      <button
        onClick={handleSubmit}
        className="w-full bg-blue-500 text-white py-2 rounded"
      >
        등록하기
      </button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  )
}
