'use client'
import { useState, useEffect } from 'react'
import supabase from '@/lib/supabaseClient'


export default function ProfileSettings() {
  const [nickname, setNickname] = useState('')

  useEffect(() => {
    const fetchNickname = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        const { data } = await supabase
          .from('profiles')
          .select('nickname')
          .eq('id', session.user.id)
          .single()
        if (data) setNickname(data.nickname)
      }
    }
    fetchNickname()
  }, [])

  const handleSubmit = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return

    const { error } = await supabase
      .from('profiles')
      .update({ nickname })
      .eq('id', session.user.id)

    if (error) alert('닉네임 변경 실패')
    else alert('닉네임이 변경되었습니다')
  }

  return (
    <div className="max-w-md space-y-4">
      <h2 className="text-xl font-bold">닉네임 변경</h2>
      <input
        value={nickname}
        onChange={(e) => setNickname(e.target.value)}
        className="input w-full"
      />
      <button onClick={handleSubmit} className="btn">변경하기</button>
    </div>
  )
}
