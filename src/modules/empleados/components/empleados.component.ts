import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { EmployeeServiceService } from '../services/employee-service.service';
import { Employee } from '../models/models';
import { EmployeeUpdate } from '../models/update';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-empleados',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './empleados.component.html',
  styleUrls: ['./empleados.component.scss']
})
export class EmpleadosComponent implements OnInit {
  employeesActive: Employee[] = [];
  employeesInactive: Employee[] = [];
  showInactive: boolean = false; // Estado del checkbox
  employeeToEdit: EmployeeUpdate = {} as EmployeeUpdate;
  dni: string = '';

  constructor(private employeeService: EmployeeServiceService) { }

  ngOnInit(): void {
    this.getEmployees();
  }

  getEmployees(): void {
    if (this.showInactive) {
      this.employeeService.getInactiveEmployees().subscribe({
        next: (data: Employee[]) => {
          this.employeesInactive = data; // Cargar empleados inactivos
        },
        error: (err) => {
          console.error('Error al obtener empleados inactivos:', err);
        }
      });
    } else {
      this.employeeService.getActiveEmployees().subscribe({
        next: (data: Employee[]) => {
          this.employeesActive = data; // Cargar empleados activos
        },
        error: (err) => {
          console.error('Error al obtener empleados activos:', err);
        }
      });
    }
  }

  toggleEmployeeList(): void {
    this.showInactive = !this.showInactive;
    this.getEmployees();
  }

  addEmployeeByDni(dni: string): void {
    this.employeeService.fetchAndSaveEmployeeByDni(dni).subscribe({
      next: (employee) => {
        console.log('Empleado agregado exitosamente:', employee);
        this.showInactive = false;
        this.getEmployees();
        this.resetForm(); 
      },
      error: (err) => {
        console.error('Error al agregar empleado:', err);
      }
    });
  }

  dataEmployee(employee: Employee): void {
    this.employeeToEdit = {
      id: employee.id,
      dni: employee.dni,
      nombres: employee.nombres,
      apellidoPaterno: employee.apellidoPaterno,
      apellidoMaterno: employee.apellidoMaterno
    };
  }

  updateEmployee(id: number, newDni: string): void {
    this.employeeService.updateEmployee(id, newDni).subscribe({
      next: (updatedEmployee) => {
        console.log('Empleado actualizado exitosamente:', updatedEmployee);
        this.showInactive = false;
        this.getEmployees();
        this.resetForm(); 
      },
      error: (err) => {
        console.error('Error al actualizar empleado:', err);
      },
    });
  }

  deactivateEmployee(id: number): void {
    console.log(`Desactivando empleado con ID: ${id}`);
    this.employeeService.deactivateEmployee(id).subscribe({
      next: (data) => {
        console.log('Respuesta del servidor:', data);
        this.getEmployees(); 
      },
      error: (err) => {
        console.error('Error al desactivar empleado:', err);
        console.error('Detalles del error:', err.error);
      }
    });
  }

  reactivateEmployee(id: number): void {
    console.log(`Reactivando empleado con ID: ${id}`);
    this.employeeService.reactivateEmployee(id).subscribe({
      next: (data) => {
        console.log('Empleado reactivado:', data);
        this.getEmployees();
      },
      error: (err) => {
        console.error('Error al reactivar empleado:', err);
        console.error('Detalles del error:', err.error);
      }
    });
  }

  resetForm(): void {
    this.dni = '';
    this.employeeToEdit = {} as EmployeeUpdate;
  }
  
}
