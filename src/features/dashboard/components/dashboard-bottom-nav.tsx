'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  CreditCard,
  LayoutDashboard,
  PieChart,
  Tag,
  BarChart3,
} from "lucide-react";

interface NavLink {
  icon: React.ElementType
  label: string
  href: string
  children?: NavLink[]
}

const mainLinks: NavLink[] = [
  {
    icon: LayoutDashboard,
    label: "Overview",
    href: "/dashboard",
  },
  {
    icon: CreditCard,
    label: "Transactions",
    href: "/transactions",
  },
  {
    icon: Tag,
    label: "Categories",
    href: "/categories",
  },
  {
    icon: PieChart,
    label: "Budgets",
    href: "/budgets",
  },
  {
    icon: BarChart3,
    label: "Reports",
    href: "/reports",
  },
];

export function DashboardBottomNav() {
  const pathname = usePathname()

  const renderLink = (link: NavLink) => {
    const isActive = pathname === link.href
    const Icon = link.icon

    return (
      <Link
        key={link.href}
        href={link.href}
        className={cn(
          'flex flex-col items-center justify-center gap-1 py-2 text-xs font-medium text-muted-foreground transition-colors hover:text-primary',
          isActive && 'text-primary',
        )}
      >
        <Icon className="h-5 w-5" />
        <span>{link.label}</span>
      </Link>
    )
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 h-16 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:hidden">
      <nav className="container h-full grid grid-cols-5 items-center">
        {mainLinks.map((link) => renderLink(link))}
      </nav>
    </div>
  );
}
