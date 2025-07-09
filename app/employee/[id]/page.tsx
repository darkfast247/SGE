"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Edit, Trash2, Mail, Phone, Calendar, DollarSign, MapPin, User, AlertTriangle } from "lucide-react"
import Link from "next/link"
import { useRouter, useParams } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useEmployees } from "@/contexts/employee-context"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/hooks/use-toast"

export default function EmployeeDetail() {
  const [isDeleting, setIsDeleting] = useState(false)
  const [notFound, setNotFound] = useState(false)

  const router = useRouter()
  const params = useParams()
  const { getEmployee, deleteEmployee } = useEmployees()
  const { user } = useAuth()
  const { toast } = useToast()

  const [employee, setEmployee] = useState<any>(null)

  useEffect(() => {
    if (!user) {
      router.push("/login")
      return
    }

    const employeeId = params.id as string
    const foundEmployee = getEmployee(employeeId)

    if (foundEmployee) {
      setEmployee(foundEmployee)
    } else {
      setNotFound(true)
    }
  }, [params.id, getEmployee, user, router])

  if (!user) {
    return null
  }

  if (notFound) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <h2 className="text-xl font-semibold mb-2">Empleado no encontrado</h2>
            <p className="text-gray-600 mb-4">El empleado que buscas no existe o ha sido eliminado.</p>
            <Link href="/">
              <Button>Volver al Dashboard</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!employee) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Activo":
        return <Badge className="bg-green-100 text-green-800">Activo</Badge>
      case "Vacaciones":
        return <Badge className="bg-blue-100 text-blue-800">Vacaciones</Badge>
      case "Inactivo":
        return <Badge className="bg-red-100 text-red-800">Inactivo</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const handleDelete = async () => {
    setIsDeleting(true)
    // Simulación de eliminación
    setTimeout(() => {
      deleteEmployee(employee.id)
      toast({
        title: "Empleado eliminado",
        description: `${employee.firstName} ${employee.lastName} ha sido eliminado del sistema.`,
      })
      setIsDeleting(false)
      router.push("/")
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center">
              <Link href="/">
                <Button variant="ghost" size="sm" className="mr-4">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Volver
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {employee.firstName} {employee.lastName}
                </h1>
                <p className="text-sm text-gray-500">
                  {employee.position} • {employee.department}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Link href={`/employee/${employee.id}/edit`}>
                <Button variant="outline">
                  <Edit className="h-4 w-4 mr-2" />
                  Editar
                </Button>
              </Link>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Eliminar
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center">
                      <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
                      ¿Estás seguro?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      Esta acción no se puede deshacer. Se eliminará permanentemente el registro de{" "}
                      <strong>
                        {employee.firstName} {employee.lastName}
                      </strong>{" "}
                      del sistema.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDelete}
                      className="bg-red-600 hover:bg-red-700"
                      disabled={isDeleting}
                    >
                      {isDeleting ? "Eliminando..." : "Eliminar"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Columna Principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Información Personal */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Información Personal
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium">Email</p>
                      <p className="text-sm text-gray-600">{employee.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium">Teléfono</p>
                      <p className="text-sm text-gray-600">{employee.phone || "No especificado"}</p>
                    </div>
                  </div>
                </div>
                {employee.address && (
                  <div className="flex items-start space-x-3">
                    <MapPin className="h-4 w-4 text-gray-400 mt-1" />
                    <div>
                      <p className="text-sm font-medium">Dirección</p>
                      <p className="text-sm text-gray-600">{employee.address}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Información Laboral */}
            <Card>
              <CardHeader>
                <CardTitle>Información Laboral</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Posición</p>
                    <p className="text-lg font-semibold">{employee.position}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Departamento</p>
                    <p className="text-lg font-semibold">{employee.department}</p>
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center space-x-3">
                    <DollarSign className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium">Salario</p>
                      <p className="text-sm text-gray-600">${employee.salary}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium">Fecha de Ingreso</p>
                      <p className="text-sm text-gray-600">{employee.hireDate}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Estado</p>
                    <div className="mt-1">{getStatusBadge(employee.status)}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contacto de Emergencia */}
            {(employee.emergencyContact || employee.emergencyPhone) && (
              <Card>
                <CardHeader>
                  <CardTitle>Contacto de Emergencia</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {employee.emergencyContact && (
                      <div>
                        <p className="text-sm font-medium text-gray-500">Nombre</p>
                        <p className="text-lg font-semibold">{employee.emergencyContact}</p>
                      </div>
                    )}
                    {employee.emergencyPhone && (
                      <div className="flex items-center space-x-3">
                        <Phone className="h-4 w-4 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium">Teléfono</p>
                          <p className="text-sm text-gray-600">{employee.emergencyPhone}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Notas */}
            {employee.notes && (
              <Card>
                <CardHeader>
                  <CardTitle>Notas Adicionales</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed">{employee.notes}</p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Avatar y Estado */}
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <User className="h-12 w-12 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold">
                    {employee.firstName} {employee.lastName}
                  </h3>
                  <p className="text-sm text-gray-500 mb-3">{employee.position}</p>
                  {getStatusBadge(employee.status)}
                </div>
              </CardContent>
            </Card>

            {/* Estadísticas Rápidas */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Estadísticas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Tiempo en la empresa</span>
                  <span className="font-semibold">
                    {(() => {
                      const hireDate = new Date(employee.hireDate)
                      const now = new Date()
                      const diffTime = Math.abs(now.getTime() - hireDate.getTime())
                      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
                      const months = Math.floor(diffDays / 30)
                      const years = Math.floor(months / 12)

                      if (years > 0) {
                        return `${years} año${years > 1 ? "s" : ""}, ${months % 12} mes${months % 12 !== 1 ? "es" : ""}`
                      } else {
                        return `${months} mes${months !== 1 ? "es" : ""}`
                      }
                    })()}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Días de vacaciones</span>
                  <span className="font-semibold">15 disponibles</span>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Evaluación</span>
                  <span className="font-semibold text-green-600">Excelente</span>
                </div>
              </CardContent>
            </Card>

            {/* Acciones Rápidas */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Acciones Rápidas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <Mail className="h-4 w-4 mr-2" />
                  Enviar Email
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <Calendar className="h-4 w-4 mr-2" />
                  Programar Reunión
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <User className="h-4 w-4 mr-2" />
                  Ver Historial
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
