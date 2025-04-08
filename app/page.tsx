'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import supabase from '@/lib/supabaseClient'

interface Post {
  id: string
  title: string
  board_id: string
  created_at: string
  category: string
}

export default function HomePage() {
  const [recentPosts, setRecentPosts] = useState<Post[]>([])

  useEffect(() => {
    const fetchRecentPosts = async () => {
      const { data } = await supabase
        .from('posts')
        .select('id, title, board_id, category, created_at')
        .order('created_at', { ascending: false })
        .limit(10)

      if (data) setRecentPosts(data)
    }

    fetchRecentPosts()
  }, [])

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Souple 커뮤니티 메인</h1>

      <Link href="/sections" className="text-blue-600 hover:underline text-sm">
        → 전체 게시판 보기
      </Link>

      <h2 className="text-xl font-semibold mt-6 mb-2">🆕 최근 올라온 글</h2>
      {recentPosts.length === 0 ? (
        <p className="text-gray-500">최근 글이 없습니다.</p>
      ) : (
        <ul className="mt-2">
          {recentPosts.map((post) => (
            <li key={post.id} className="border-b py-2">
              <Link
                href={`/sections/unknown/${post.board_id}/${post.id}`}
                className="text-blue-500 font-medium hover:underline"
              >
                [{post.category}] {post.title}
              </Link>
              <p className="text-sm text-gray-500">
                게시판: {post.board_id} | 작성일: {new Date(post.created_at).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
