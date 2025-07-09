"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useEmployees } from "@/contexts/employee-context"
import { motion } from "framer-motion"

const MINI_COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"]

export function MiniCharts() {
  const { employees } = useEmployees()

  console.log("🔍 Mini Charts - Empleados:", employees.length)

  // Datos para mini gráfico por estado
  const statusData = employees.reduce((acc: any[], employee) => {
    const status = employee.status || "Sin Estado"
    const existing = acc.find((item) => item.name === status)
    if (existing) {
      existing.value += 1
    } else {
      acc.push({ name: status, value: 1 })
    }
    return acc
  }, [])

  // Datos para mini gráfico por departamento
  const departmentData = employees
    .reduce((acc: any[], employee) => {
      const dept = employee.department || "Sin Departamento"
      const existing = acc.find((item) => item.name === dept)
      if (existing) {
        existing.value += 1
      } else {
        acc.push({ name: dept, value: 1 })
      }
      return acc
    }, [])
    .slice(0, 5) // Solo top 5

  if (employees.length === 0) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-4">
              <p className="text-gray-500">📊 Sin datos para gráficos</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      {/* Mini gráfico de estados */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        whileHover={{ scale: 1.02 }}
      >
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              Distribución por Estado
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {statusData.map((item, index) => {
                const maxValue = Math.max(...statusData.map((d) => d.value))
                const percentage = ((item.value / employees.length) * 100).toFixed(1)

                return (
                  <motion.div
                    key={index}
                    className="flex items-center space-x-3"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                  >
                    <div className="w-16 text-xs font-medium">{item.name}</div>
                    <div className="flex-1 bg-gray-200 rounded-full h-4 relative overflow-hidden">
                      <motion.div
                        className="h-4 rounded-full flex items-center justify-end pr-1"
                        style={{ backgroundColor: MINI_COLORS[index % MINI_COLORS.length] }}
                        initial={{ width: 0 }}
                        animate={{ width: `${(item.value / maxValue) * 100}%` }}
                        transition={{ delay: 0.7 + index * 0.1, duration: 0.8 }}
                      >
                        <span className="text-xs font-bold text-white">{item.value}</span>
                      </motion.div>
                    </div>
                    <div className="text-xs text-gray-600 w-12 text-right">{percentage}%</div>
                  </motion.div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Mini gráfico de departamentos */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        whileHover={{ scale: 1.02 }}
      >
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              Top Departamentos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {departmentData.map((item, index) => {
                const maxValue = Math.max(...departmentData.map((d) => d.value))
                const percentage = ((item.value / employees.length) * 100).toFixed(1)

                return (
                  <motion.div
                    key={index}
                    className="flex items-center space-x-3"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + index * 0.1 }}
                  >
                    <div className="w-20 text-xs font-medium truncate">{item.name}</div>
                    <div className="flex-1 bg-gray-200 rounded-full h-4 relative overflow-hidden">
                      <motion.div
                        className="h-4 rounded-full flex items-center justify-end pr-1"
                        style={{ backgroundColor: MINI_COLORS[index % MINI_COLORS.length] }}
                        initial={{ width: 0 }}
                        animate={{ width: `${(item.value / maxValue) * 100}%` }}
                        transition={{ delay: 0.9 + index * 0.1, duration: 0.8 }}
                      >
                        <span className="text-xs font-bold text-white">{item.value}</span>
                      </motion.div>
                    </div>
                    <div className="text-xs text-gray-600 w-12 text-right">{percentage}%</div>
                  </motion.div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
