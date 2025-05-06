// src/app/loading.tsx
export default function GlobalLoading() {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="inline-flex flex-col items-center gap-4">
          {/* Spinner */}
          <svg
            className="animate-spin h-10 w-10 text-primary"
            viewBox="0 0 24 24"
            fill="none"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            />
          </svg>
  
          <p className="text-sm text-muted-foreground">
            Cargando contenido…
          </p>
        </div>
      </div>
    )
  }
  