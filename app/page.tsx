'use client'

import { useEffect, useState } from 'react'
import supabase from '@/lib/supabaseClient'

interface Board {
  id: string
  name: string
  description: string | null
  section_id: string
  is_anonymous: boolean
  category_type: string | null
}

interface Section {
  id: string
  name: string
}

export default function HomePage() {
  const [sections, setSections] = useState<Section[]>([])
  const [boards, setBoards] = useState<Board[]>([])

  useEffect(() => {
    const fetchData = async () => {
      const { data: sectionsData } = await supabase.from('sections').select('*')
      const { data: boardsData } = await supabase.from('boards').select('*')

      if (sectionsData) setSections(sectionsData)
      if (boardsData) setBoards(boardsData)
    }

    fetchData()
  }, [])

  return (
    <main className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Souple 커뮤니티</h1>

      {sections.map((section) => (
        <div key={section.id} className="mb-8">
          <h2 className="text-xl font-semibold border-b pb-1 mb-2">{section.name}</h2>
          <ul className="space-y-1">
            {boards.filter((b) => b.section_id === section.id).map((board) => (
              <li key={board.id}>
                <a href={`/sections/${board.section_id}/${board.id}`} className="text-blue-600 hover:underline">
                  {board.name}
                </a>
                {board.description && <p className="text-sm text-gray-500">{board.description}</p>}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </main>
  )
}
