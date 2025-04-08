// app/post/[id]/page.tsx
import supabase from '@/lib/supabaseClient'
import { notFound } from 'next/navigation'
import CommentForm from '@/components/comment-form'
import CommentList from '@/components/comment-list'


interface PostPageProps {
  params: {
    id: string
  }
}

export default async function PostPage({ params }: PostPageProps) {
  const { data: post } = await supabase
    .from('posts')
    .select('*')
    .eq('id', params.id)
    .single()

  if (!post) return notFound()

    return (
      <main className="p-6 max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">{post.title}</h1>
        <div className="text-sm text-gray-500 mb-6">
          작성일: {new Date(post.created_at).toLocaleString()}
        </div>
        <div className="prose prose-neutral dark:prose-invert mb-12">
          <p>{post.content}</p>
        </div>
    
        {/* 댓글 작성 */}
        <h2 className="text-lg font-semibold mb-2">댓글 작성</h2>
        <CommentForm postId={params.id} />
    
        {/* 댓글 리스트 */}
        <h2 className="text-lg font-semibold mt-10 mb-2">댓글 목록</h2>
        <CommentList postId={params.id} />
      </main>
    )
}