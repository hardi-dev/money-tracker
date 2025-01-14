interface PageHeaderProps {
  heading: string
  text?: string
}

export function PageHeader({ heading, text }: PageHeaderProps) {
  return (
    <div className="space-y-0.5">
      <h1 className="text-2xl font-bold tracking-tight">{heading}</h1>
      {text && <p className="text-muted-foreground">{text}</p>}
    </div>
  )
}
