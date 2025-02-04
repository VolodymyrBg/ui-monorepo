type Props = {
  title: string
  subtitle?: string
}

export const PageTitle = ({ subtitle, title }: Props) => (
  <div className="flex flex-col gap-y-1">
    <h1 className="text-2xl font-medium text-neutral-950">{title}</h1>
    {subtitle && (
      <p className="text-sm font-medium text-neutral-600">{subtitle}</p>
    )}
  </div>
)
