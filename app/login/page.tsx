'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import supabase from '@/lib/supabaseClient'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError(error.message)
    } else {
      router.push('/')
    }
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Souple 로그인</h2>
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
        className="w-full bg-blue-500 text-white py-2 rounded"
        onClick={handleLogin}
      >
        로그인
      </button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  )
}
