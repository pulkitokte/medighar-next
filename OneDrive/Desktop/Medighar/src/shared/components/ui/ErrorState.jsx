import { AlertTriangle } from 'lucide-react'
import Button from '@/shared/components/ui/Button.jsx'

function ErrorState({ title = 'Something went wrong', description, retry }) {
  return (
    <div role="alert" className="flex flex-col items-center gap-4 py-16 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
        <AlertTriangle className="h-8 w-8 text-red-500" aria-hidden="true" />
      </span>

      <div className="flex flex-col items-center gap-1">
        <p className="text-base font-medium text-slate-900 sm:text-lg">{title}</p>
        {description && (
          <p className="max-w-md text-sm text-slate-600 sm:text-base">{description}</p>
        )}
      </div>

      {retry && (
        <Button variant="outline" onClick={retry}>
          Try Again
        </Button>
      )}
    </div>
  )
}

export default ErrorState