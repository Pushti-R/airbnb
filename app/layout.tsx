import type { Metadata } from 'next'
import { Inter, Nunito } from 'next/font/google'
import './globals.css'
import Navbar from './components/navbar/Navbar'
import ClientOnly from './components/ClientOnly'
import RegisterModal from './components/modals/RegisterModal'
import ToasterProvider from './providers/ToasterProvider'
import LoginModal from './components/modals/LoginModal'
import getCurrentUser from './actions/getCurrentUser'
import RentModal from './components/modals/RentModal'
import SearchModal from './components/modals/SearchModal'
import { ThemeProvider } from './theme'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Airbnb | Holiday rentals, cabins, beach houses & more',
  description: 'Airbnb clone',
  icons: {
    icon: '/images/airbnb-icon.png'
  }
}
export const dynamic = 'force-dynamic';

const font = Nunito({
  subsets: ['latin']
})

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const currentUser = await getCurrentUser();
  //const user = await prisma?.user.find();
  return (
   
    <html lang="en">
      <body className={`${inter.className} ${font.className} bg-slate-50 dark:bg-[#0d1117]`}>
        <ThemeProvider attribute='class' defaultTheme="system" enableSystem>
            <ClientOnly>
              <ToasterProvider />
              <SearchModal />
              <RentModal />
              <LoginModal />
              <RegisterModal />
              <Navbar currentUser={currentUser} />
            </ClientOnly>
              <div className='pb-20 pt-28'>
                {children}
              </div>
        </ThemeProvider>
        </body>
    </html>
    
  )
}
