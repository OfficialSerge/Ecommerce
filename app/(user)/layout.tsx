import '../globals.css'

import Providers from './Providers'

import Header from '@/components/header/Header'
import SideBar from '@/components/sideBar/SideBar'

export const metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className='layout'>
        <Providers>
          <Header />
          <SideBar />
          {children}
        </Providers>
      </body>
    </html>
  )
}
