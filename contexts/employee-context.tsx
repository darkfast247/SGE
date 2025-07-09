"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

export interface Employee {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  position: string
  department: string
  salary: string
  hireDate: string
  status: string
  address: string
  emergencyContact: string
  emergencyPhone: string
  notes: string
}

interface EmployeeContextType {
  employees: Employee[]
  addEmployee: (employee: Omit<Employee, "id">) => void
  updateEmployee: (id: string, employee: Partial<Employee>) => void
  deleteEmployee: (id: string) => void
  getEmployee: (id: string) => Employee | undefined
}

const EmployeeContext = createContext<EmployeeContextType | undefined>(undefined)

// Datos iniciales de ejemplo
const INITIAL_EMPLOYEES: Employee[] = [
  {
    id: "1",
    firstName: "Ana",
    lastName: "García",
    email: "ana.garcia@empresa.com",
    phone: "+1 (555) 123-4567",
    position: "Desarrolladora Frontend",
    department: "Tecnología",
    salary: "45000",
    hireDate: "2023-01-15",
    status: "Activo",
    address: "123 Main Street, Ciudad, Estado 12345",
    emergencyContact: "Carlos García",
    emergencyPhone: "+1 (555) 987-6543",
    notes: "Especialista en React y TypeScript. Excelente trabajo en equipo y comunicación.",
  },
  {
    id: "2",
    firstName: "Carlos",
    lastName: "Rodríguez",
    email: "carlos.rodriguez@empresa.com",
    phone: "+1 (555) 234-5678",
    position: "Diseñador UX/UI",
    department: "Diseño",
    salary: "42000",
    hireDate: "2023-03-20",
    status: "Activo",
    address: "456 Oak Avenue, Ciudad, Estado 12345",
    emergencyContact: "María Rodríguez",
    emergencyPhone: "+1 (555) 876-5432",
    notes: "Experto en diseño de interfaces y experiencia de usuario.",
  },
  {
    id: "3",
    firstName: "María",
    lastName: "López",
    email: "maria.lopez@empresa.com",
    phone: "+1 (555) 345-6789",
    position: "Gerente de Proyecto",
    department: "Gestión",
    salary: "55000",
    hireDate: "2022-08-10",
    status: "Vacaciones",
    address: "789 Pine Street, Ciudad, Estado 12345",
    emergencyContact: "Juan López",
    emergencyPhone: "+1 (555) 765-4321",
    notes: "Líder experimentada con excelentes habilidades de gestión de proyectos.",
  },
]

export function EmployeeProvider({ children }: { children: React.ReactNode }) {
  const [employees, setEmployees] = useState<Employee[]>([])

  useEffect(() => {
    // Cargar empleados desde localStorage o usar datos iniciales
    const savedEmployees = localStorage.getItem("employees")
    if (savedEmployees) {
      setEmployees(JSON.parse(savedEmployees))
    } else {
      setEmployees(INITIAL_EMPLOYEES)
      localStorage.setItem("employees", JSON.stringify(INITIAL_EMPLOYEES))
    }
  }, [])

  const saveToStorage = (newEmployees: Employee[]) => {
    localStorage.setItem("employees", JSON.stringify(newEmployees))
  }

  const addEmployee = (employeeData: Omit<Employee, "id">) => {
    const newEmployee: Employee = {
      ...employeeData,
      id: Date.now().toString(), // Simple ID generation
    }
    const updatedEmployees = [...employees, newEmployee]
    setEmployees(updatedEmployees)
    saveToStorage(updatedEmployees)
  }

  const updateEmployee = (id: string, employeeData: Partial<Employee>) => {
    const updatedEmployees = employees.map((emp) => (emp.id === id ? { ...emp, ...employeeData } : emp))
    setEmployees(updatedEmployees)
    saveToStorage(updatedEmployees)
  }

  const deleteEmployee = (id: string) => {
    const updatedEmployees = employees.filter((emp) => emp.id !== id)
    setEmployees(updatedEmployees)
    saveToStorage(updatedEmployees)
  }

  const getEmployee = (id: string) => {
    return employees.find((emp) => emp.id === id)
  }

  return (
    <EmployeeContext.Provider
      value={{
        employees,
        addEmployee,
        updateEmployee,
        deleteEmployee,
        getEmployee,
      }}
    >
      {children}
    </EmployeeContext.Provider>
  )
}

export function useEmployees() {
  const context = useContext(EmployeeContext)
  if (context === undefined) {
    throw new Error("useEmployees must be used within an EmployeeProvider")
  }
  return context
}
