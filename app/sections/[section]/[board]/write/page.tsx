'use client'

import { useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import supabase from '@/lib/supabaseClient'

export default function WritePage() {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { section, board } = useParams()

  const handleSubmit = async () => {
    if (!title || !content) return alert('제목과 내용을 입력해주세요.')
    setLoading(true)

    const {
      data: { session },
    } = await supabase.auth.getSession()

    const user_id = session?.user?.id || null

    const { error } = await supabase.from('posts').insert({
      title,
      content,
      board_id: board as string,
      user_id,
    })

    setLoading(false)
    if (error) return alert('작성에 실패했습니다.')
    router.push(`/sections/${section}/${board}`)
  }

  return (
    <main className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">게시글 작성</h1>
      <div className="space-y-4">
        <input
          type="text"
          className="w-full p-2 border rounded"
          placeholder="제목을 입력하세요"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          className="w-full p-2 border rounded h-48"
          placeholder="내용을 입력하세요"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
        >
          작성하기
        </button>
      </div>
    </main>
  )
}
