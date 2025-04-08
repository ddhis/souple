import '../styles/globals.css';
import { Header } from '../components/header'
import { Footer } from '../components/footer'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className="bg-gray-100 text-gray-900 min-h-screen">
        <Header />
        <main className="pt-20 max-w-3xl mx-auto px-4">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
