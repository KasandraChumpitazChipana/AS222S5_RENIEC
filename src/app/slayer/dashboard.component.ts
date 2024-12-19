import { Component, HostListener, inject, PLATFORM_ID } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLinkActive,
    RouterOutlet,
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  private platformId = inject(PLATFORM_ID);
  isSidebarCollapsed = false;
  isUserMenuOpen = false;
  searchControl = new FormControl('');
  expandedMenus: string[] = [];

  constructor(private router: Router) {
    if (isPlatformBrowser(this.platformId)) {
      this.checkScreenSize();
    }
  }

  @HostListener('window:resize')
  checkScreenSize() {
    if (isPlatformBrowser(this.platformId)) {
      this.isSidebarCollapsed = window.innerWidth < 768;
    }
  }

  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  toggleUserMenu(event: Event) {
    event.stopPropagation(); // Evitar que el click se propague
    this.isUserMenuOpen = !this.isUserMenuOpen;
  }

  // Nuevo método para manejar la navegación
  navigate(route: string) {
    this.router.navigate([route]);
    if (window.innerWidth < 768) {
      this.isSidebarCollapsed = true;
    }
    this.isUserMenuOpen = false;
  }

  logout() {
    // Aquí puedes agregar la lógica de logout si es necesaria
    this.router.navigate(['/auth/login']);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (isPlatformBrowser(this.platformId)) {
      const userMenu = document.querySelector('.user-menu');
      if (userMenu && !userMenu.contains(event.target as Node)) {
        this.isUserMenuOpen = false;
      }

      if (window.innerWidth < 768) {
        const sidebar = document.querySelector('.sidebar');
        const sidebarToggle = document.querySelector('.sidebar-toggle');

        if (sidebar && sidebarToggle) {
          const clickedInside = sidebar.contains(event.target as Node) ||
                              sidebarToggle.contains(event.target as Node);
          if (!clickedInside && !this.isSidebarCollapsed) {
            this.isSidebarCollapsed = true;
          }
        }
      }
    }
  }
}
