'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import supabase from '@/lib/supabaseClient'

interface Post {
  title: string
  content: string
  created_at: string
  category: string
  user_id: string
}

interface Comment {
  id: string
  content: string
  created_at: string
  user_id: string
}

export default function PostDetailPage() {
  const router = useRouter()
  const params = useParams()
  const section = params?.section as string
  const board = params?.board as string
  const postId = params?.postId as string

  const [post, setPost] = useState<Post | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState('')
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [commentError, setCommentError] = useState('')

  useEffect(() => {
    const fetchPostAndComments = async () => {
      const { data: postData } = await supabase
        .from('posts')
        .select('title, content, created_at, category, user_id')
        .eq('id', postId)
        .single()

      const { data: commentData } = await supabase
        .from('comments')
        .select('id, content, created_at, user_id')
        .eq('post_id', postId)
        .order('created_at', { ascending: true })

      const {
        data: { user },
      } = await supabase.auth.getUser()

      setPost(postData)
      setComments(commentData || [])
      setUser(user)
      setLoading(false)
    }

    fetchPostAndComments()
  }, [postId])

  const handleCommentSubmit = async () => {
    if (!newComment.trim()) return

    const { error } = await supabase.from('comments').insert({
      content: newComment,
      user_id: user.id,
      post_id: postId
    })

    if (error) {
      setCommentError(error.message)
    } else {
      setNewComment('')
      const { data: updatedComments } = await supabase
        .from('comments')
        .select('id, content, created_at, user_id')
        .eq('post_id', postId)
        .order('created_at', { ascending: true })
      setComments(updatedComments || [])
    }
  }

  if (loading) return <div className="p-6">불러오는 중...</div>
  if (!post) return <div className="p-6">글을 찾을 수 없습니다.</div>

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-2">{post.title}</h1>
      <p className="text-sm text-gray-500 mb-2">
        [{post.category}] | 작성일: {new Date(post.created_at).toLocaleString()}
      </p>
      <div className="border-t pt-4 whitespace-pre-wrap mb-8">
        {post.content}
      </div>

      <h2 className="text-xl font-semibold mb-2">댓글</h2>
      {comments.length === 0 ? (
        <p className="text-gray-500 mb-4">아직 댓글이 없습니다.</p>
      ) : (
        <ul className="mb-4">
          {comments.map((comment) => (
            <li key={comment.id} className="border-b py-2">
              <p className="whitespace-pre-wrap">{comment.content}</p>
              <p className="text-sm text-gray-500">작성일: {new Date(comment.created_at).toLocaleString()}</p>
            </li>
          ))}
        </ul>
      )}

      {user ? (
        <div className="mt-4">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="댓글을 입력하세요"
            className="w-full p-2 border rounded mb-2"
          />
          <button
            onClick={handleCommentSubmit}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            댓글 등록
          </button>
          {commentError && <p className="text-red-500 mt-2">{commentError}</p>}
        </div>
      ) : (
        <p className="text-sm text-gray-500 mt-4">댓글을 작성하려면 로그인하세요.</p>
      )}
    </div>
  )
}
