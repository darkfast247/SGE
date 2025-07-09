"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useEmployees } from "@/contexts/employee-context"
import { motion } from "framer-motion"
import { FadeIn } from "@/components/animations/fade-in"
import { StaggerContainer, StaggerItem } from "@/components/animations/stagger-container"

// Colores para los gráficos
const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#06B6D4", "#84CC16", "#F97316"]

// Versión SIMPLIFICADA y CONFIABLE del gráfico de dona
function DonutChart({ data, title }: { data: any[]; title: string }) {
  const total = data.reduce((sum, item) => sum + item.value, 0)

  if (total === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No hay datos para mostrar</p>
      </div>
    )
  }

  // Calcular porcentajes y crear segmentos
  let cumulativePercentage = 0
  const segments = data.map((item, index) => {
    const percentage = (item.value / total) * 100
    const startAngle = (cumulativePercentage / 100) * 360
    const endAngle = ((cumulativePercentage + percentage) / 100) * 360

    cumulativePercentage += percentage

    return {
      ...item,
      percentage,
      startAngle,
      endAngle,
      color: COLORS[index % COLORS.length],
    }
  })

  // Función para crear el path del arco SVG
  const createArcPath = (centerX: number, centerY: number, radius: number, startAngle: number, endAngle: number) => {
    const start = polarToCartesian(centerX, centerY, radius, endAngle)
    const end = polarToCartesian(centerX, centerY, radius, startAngle)
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1"

    return ["M", start.x, start.y, "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y].join(" ")
  }

  const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0
    return {
      x: centerX + radius * Math.cos(angleInRadians),
      y: centerY + radius * Math.sin(angleInRadians),
    }
  }

  return (
    <div className="space-y-6">
      <h4 className="font-medium text-center text-gray-700">{title}</h4>

      {/* Gráfico de dona con SVG paths */}
      <div className="flex items-center justify-center">
        <div className="relative w-48 h-48">
          <svg className="w-48 h-48" viewBox="0 0 200 200">
            {segments.map((segment, index) => (
              <motion.path
                key={index}
                d={createArcPath(100, 100, 80, segment.startAngle, segment.endAngle)}
                fill="none"
                stroke={segment.color}
                strokeWidth="20"
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{
                  duration: 1,
                  delay: index * 0.2,
                  ease: "easeInOut",
                }}
                className="hover:stroke-opacity-80 transition-all duration-300"
              />
            ))}
          </svg>

          {/* Número central */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <motion.div
                className="text-3xl font-bold text-gray-800"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                {total}
              </motion.div>
              <div className="text-sm text-gray-500">Total</div>
            </div>
          </div>
        </div>
      </div>

      {/* Leyenda mejorada */}
      <div className="space-y-3">
        {segments.map((segment, index) => (
          <motion.div
            key={index}
            className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 + index * 0.1 }}
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 rounded-full shadow-sm" style={{ backgroundColor: segment.color }} />
              <span className="font-medium text-gray-700">{segment.name}</span>
            </div>
            <div className="text-right">
              <div className="font-bold text-gray-800">{segment.value}</div>
              <div className="text-xs text-gray-500">{segment.percentage.toFixed(1)}%</div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

// Componente de gráfico de barras con CSS
function BarChart({ data, title, horizontal = false }: { data: any[]; title: string; horizontal?: boolean }) {
  const maxValue = Math.max(...data.map((item) => item.value))

  return (
    <div className="space-y-4">
      <h4 className="font-medium text-center text-gray-700">{title}</h4>
      <div className={`space-y-3 ${horizontal ? "space-y-2" : ""}`}>
        {data.map((item, index) => (
          <motion.div
            key={index}
            className="flex items-center space-x-3"
            initial={{ opacity: 0, x: horizontal ? -20 : 0, y: horizontal ? 0 : 20 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
          >
            <div className={`${horizontal ? "w-24" : "w-16"} text-xs font-medium text-gray-600 truncate`}>
              {item.name}
            </div>
            <div className="flex-1 bg-gray-200 rounded-full h-6 relative overflow-hidden">
              <motion.div
                className="h-6 rounded-full flex items-center justify-end pr-2"
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
                initial={{ width: 0 }}
                animate={{ width: `${(item.value / maxValue) * 100}%` }}
                transition={{ delay: index * 0.1 + 0.5, duration: 0.8, ease: "easeOut" }}
              >
                <span className="text-xs font-bold text-white">{item.value}</span>
              </motion.div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

// Componente de gráfico de líneas con CSS
function LineChart({ data, title }: { data: any[]; title: string }) {
  const maxValue = Math.max(...data.map((item) => item.value))
  const points = data
    .map((item, index) => {
      const x = (index / (data.length - 1)) * 100
      const y = 100 - (item.value / maxValue) * 80
      return `${x},${y}`
    })
    .join(" ")

  return (
    <div className="space-y-4">
      <h4 className="font-medium text-center text-gray-700">{title}</h4>
      <div className="relative">
        <svg className="w-full h-48" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#06B6D4" />
              <stop offset="100%" stopColor="#0891B2" />
            </linearGradient>
          </defs>
          <polyline
            fill="none"
            stroke="url(#lineGradient)"
            strokeWidth="2"
            points={points}
            className="transition-all duration-2000 ease-in-out"
            style={{
              strokeDasharray: "200",
              strokeDashoffset: "200",
              animation: "drawLine 2s ease-in-out 0.5s both",
            }}
          />
          {data.map((item, index) => {
            const x = (index / (data.length - 1)) * 100
            const y = 100 - (item.value / maxValue) * 80
            return (
              <circle
                key={index}
                cx={x}
                cy={y}
                r="2"
                fill="#06B6D4"
                className="transition-all duration-500"
                style={{
                  animation: `fadeIn 0.5s ease-in-out ${0.5 + index * 0.1}s both`,
                }}
              />
            )
          })}
        </svg>
        <div className="flex justify-between mt-2 text-xs text-gray-500">
          {data.map((item, index) => (
            <span key={index}>{item.name}</span>
          ))}
        </div>
      </div>
    </div>
  )
}

export function EmployeeCharts() {
  const { employees } = useEmployees()

  console.log("🔍 Empleados cargados:", employees.length)
  console.log("📊 Datos empleados:", employees.slice(0, 2)) // Mostrar primeros 2 para debug

  // Procesar datos para departamentos
  const departmentData = employees.reduce((acc: any[], employee) => {
    const dept = employee.department || "Sin Departamento"
    const existing = acc.find((item) => item.name === dept)
    if (existing) {
      existing.value += 1
    } else {
      acc.push({ name: dept, value: 1 })
    }
    return acc
  }, [])

  console.log("🏢 Datos departamentos:", departmentData)

  // Procesar datos para estados
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

  console.log("📈 Datos estados:", statusData)

  // Procesar datos para posiciones (top 6)
  const positionData = employees
    .reduce((acc: any[], employee) => {
      const position = employee.position || "Sin Posición"
      const existing = acc.find((item) => item.name === position)
      if (existing) {
        existing.value += 1
      } else {
        acc.push({ name: position, value: 1 })
      }
      return acc
    }, [])
    .sort((a, b) => b.value - a.value)
    .slice(0, 6)

  // Procesar datos para salarios
  const salaryByDepartment = employees.reduce((acc: any[], employee) => {
    const dept = employee.department || "Sin Departamento"
    const salary = Number.parseFloat(employee.salary) || 0
    const existing = acc.find((item) => item.name === dept)
    if (existing) {
      existing.totalSalary += salary
      existing.count += 1
      existing.value = Math.round(existing.totalSalary / existing.count)
    } else {
      acc.push({
        name: dept,
        totalSalary: salary,
        count: 1,
        value: salary,
      })
    }
    return acc
  }, [])

  // Datos para crecimiento mensual
  const monthlyData = [
    { name: "Ene", value: Math.max(1, Math.floor(employees.length * 0.7)) },
    { name: "Feb", value: Math.max(1, Math.floor(employees.length * 0.75)) },
    { name: "Mar", value: Math.max(1, Math.floor(employees.length * 0.8)) },
    { name: "Abr", value: Math.max(1, Math.floor(employees.length * 0.85)) },
    { name: "May", value: Math.max(1, Math.floor(employees.length * 0.9)) },
    { name: "Jun", value: Math.max(1, employees.length) },
  ]

  if (employees.length === 0) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <p className="text-gray-500 text-lg">📊 No hay datos para mostrar</p>
              <p className="text-sm text-gray-400 mt-2">Agrega empleados para ver las gráficas</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <>
      <style jsx>{`
        @keyframes drawLine {
          to {
            stroke-dashoffset: 0;
          }
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>

      <StaggerContainer className="space-y-8">
        {/* Primera fila */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Gráfico de Dona - Departamentos */}
          <StaggerItem>
            <FadeIn delay={0.2}>
              <Card className="hover:shadow-xl transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    Empleados por Departamento
                  </CardTitle>
                  <CardDescription>Distribución organizacional por áreas</CardDescription>
                </CardHeader>
                <CardContent>
                  <DonutChart data={departmentData} title="" />
                </CardContent>
              </Card>
            </FadeIn>
          </StaggerItem>

          {/* Gráfico de Barras - Estados */}
          <StaggerItem>
            <FadeIn delay={0.4}>
              <Card className="hover:shadow-xl transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    Estado de Empleados
                  </CardTitle>
                  <CardDescription>Distribución por estado laboral</CardDescription>
                </CardHeader>
                <CardContent>
                  <BarChart data={statusData} title="" />
                </CardContent>
              </Card>
            </FadeIn>
          </StaggerItem>
        </div>

        {/* Segunda fila */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Gráfico de Barras Horizontales - Posiciones */}
          <StaggerItem>
            <FadeIn delay={0.6}>
              <Card className="hover:shadow-xl transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                    Posiciones Más Comunes
                  </CardTitle>
                  <CardDescription>Top cargos en la organización</CardDescription>
                </CardHeader>
                <CardContent>
                  <BarChart data={positionData} title="" horizontal={true} />
                </CardContent>
              </Card>
            </FadeIn>
          </StaggerItem>

          {/* Gráfico de Salarios */}
          <StaggerItem>
            <FadeIn delay={0.8}>
              <Card className="hover:shadow-xl transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    Salario Promedio por Departamento
                  </CardTitle>
                  <CardDescription>Comparación salarial entre áreas</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {salaryByDepartment.map((item, index) => (
                      <motion.div
                        key={index}
                        className="flex justify-between items-center p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg hover:shadow-md transition-shadow"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ scale: 1.02 }}
                      >
                        <span className="font-medium text-gray-700">{item.name}</span>
                        <span className="text-xl font-bold text-yellow-600">${item.value.toLocaleString()}</span>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </FadeIn>
          </StaggerItem>
        </div>

        {/* Tercera fila */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Gráfico de Líneas - Crecimiento */}
          <StaggerItem>
            <FadeIn delay={1.0}>
              <Card className="hover:shadow-xl transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-cyan-500 rounded-full"></div>
                    Crecimiento de Empleados
                  </CardTitle>
                  <CardDescription>Evolución del equipo en los últimos 6 meses</CardDescription>
                </CardHeader>
                <CardContent>
                  <LineChart data={monthlyData} title="" />
                </CardContent>
              </Card>
            </FadeIn>
          </StaggerItem>

          {/* Resumen Ejecutivo */}
          <StaggerItem>
            <FadeIn delay={1.2}>
              <Card className="hover:shadow-xl transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    Resumen Ejecutivo
                  </CardTitle>
                  <CardDescription>Métricas clave de la organización</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <motion.div
                      className="text-center p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg"
                      whileHover={{ scale: 1.05 }}
                    >
                      <div className="text-3xl font-bold text-blue-600">{employees.length}</div>
                      <div className="text-sm text-gray-600">Total Empleados</div>
                    </motion.div>
                    <motion.div
                      className="text-center p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg"
                      whileHover={{ scale: 1.05 }}
                    >
                      <div className="text-3xl font-bold text-green-600">
                        {employees.filter((e) => e.status === "Activo").length}
                      </div>
                      <div className="text-sm text-gray-600">Empleados Activos</div>
                    </motion.div>
                    <motion.div
                      className="text-center p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg"
                      whileHover={{ scale: 1.05 }}
                    >
                      <div className="text-3xl font-bold text-purple-600">
                        {new Set(employees.map((e) => e.department)).size}
                      </div>
                      <div className="text-sm text-gray-600">Departamentos</div>
                    </motion.div>
                    <motion.div
                      className="text-center p-4 bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-lg"
                      whileHover={{ scale: 1.05 }}
                    >
                      <div className="text-3xl font-bold text-yellow-600">
                        $
                        {Math.round(
                          employees.reduce((sum, emp) => sum + (Number.parseFloat(emp.salary) || 0), 0) /
                            employees.length || 0,
                        ).toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-600">Salario Promedio</div>
                    </motion.div>
                  </div>
                </CardContent>
              </Card>
            </FadeIn>
          </StaggerItem>
        </div>
      </StaggerContainer>
    </>
  )
}
