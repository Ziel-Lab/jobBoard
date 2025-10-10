import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { isTokenExpired } from '@/lib/auth-utils'

export function withAuth<P extends object>(
  WrappedComponent: React.ComponentType<P>
) {
  return function WithAuthComponent(props: P) {
    const router = useRouter()
    const [isAuthorized, setIsAuthorized] = useState(false)

    useEffect(() => {
      // Check if we're on client side
      if (typeof window === 'undefined') return

      const token = localStorage.getItem('access_token')
      
      if (!token || isTokenExpired()) {
        router.push('/login')
        return
      }

      setIsAuthorized(true)
    }, [router])

    if (!isAuthorized) {
      return (
        <div className="min-h-screen bg-black flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto mb-4" />
            <p className="text-white/60">Loading...</p>
          </div>
        </div>
      )
    }

    return <WrappedComponent {...props} />
  }
}
