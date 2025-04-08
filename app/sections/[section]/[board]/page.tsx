'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import supabase from '@/lib/supabaseClient'

interface Post {
  id: string
  title: string
  created_at: string
  user_id: string
  category: string
}

export default function BoardPage() {
  const router = useRouter()
  const params = useParams()
  const section = params?.section as string
  const board = params?.board as string

  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPosts = async () => {
      const { data, error } = await supabase
        .from('posts')
        .select('id, title, created_at, user_id, category')
        .eq('board_id', board)
        .order('created_at', { ascending: false })

      if (!error && data) setPosts(data)
      setLoading(false)
    }

    fetchPosts()
  }, [board])

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">[{board}] 게시판</h1>

      <div className="mb-4 text-right">
        <Link
          href={`/sections/${section}/${board}/write`}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          글쓰기
        </Link>
      </div>

      {loading ? (
        <p>불러오는 중...</p>
      ) : posts.length === 0 ? (
        <p>작성된 글이 없습니다.</p>
      ) : (
        <ul>
          {posts.map((post) => (
            <li key={post.id} className="border-b py-2">
              <Link href={`/sections/${section}/${board}/${post.id}`} className="font-semibold">
                [{post.category}] {post.title}
              </Link>
              <p className="text-sm text-gray-500">작성일: {new Date(post.created_at).toLocaleString()}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
