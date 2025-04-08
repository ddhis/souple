'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import supabase from '@/lib/supabaseClient'

interface Section {
  id: string
  name: string
  description: string
}

interface Board {
  id: string
  name: string
  section_id: string
  description: string
}

export default function SectionsPage() {
  const [sections, setSections] = useState<Section[]>([])
  const [boards, setBoards] = useState<Board[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSectionsAndBoards = async () => {
      const { data: sectionData } = await supabase.from('sections').select('*')
      const { data: boardData } = await supabase.from('boards').select('*')

      if (sectionData && boardData) {
        setSections(sectionData)
        setBoards(boardData)
      }
      setLoading(false)
    }
    fetchSectionsAndBoards()
  }, [])

  if (loading) return <div className="p-6">불러오는 중...</div>

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Souple 커뮤니티 게시판 목록</h1>

      {sections.map((section) => (
        <div key={section.id} className="mb-8">
          <h2 className="text-xl font-semibold mb-2">{section.name}</h2>
          <p className="text-sm text-gray-500 mb-2">{section.description}</p>

          <ul className="list-disc list-inside ml-4">
            {boards
              .filter((board) => board.section_id === section.id)
              .map((board) => (
                <li key={board.id}>
                  <Link
                    href={`/sections/${section.id}/${board.id}`}
                    className="text-blue-600 hover:underline"
                  >
                    {board.name}
                  </Link>
                  <span className="text-sm text-gray-500 ml-1">- {board.description}</span>
                </li>
              ))}
          </ul>
        </div>
      ))}
    </div>
  )
}
