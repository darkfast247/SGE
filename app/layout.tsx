import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from "@/contexts/auth-context"
import { EmployeeProvider } from "@/contexts/employee-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Gestión de Empleados - Panel de Administración",
  description: "Plataforma para que líderes gestionen sus equipos de trabajo",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <AuthProvider>
          <EmployeeProvider>
            {children}
            <Toaster />
          </EmployeeProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
