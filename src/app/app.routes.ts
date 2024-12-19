// app.routes.ts
import { Routes } from '@angular/router';

import { EmpleadosComponent } from '../modules/empleados/components/empleados.component';
import { DashboardComponent } from './slayer/dashboard.component';


export const routes: Routes = [
  {
    path: '',
    component: DashboardComponent, 
    children: [
      { path: 'empleados', component: EmpleadosComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },
  { path: '**', redirectTo: '' }
];
