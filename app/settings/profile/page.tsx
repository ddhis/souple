'use client'

import { useEffect, useState } from 'react'
import supabase from '@/lib/supabaseClient'

export default function ProfilePage() {
  const [nickname, setNickname] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchNickname = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (session) {
        const { data } = await supabase
          .from('profiles')
          .select('nickname')
          .eq('id', session.user.id)
          .single()

        if (data) setNickname(data.nickname)
      }
      setLoading(false)
    }

    fetchNickname()
  }, [])

  const handleSubmit = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) return

    const { error } = await supabase
      .from('profiles')
      .update({ nickname })
      .eq('id', session.user.id)

    if (error) alert('닉네임 변경 실패')
    else alert('닉네임이 변경되었습니다')
  }

  return (
    <main className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">프로필 설정</h1>
      {loading ? (
        <p className="text-gray-500">불러오는 중...</p>
      ) : (
        <div className="space-y-4">
          <input
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            className="input w-full p-2 border rounded"
            placeholder="닉네임을 입력하세요"
          />
          <button onClick={handleSubmit} className="btn px-4 py-2 bg-primary text-white rounded">
            닉네임 변경
          </button>
        </div>
      )}
    </main>
  )
}
