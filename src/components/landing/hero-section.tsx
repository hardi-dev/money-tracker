import { Button } from '@/components/ui/button'
import { ChevronRight } from 'lucide-react'
import Link from 'next/link'

export function HeroSection() {
  return (
    <div className="flex flex-col items-center justify-center space-y-4 text-center py-24 px-4">
      <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
        Track Your Money,{' '}
        <span className="bg-gradient-to-r from-blue-500 to-teal-500 bg-clip-text text-transparent">
          Master Your Future
        </span>
      </h1>
      <p className="max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400">
        Take control of your finances with our intuitive money tracking app.
        Monitor expenses, set budgets, and achieve your financial goals.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 min-[400px]:flex-row justify-center">
        <Link href="/register">
          <Button size="lg">
            Get Started
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
        <Link href="/login">
          <Button variant="outline" size="lg">
            Sign In
          </Button>
        </Link>
      </div>
    </div>
  )
}
