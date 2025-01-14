import { Metadata } from 'next'
import { HeroSection } from '@/components/landing/hero-section'
import { FeatureSection } from '@/components/landing/feature-section'
import { Footer } from '@/components/landing/footer'
import { Navbar } from '@/components/landing/navbar'

export const metadata: Metadata = {
  title: 'Money Tracker - Take Control of Your Finances',
  description: 'Track your expenses, set budgets, and achieve your financial goals with our intuitive money tracking app.',
  keywords: [
    'money tracker',
    'expense tracking',
    'budget management',
    'personal finance',
    'financial goals',
    'spending analytics',
  ],
  authors: [
    {
      name: 'Money Tracker Team',
    },
  ],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://moneytracker.app',
    title: 'Money Tracker - Take Control of Your Finances',
    description: 'Track your expenses, set budgets, and achieve your financial goals with our intuitive money tracking app.',
    siteName: 'Money Tracker',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Money Tracker - Take Control of Your Finances',
    description: 'Track your expenses, set budgets, and achieve your financial goals with our intuitive money tracking app.',
    creator: '@moneytracker',
  },
}

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <FeatureSection />
      </main>
      <Footer />
    </div>
  )
}
