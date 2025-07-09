"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Lock, Mail, Users } from "lucide-react"
import { motion } from "framer-motion"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/hooks/use-toast"
import { FadeIn } from "@/components/animations/fade-in"
import { LoadingSpinner } from "@/components/animations/loading-spinner"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})

  const { login, isLoading } = useAuth()
  const { toast } = useToast()
  const router = useRouter()

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {}

    if (!email) {
      newErrors.email = "El email es requerido"
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "El email no es válido"
    }

    if (!password) {
      newErrors.password = "La contraseña es requerida"
    } else if (password.length < 6) {
      newErrors.password = "La contraseña debe tener al menos 6 caracteres"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    const success = await login(email, password)

    if (success) {
      toast({
        title: "Inicio de sesión exitoso",
        description: "Bienvenido al sistema de gestión de empleados",
      })
      router.push("/")
    } else {
      toast({
        title: "Error de autenticación",
        description: "Email o contraseña incorrectos",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <motion.div
        className="absolute top-10 left-10 w-20 h-20 bg-blue-200 rounded-full opacity-20"
        animate={{
          y: [0, -20, 0],
          x: [0, 10, 0],
        }}
        transition={{
          duration: 6,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute top-1/4 right-20 w-16 h-16 bg-purple-200 rounded-full opacity-20"
        animate={{
          y: [0, 15, 0],
          x: [0, -15, 0],
        }}
        transition={{
          duration: 8,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-20 left-1/4 w-12 h-12 bg-indigo-200 rounded-full opacity-20"
        animate={{
          y: [0, -10, 0],
          x: [0, 20, 0],
        }}
        transition={{
          duration: 7,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />

      <FadeIn delay={0.2} duration={0.8}>
        <motion.div whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 300, damping: 30 }}>
          <Card className="w-full max-w-md shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="text-center">
              <motion.div
                className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-600"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                <Users className="h-8 w-8 text-white" />
              </motion.div>
              <FadeIn delay={0.4}>
                <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Iniciar Sesión
                </CardTitle>
              </FadeIn>
              <FadeIn delay={0.6}>
                <CardDescription className="text-gray-600">Accede al sistema de gestión de empleados</CardDescription>
              </FadeIn>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <FadeIn delay={0.8}>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-gray-700 font-medium">
                      Email
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <motion.div whileFocus={{ scale: 1.02 }}>
                        <Input
                          id="email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="tu@empresa.com"
                          className={`pl-10 transition-all duration-300 ${
                            errors.email
                              ? "border-red-500 focus:border-red-500"
                              : "focus:border-blue-500 focus:ring-blue-500"
                          }`}
                        />
                      </motion.div>
                    </div>
                    {errors.email && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-sm text-red-500"
                      >
                        {errors.email}
                      </motion.p>
                    )}
                  </div>
                </FadeIn>

                <FadeIn delay={1.0}>
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-gray-700 font-medium">
                      Contraseña
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <motion.div whileFocus={{ scale: 1.02 }}>
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••"
                          className={`pl-10 pr-10 transition-all duration-300 ${
                            errors.password
                              ? "border-red-500 focus:border-red-500"
                              : "focus:border-blue-500 focus:ring-blue-500"
                          }`}
                        />
                      </motion.div>
                      <motion.button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </motion.button>
                    </div>
                    {errors.password && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-sm text-red-500"
                      >
                        {errors.password}
                      </motion.p>
                    )}
                  </div>
                </FadeIn>

                <FadeIn delay={1.2}>
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <LoadingSpinner size={16} />
                          <span className="ml-2">Iniciando sesión...</span>
                        </>
                      ) : (
                        "Iniciar Sesión"
                      )}
                    </Button>
                  </motion.div>
                </FadeIn>
              </form>

              <FadeIn delay={1.4}>
                <motion.div
                  className="mt-6 p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg border"
                  whileHover={{ scale: 1.02 }}
                >
                  <p className="text-sm font-medium text-gray-700 mb-2">Usuarios de prueba:</p>
                  <div className="space-y-1 text-xs text-gray-600">
                    <motion.p whileHover={{ x: 5 }} className="transition-transform">
                      <strong>Admin:</strong> admin@empresa.com / admin123
                    </motion.p>
                    <motion.p whileHover={{ x: 5 }} className="transition-transform">
                      <strong>Líder:</strong> lider@empresa.com / lider123
                    </motion.p>
                  </div>
                </motion.div>
              </FadeIn>
            </CardContent>
          </Card>
        </motion.div>
      </FadeIn>
    </div>
  )
}
