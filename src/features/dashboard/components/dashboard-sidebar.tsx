'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  BarChart3,
  CreditCard,
  Key,
  LayoutDashboard,
  PieChart,
  Settings,
  Tag,
} from 'lucide-react'

interface SidebarLink {
  icon: React.ComponentType<{ className?: string }>
  label: string
  href: string
  children?: SidebarLink[]
}

const links: SidebarLink[] = [
  {
    icon: LayoutDashboard,
    label: 'Overview',
    href: '/dashboard',
  },
  {
    icon: CreditCard,
    label: 'Transactions',
    href: '/transactions',
  },
  {
    icon: Tag,
    label: 'Categories',
    href: '/categories',
  },
  {
    icon: PieChart,
    label: 'Budgets',
    href: '/budgets',
  },
  {
    icon: BarChart3,
    label: 'Reports',
    href: '/reports',
  },
  {
    icon: Settings,
    label: 'Settings',
    href: '/settings',
    children: [
      {
        icon: Key,
        label: 'API Keys',
        href: '/settings/api-keys',
      },
    ],
  },
]

interface DashboardSidebarProps {
  className?: string
}

export function DashboardSidebar({ className }: DashboardSidebarProps) {
  const pathname = usePathname()

  return (
    <aside
      className={cn(
        'w-64 bg-background',
        className,
      )}
    >
      <div className="flex h-14 items-center border-b px-6">
        <Link href="/dashboard" className="flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-6 w-6 text-primary"
          >
            <path d="M17 11h1a3 3 0 0 1 0 6h-1" />
            <path d="M9 12v6" />
            <path d="M13 12v6" />
            <path d="M14 7.5c-1 0-1.44.5-3 .5s-2-.5-3-.5-1.72.5-2.5.5a2.5 2.5 0 0 1 0-5c.78 0 1.57.5 2.5.5S9.44 3 11 3s2 .5 3 .5 1.72-.5 2.5-.5a2.5 2.5 0 0 1 0 5c-.78 0-1.5-.5-2.5-.5Z" />
          </svg>
          <span className="text-lg font-semibold">Money Tracker</span>
        </Link>
      </div>
      <nav className="grid items-start gap-2 px-4 py-4">
        {links.map((link) => {
          const Icon = link.icon
          const isActive = pathname === link.href

          return (
            <div key={link.href}>
              <Link
                href={link.href}
                className={cn(
                  'group flex items-center gap-x-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'transparent text-muted-foreground',
                )}
              >
                <Icon className="h-4 w-4" />
                {link.label}
              </Link>
              {link.children && (
                <div className="ml-6 mt-2">
                  {link.children.map((childLink) => {
                    const ChildIcon = childLink.icon
                    const isChildActive = pathname === childLink.href

                    return (
                      <Link
                        key={childLink.href}
                        href={childLink.href}
                        className={cn(
                          'group flex items-center gap-x-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground',
                          isChildActive
                            ? 'bg-primary text-primary-foreground'
                            : 'transparent text-muted-foreground',
                        )}
                      >
                        <ChildIcon className="h-4 w-4" />
                        {childLink.label}
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </nav>
    </aside>
  )
}
