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
  icon: React.ElementType
  label: string
  href: string
  children?: SidebarLink[]
}

interface DashboardSidebarProps {
  className?: string
}

const mainLinks: SidebarLink[] = [
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
]

const secondaryLinks: SidebarLink[] = [
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
        href: '/dashboard/settings/api-keys',
      },
    ],
  },
]

export function DashboardSidebar({ className }: DashboardSidebarProps) {
  const pathname = usePathname()

  const renderLink = (link: SidebarLink) => {
    const isActive = pathname === link.href
    const Icon = link.icon

    return (
      <div key={link.href}>
        <Link
          href={link.href}
          className={cn(
            'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground',
            isActive && 'bg-accent text-accent-foreground hover:text-accent-foreground',
          )}
        >
          <Icon className="h-4 w-4" />
          <span>{link.label}</span>
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
                    'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground',
                    isChildActive && 'bg-accent text-accent-foreground hover:text-accent-foreground',
                  )}
                >
                  <ChildIcon className="h-4 w-4" />
                  <span>{childLink.label}</span>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    )
  }

  return (
    <aside className={cn('w-64 bg-background', className)}>
      <nav className="grid items-start gap-2 px-4 py-4">
        {mainLinks.map((link) => renderLink(link))}
        <div className="my-2 border-t" />
        {secondaryLinks.map((link) => renderLink(link))}
      </nav>
    </aside>
  )
}
