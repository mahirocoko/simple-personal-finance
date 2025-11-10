export function LoadingSpinner({ className }: { className?: string } = {}) {
  return (
    <div
      className={`animate-spin rounded-full border-2 border-primary border-t-transparent h-6 w-6 ${className}`}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  )
}
