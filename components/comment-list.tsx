'use client'

import supabase from '@/lib/supabaseClient'
import { useEffect, useState, useCallback } from 'react'
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

  const fetchComments = useCallback(async () => {
    const { data, error } = await supabase
    .from('comments')
    .select(`
      id,
      content,
      created_at,
      parent_id,
      post_id,
      user_id,
      profiles (
        nickname
      )
    `)
    .eq('post_id', postId)
    .order('created_at', { ascending: true })
  
  

    if (error) {
      console.error(error)
      return
    }

    // fk_user_id를 profiles로 매핑
    const formatted = (data || []).map((item) => ({
      ...item,
      profiles: item.user_id?.[0] || { nickname: null },
    }))

    setComments(formatted)
  }, [postId])

  useEffect(() => {
    fetchComments()
  }, [fetchComments])

  if (!comments || comments.length === 0) {
    return <p className="text-gray-500">댓글이 없습니다.!!!!</p>
  }

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
          <div className="text-sm text-gray-500 flex items-center justify-between">
            <span>{comment.profiles?.nickname || '익명'} ・ {new Date(comment.created_at).toLocaleString()}</span>
            <button
              onClick={() => setReplyTarget(replyTarget === comment.id ? null : comment.id)}
              className="text-blue-500 text-sm ml-2"
            >
              {replyTarget === comment.id ? '취소' : '답글'}
            </button>
          </div>

          <p className="mt-1">{comment.content}</p>

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

          {childrenMap[comment.id]?.map((child) => (
            <div key={child.id} className="ml-4 mt-3 border-l pl-3">
              <div className="text-sm text-gray-500">
                {child.profiles?.nickname || '익명'} ・ {new Date(child.created_at).toLocaleString()}
              </div>
              <p className="mt-1">{child.content}</p>
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}
