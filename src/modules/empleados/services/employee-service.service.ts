import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Employee } from '../models/models';
import { EmployeeInsert } from '../models/insert';
import { EmployeeUpdate } from '../models/update';


@Injectable({
  providedIn: 'root',
})
export class EmployeeServiceService {
  private apiUrl = 'https://jubilant-memory-j6xgj6qw9qp3qgrw-8080.app.github.dev/api/reniec';

  constructor(private http: HttpClient) { }

  getActiveEmployees(): Observable<Employee[]> {
    return this.http.get<Employee[]>(`${this.apiUrl}/active`);
  }

  getInactiveEmployees(): Observable<any> {
    return this.http.get(`${this.apiUrl}/inactive`);
  }

  fetchAndSaveEmployeeByDni(dni: string): Observable<EmployeeInsert> {
    return this.http.get<EmployeeInsert>(`${this.apiUrl}/${dni}`);
  }

  updateEmployee(id: number, newDni: string): Observable<EmployeeUpdate> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.put<EmployeeUpdate>(url, null, { params: { newDni } });
  }

  deactivateEmployee(id: number): Observable<string> {
    return this.http.delete<string>(`${this.apiUrl}/${id}`);
  }

  reactivateEmployee(id: number): Observable<string> {
    return this.http.put<string>(`${this.apiUrl}/restore/${id}`, {}, { responseType: 'text' as 'json' });
  }

}
