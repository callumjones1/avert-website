import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export const metadata = {
  title: {
    default: 'AVERT Research Network',
    template: '%s | AVERT Research Network',
  },
  description: 'A multidisciplinary research network dedicated to understanding and reducing violent extremism and radicalisation.',
  openGraph: {
    siteName: 'AVERT Research Network',
    locale: 'en_AU',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en-AU">
      <body className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
