'use client'

import supabase from '@/lib/supabaseClient'
import { useEffect, useState } from 'react'
import CommentForm from '@/components/comment-form'

interface Comment {
    id: string
    content: string
    created_at: string
    parent_id: string | null
    user_id: string | null
    post_id: string
    profiles?: {
      nickname?: string | null
    }
  }
  

export default function CommentList({ postId }: { postId: string }) {
  const [comments, setComments] = useState<Comment[]>([])
  const [replyTarget, setReplyTarget] = useState<string | null>(null)

  const fetchComments = async () => {
    const { data } = await supabase
      .from('comments')
      .select('*, profiles(nickname)')
      .eq('post_id', postId)
      .order('created_at', { ascending: true })
  
    setComments(data || [])
  }
  

  useEffect(() => {
    fetchComments()
  }, [postId])

  if (!comments || comments.length === 0)
    return <p className="text-gray-500">댓글이 없습니다.!!</p>

  const topLevel = comments.filter((c) => !c.parent_id)
  const childrenMap = comments.reduce<Record<string, Comment[]>>((acc, cur) => {
    if (cur.parent_id) {
      acc[cur.parent_id] = acc[cur.parent_id] || []
      acc[cur.parent_id].push(cur)
    }
    return acc
  }, {})

  return (
    <div className="space-y-6">
      {topLevel.map((comment) => (
  <div key={comment.id} className="border-b pb-4">
    {/* 작성자 + 시간 + 답글 버튼 */}
    <div className="text-sm text-gray-500 flex items-center justify-between">
  <span>{comment.profiles?.nickname || '익명'} ・ {new Date(comment.created_at).toLocaleString()}</span>
  <button
    onClick={() => setReplyTarget(replyTarget === comment.id ? null : comment.id)}
    className="text-blue-500 text-sm ml-2"
  >
    {replyTarget === comment.id ? '취소' : '답글'}
  </button>
</div>


    {/* 댓글 내용 */}
    <p className="mt-1">{comment.content}</p>

    {/* 답글 입력창 */}
    {replyTarget === comment.id && (
      <CommentForm
        postId={postId}
        parentId={comment.id}
        onSuccess={() => {
          fetchComments()
          setReplyTarget(null)
        }}
      />
    )}

    {/* 대댓글 */}
    {childrenMap[comment.id]?.map((child) => (
  <div key={child.id} className="ml-4 mt-3 border-l pl-3">
    <div className="text-sm text-gray-500">
      {child.profiles?.nickname || '익명'} ・ {new Date(child.created_at).toLocaleString()}
    </div>
    <p className="mt-1">{child.content}</p>

    {/* 대댓글에는 더 이상 답글 버튼 없음 */}
  </div>
))}


  </div>
))}

    </div>
  )
}
