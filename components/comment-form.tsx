'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import supabase from '@/lib/supabaseClient'

interface CommentFormProps {
  postId: string
  parentId?: string
  onSuccess?: () => void
}

export default function CommentForm({ postId, parentId, onSuccess }: CommentFormProps) {
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async () => {
    if (!content.trim()) return
    setLoading(true)

    const { data: { session } } = await supabase.auth.getSession()
    const user_id = session?.user?.id || null

    const { error } = await supabase.from('comments').insert({
      content,
      post_id: postId,
      user_id,
      parent_id: parentId || null,
    })

    setLoading(false)

    if (error) {
      alert('댓글 등록에 실패했습니다.')
      return
    }

    setContent('')
    onSuccess?.() // ✅ 여기가 문제면 위 props 확인
  }

  return (
    <div className="mt-4">
      <textarea
        className="w-full border rounded p-2 text-sm"
        placeholder={parentId ? '답글을 입력하세요...' : '댓글을 입력하세요...'}
        rows={3}
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <div className="mt-2 text-right">
        <button
          onClick={handleSubmit}
          disabled={loading || !content.trim()}
          className="bg-primary text-white px-4 py-1 rounded hover:bg-primary/80"
        >
          작성
        </button>
      </div>
    </div>
  )
}
