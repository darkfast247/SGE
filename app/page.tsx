"use client"

import { useState, useEffect } from "react"
import { Users, UserPlus, Search, MoreHorizontal, Edit, Trash2, Eye, LogOut, BarChart3 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useEmployees } from "@/contexts/employee-context"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/hooks/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { MiniCharts } from "@/components/charts/mini-charts"
import { FadeIn } from "@/components/animations/fade-in"
import { StaggerContainer, StaggerItem } from "@/components/animations/stagger-container"
import { AnimatedCounter } from "@/components/animations/animated-counter"

export default function Dashboard() {
  const [searchTerm, setSearchTerm] = useState("")
  const [departmentFilter, setDepartmentFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [employeeToDelete, setEmployeeToDelete] = useState<string | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  const { employees, deleteEmployee } = useEmployees()
  const { user, logout } = useAuth()
  const { toast } = useToast()
  const router = useRouter()

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!user) {
      router.push("/login")
    } else {
      // Simulate loading time for animation
      setTimeout(() => setIsLoaded(true), 500)
    }
  }, [user, router])

  if (!user || !isLoaded) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"
          />
          <p className="text-gray-600">Cargando dashboard...</p>
        </motion.div>
      </div>
    )
  }

  const filteredEmployees = employees.filter((employee) => {
    const fullName = `${employee.firstName} ${employee.lastName}`
    const matchesSearch =
      fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.position.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesDepartment = departmentFilter === "all" || employee.department === departmentFilter
    const matchesStatus = statusFilter === "all" || employee.status === statusFilter

    return matchesSearch && matchesDepartment && matchesStatus
  })

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

  const handleDeleteClick = (employeeId: string) => {
    setEmployeeToDelete(employeeId)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = () => {
    if (employeeToDelete) {
      const employee = employees.find((emp) => emp.id === employeeToDelete)
      deleteEmployee(employeeToDelete)
      toast({
        title: "Empleado eliminado",
        description: `${employee?.firstName} ${employee?.lastName} ha sido eliminado del sistema.`,
      })
      setDeleteDialogOpen(false)
      setEmployeeToDelete(null)
    }
  }

  const handleLogout = () => {
    logout()
    toast({
      title: "Sesión cerrada",
      description: "Has cerrado sesión exitosamente",
    })
    router.push("/login")
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gray-50"
    >
      {/* Header */}
      <motion.header
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="bg-white shadow-sm border-b"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <motion.div
              className="flex items-center"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 2, delay: 0.5 }}
                className="h-8 w-8 text-blue-600 mr-3"
              >
                <Users className="h-8 w-8" />
              </motion.div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Gestión de Empleados</h1>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="text-sm text-gray-500"
                >
                  Bienvenido, {user.name}
                </motion.p>
              </div>
            </motion.div>
            <motion.div
              className="flex items-center gap-4"
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link href="/analytics">
                  <Button variant="outline">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Analytics
                  </Button>
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link href="/employee/new">
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Nuevo Empleado
                  </Button>
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button variant="outline" onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Cerrar Sesión
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StaggerItem>
            <motion.div whileHover={{ scale: 1.05, y: -5 }} transition={{ type: "spring", stiffness: 300 }}>
              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Empleados</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    <AnimatedCounter value={employees.length} />
                  </div>
                  <p className="text-xs text-muted-foreground">Empleados registrados</p>
                </CardContent>
              </Card>
            </motion.div>
          </StaggerItem>

          <StaggerItem>
            <motion.div whileHover={{ scale: 1.05, y: -5 }} transition={{ type: "spring", stiffness: 300 }}>
              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Empleados Activos</CardTitle>
                  <motion.div
                    className="h-4 w-4 bg-green-500 rounded-full"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                  />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    <AnimatedCounter value={employees.filter((e) => e.status === "Activo").length} />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    <AnimatedCounter
                      value={
                        employees.length > 0
                          ? Math.round((employees.filter((e) => e.status === "Activo").length / employees.length) * 100)
                          : 0
                      }
                      suffix="% del total"
                    />
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </StaggerItem>

          <StaggerItem>
            <motion.div whileHover={{ scale: 1.05, y: -5 }} transition={{ type: "spring", stiffness: 300 }}>
              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Departamentos</CardTitle>
                  <motion.div
                    className="h-4 w-4 bg-blue-500 rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                  />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    <AnimatedCounter value={new Set(employees.map((e) => e.department)).size} />
                  </div>
                  <p className="text-xs text-muted-foreground">Áreas de trabajo</p>
                </CardContent>
              </Card>
            </motion.div>
          </StaggerItem>

          <StaggerItem>
            <motion.div whileHover={{ scale: 1.05, y: -5 }} transition={{ type: "spring", stiffness: 300 }}>
              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">En Vacaciones</CardTitle>
                  <motion.div
                    className="h-4 w-4 bg-yellow-500 rounded-full"
                    animate={{ opacity: [1, 0.5, 1] }}
                    transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
                  />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    <AnimatedCounter value={employees.filter((e) => e.status === "Vacaciones").length} />
                  </div>
                  <p className="text-xs text-muted-foreground">Empleados ausentes</p>
                </CardContent>
              </Card>
            </motion.div>
          </StaggerItem>
        </StaggerContainer>

        {/* Mini Charts */}
        <FadeIn delay={0.6}>
          <MiniCharts />
        </FadeIn>

        {/* Filters and Search */}
        <FadeIn delay={0.8}>
          <motion.div whileHover={{ scale: 1.01 }} transition={{ type: "spring", stiffness: 300 }}>
            <Card className="mb-6 hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <CardTitle>Lista de Empleados</CardTitle>
                <CardDescription>Gestiona y supervisa a tu equipo de trabajo</CardDescription>
              </CardHeader>
              <CardContent>
                <motion.div
                  className="flex flex-col sm:flex-row gap-4 mb-6"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 1 }}
                >
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <motion.div whileFocus={{ scale: 1.02 }}>
                        <Input
                          placeholder="Buscar empleados..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10 transition-all duration-300 focus:ring-2 focus:ring-blue-500"
                        />
                      </motion.div>
                    </div>
                  </div>

                  <motion.div whileHover={{ scale: 1.02 }}>
                    <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                      <SelectTrigger className="w-full sm:w-[180px]">
                        <SelectValue placeholder="Departamento" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos los departamentos</SelectItem>
                        <SelectItem value="Tecnología">Tecnología</SelectItem>
                        <SelectItem value="Diseño">Diseño</SelectItem>
                        <SelectItem value="Gestión">Gestión</SelectItem>
                        <SelectItem value="Marketing">Marketing</SelectItem>
                        <SelectItem value="Ventas">Ventas</SelectItem>
                        <SelectItem value="Recursos Humanos">Recursos Humanos</SelectItem>
                        <SelectItem value="Finanzas">Finanzas</SelectItem>
                      </SelectContent>
                    </Select>
                  </motion.div>

                  <motion.div whileHover={{ scale: 1.02 }}>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-full sm:w-[180px]">
                        <SelectValue placeholder="Estado" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos los estados</SelectItem>
                        <SelectItem value="Activo">Activo</SelectItem>
                        <SelectItem value="Vacaciones">Vacaciones</SelectItem>
                        <SelectItem value="Licencia">Licencia</SelectItem>
                        <SelectItem value="Inactivo">Inactivo</SelectItem>
                      </SelectContent>
                    </Select>
                  </motion.div>
                </motion.div>

                {/* Employee Table */}
                <motion.div
                  className="rounded-md border"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 1.2 }}
                >
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Empleado</TableHead>
                        <TableHead>Posición</TableHead>
                        <TableHead>Departamento</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead>Fecha de Ingreso</TableHead>
                        <TableHead>Salario</TableHead>
                        <TableHead className="text-right">Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredEmployees.map((employee, index) => (
                        <motion.tr
                          key={employee.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 1.4 + index * 0.1 }}
                          className="hover:bg-gray-50 transition-colors duration-200"
                        >
                          <TableCell>
                            <div>
                              <div className="font-medium">
                                {employee.firstName} {employee.lastName}
                              </div>
                              <div className="text-sm text-muted-foreground">{employee.email}</div>
                            </div>
                          </TableCell>
                          <TableCell>{employee.position}</TableCell>
                          <TableCell>{employee.department}</TableCell>
                          <TableCell>{getStatusBadge(employee.status)}</TableCell>
                          <TableCell>{employee.hireDate}</TableCell>
                          <TableCell>${employee.salary}</TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                  <Button variant="ghost" className="h-8 w-8 p-0">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </motion.div>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => router.push(`/employee/${employee.id}`)}>
                                  <Eye className="mr-2 h-4 w-4" />
                                  Ver detalles
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => router.push(`/employee/${employee.id}/edit`)}>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Editar
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="text-red-600"
                                  onClick={() => handleDeleteClick(employee.id)}
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Eliminar
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </motion.tr>
                      ))}
                    </TableBody>
                  </Table>
                </motion.div>

                {filteredEmployees.length === 0 && (
                  <motion.div
                    className="text-center py-8"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.5 }}
                  >
                    <Users className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No se encontraron empleados</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Intenta ajustar los filtros o agregar un nuevo empleado.
                    </p>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </FadeIn>
      </main>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará permanentemente el registro del empleado del sistema.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-red-600 hover:bg-red-700">
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  )
}
