import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ModeToggle } from '@/components/common/mode-toggle'

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-bold text-xl">Money Tracker</span>
          </Link>
          <div className="hidden md:flex gap-6">
            <Link 
              href="#features" 
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              Features
            </Link>
            <Link 
              href="#pricing" 
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              Pricing
            </Link>
            <Link 
              href="#about" 
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              About
            </Link>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <ModeToggle />
          <div className="hidden sm:flex gap-4">
            <Link href="/login">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/register">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>
    </header>
  )
}
