"use client"

import React, { createContext, useContext, useState, ReactNode } from "react"
import { cn } from "@/lib/utils"
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from "lucide-react"

export type ToastVariant = "default" | "destructive" | "success" | "warning"

interface Toast {
  id: string
  title?: string
  description: string
  variant?: ToastVariant
  duration?: number
}

interface ToastContextType {
  toasts: Toast[]
  addToast: (toast: Omit<Toast, "id">) => void
  removeToast: (id: string) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = (toast: Omit<Toast, "id">) => {
    const id = Math.random().toString(36).substring(2, 9)
    const newToast = { ...toast, id }
    setToasts((prev) => [...prev, newToast])

    // Auto remove after duration
    setTimeout(() => {
      removeToast(id)
    }, toast.duration || 5000)
  }

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider")
  }
  return context
}

function ToastContainer() {
  const { toasts, removeToast } = useToast()

  if (toasts.length === 0) return null

  return (
    <div className="fixed top-0 right-0 z-50 flex flex-col gap-2 p-4 max-w-sm w-full">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          {...toast}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  )
}

interface ToastProps extends Toast {
  onClose: () => void
}

function Toast({ title, description, variant = "default", onClose }: ToastProps) {
  const variantStyles = {
    default: "bg-white border-gray-200 text-gray-900",
    destructive: "bg-red-500 border-red-600 text-white",
    success: "bg-green-500 border-green-600 text-white",
    warning: "bg-yellow-500 border-yellow-600 text-white",
  }

  const icons = {
    default: <Info className="h-4 w-4" />,
    destructive: <AlertCircle className="h-4 w-4" />,
    success: <CheckCircle className="h-4 w-4" />,
    warning: <AlertTriangle className="h-4 w-4" />,
  }

  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-lg border p-4 shadow-lg animate-in slide-in-from-right-full duration-300",
        variantStyles[variant]
      )}
    >
      <div className="flex-shrink-0 mt-0.5">
        {icons[variant]}
      </div>
      <div className="flex-1 space-y-1">
        {title && (
          <p className="text-sm font-semibold">{title}</p>
        )}
        <p className="text-sm">{description}</p>
      </div>
      <button
        onClick={onClose}
        className="flex-shrink-0 rounded-md p-1 transition-colors hover:bg-black/10 focus:outline-none focus:ring-2 focus:ring-black/20"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}
