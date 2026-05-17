interface SectionTitleProps {
  children: React.ReactNode  // main title text
  accent?: string            // optional last line in gold — omit for plain title
  className?: string
}

export function SectionTitle({
  children,
  accent,
  className = '' 
}: SectionTitleProps) {
  return (
    <h2 className={`section-title t-h2 ao-animate ${className}`.trim()}>
      {children}
      {accent && (
        <>
          <br />
          <span className="t-accent">{accent}</span>
        </>
      )}
    </h2>
  )
}
