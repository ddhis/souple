import { uniqueNamesGenerator, adjectives, colors } from 'unique-names-generator'

export function generateNickname() {
  return (
    uniqueNamesGenerator({
      dictionaries: [colors, adjectives],
      separator: '',
      style: 'capital',
    }) + Math.floor(100 + Math.random() * 900)
  )
}
