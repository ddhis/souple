import Link from 'next/link'

export function Header() {
  return (
    <header className="bg-white shadow-sm fixed top-0 left-0 right-0 z-10">
      <div className="max-w-5xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold text-blue-600">Souple</Link>
        <nav className="space-x-4 text-sm">
          <Link href="/sections" className="hover:underline">게시판</Link>
          <Link href="/login" className="hover:underline">로그인</Link>
        </nav>
      </div>
    </header>
  )
}