'use client'

import { useEffect } from 'react'
import { CheckCircle, AlertCircle, X } from 'lucide-react'

interface ToastProps {
  type: 'success' | 'error' | 'info'
  message: string
  visible: boolean
  duration?: number
  onClose?: () => void
}

export default function Toast({ type, message, visible, duration = 3000, onClose }: ToastProps) {
  useEffect(() => {
    if (!visible) return

    const t = setTimeout(() => {
      onClose?.()
    }, duration)

    return () => clearTimeout(t)
  }, [visible, duration, onClose])

  if (!visible) return null

  const bg =
    type === 'success'
      ? 'bg-green-500/20 border-green-500/30 text-green-400'
      : type === 'error'
      ? 'bg-red-500/20 border-red-500/30 text-red-400'
      : 'bg-white/10 border-white/20 text-white'

  const Icon = type === 'success' ? CheckCircle : type === 'error' ? AlertCircle : CheckCircle

  return (
    <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-2 duration-300">
      <div className={`backdrop-blur-xl rounded-lg p-4 flex items-center gap-3 shadow-lg border ${bg}`}>
        <Icon className="w-5 h-5" />
        <p className="text-white font-medium">{message}</p>
        <button
          aria-label="Close toast"
          onClick={() => onClose?.()}
          className="ml-2 text-white/60 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
