'use client'

import { useState } from 'react'
import supabase from '@/lib/supabaseClient'

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')

  const handleSignup = async () => {
    const { error } = await supabase.auth.signUp({ email, password })
    if (error) {
      setMessage(error.message)
    } else {
      setMessage('가입 완료! 이메일을 확인하세요.')
    }
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Souple 회원가입</h2>
      <input
        type="email"
        placeholder="이메일"
        className="w-full p-2 mb-2 border rounded"
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="비밀번호"
        className="w-full p-2 mb-4 border rounded"
        onChange={(e) => setPassword(e.target.value)}
      />
      <button
        className="w-full bg-green-500 text-white py-2 rounded"
        onClick={handleSignup}
      >
        회원가입
      </button>
      {message && <p className="mt-2">{message}</p>}
    </div>
  )
}
