import { Toaster } from 'sonner'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      {children}
      <Toaster richColors position="top-right" />
    </div>
  )
}
