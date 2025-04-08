'use client'

import { useState } from 'react'
import supabase from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'

interface CommentFormProps {
  postId: string
  parentId?: string
  user: { id: string; nickname: string } | null
}

export default function CommentForm({ postId, parentId, user }: CommentFormProps) {
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim()) return

    setLoading(true)

    const { error } = await supabase.from('comments').insert({
      post_id: postId,
      content,
      parent_id: parentId || null,
      user_id: user?.id || null,
    })

    setLoading(false)
    setContent('')

    if (!error) {
      router.refresh() // 페이지 새로고침으로 댓글 반영
    } else {
      alert('댓글 작성에 실패했습니다.')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2 mt-4">
      <textarea
        className="w-full p-2 border rounded resize-none text-sm"
        placeholder={parentId ? '답글을 입력하세요...' : '댓글을 입력하세요...'}
        rows={3}
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <button
        type="submit"
        disabled={loading || !content.trim()}
        className="btn"
      >
        {loading ? '작성 중...' : '작성'}
      </button>
    </form>
  )
}
