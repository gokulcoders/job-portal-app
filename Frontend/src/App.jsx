import { Toaster } from 'sonner'
import AppRoutes from '@/routes/AppRoutes'

export default function App() {
  return (
    <>
      <AppRoutes />
      <Toaster
        position="top-right"
        richColors
        expand
        toastOptions={{
          style: { fontFamily: 'Inter, system-ui, sans-serif', borderRadius: '12px' },
        }}
      />
    </>
  )
}
