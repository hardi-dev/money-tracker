import { cn } from "@/lib/utils"

interface PageHeaderProps {
  heading: string
  text?: string
  className?: string
}

export function PageHeader({ heading, text, className }: PageHeaderProps) {
  return (
    <div className={cn("space-y-0.5", className)}>
      <h1 className="text-2xl font-bold tracking-tight">{heading}</h1>
      {text && <p className="text-muted-foreground">{text}</p>}
    </div>
  )
}
