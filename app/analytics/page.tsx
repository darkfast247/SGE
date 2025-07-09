"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, BarChart3, TrendingUp, Users, PieChart } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/contexts/auth-context"
import { useEmployees } from "@/contexts/employee-context"
import { EmployeeCharts } from "@/components/charts/employee-charts"

export default function AnalyticsPage() {
  const { user } = useAuth()
  const { employees } = useEmployees()
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.push("/login")
    }
  }, [user, router])

  if (!user) {
    return null
  }

  // Calcular estadísticas adicionales
  const totalSalary = employees.reduce((sum, emp) => sum + (Number.parseFloat(emp.salary) || 0), 0)
  const averageSalary = employees.length > 0 ? totalSalary / employees.length : 0
  const departmentCount = new Set(employees.map((emp) => emp.department)).size
  const activeEmployees = employees.filter((emp) => emp.status === "Activo").length

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-6">
            <Link href="/">
              <Button variant="ghost" size="sm" className="mr-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver al Dashboard
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Analytics y Reportes</h1>
              <p className="text-sm text-gray-500">Análisis detallado de datos de empleados</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Estadísticas Generales */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Empleados</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{employees.length}</div>
              <p className="text-xs text-muted-foreground">Empleados registrados</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Empleados Activos</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeEmployees}</div>
              <p className="text-xs text-muted-foreground">
                {employees.length > 0 ? Math.round((activeEmployees / employees.length) * 100) : 0}% del total
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Salario Promedio</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${averageSalary.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Promedio anual</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Departamentos</CardTitle>
              <PieChart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{departmentCount}</div>
              <p className="text-xs text-muted-foreground">Áreas activas</p>
            </CardContent>
          </Card>
        </div>

        {/* Gráficos */}
        <EmployeeCharts />
      </main>
    </div>
  )
}
