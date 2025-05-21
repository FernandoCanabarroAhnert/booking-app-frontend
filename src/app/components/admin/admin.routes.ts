import { Routes } from "@angular/router";
import { AdminComponent } from "./admin.component";

export const adminRoutes: Routes = [
    {
        path: '',
        title: 'Gerenciamento',
        component: AdminComponent,
        children: [
            {
                path: '',
                redirectTo: 'dashboard',
                pathMatch: 'full'
            },
            {
                path: 'dashboard',
                title: 'Gerenciamento',
                loadComponent: () => import('./components/dashboard/dashboard.component').then(m => m.DashboardComponent)
            },
            {
                path: 'bookings',
                title: 'Gerenciamento',
                loadComponent: () => import('./components/bookings/bookings.component').then(m => m.BookingsComponent)
            },
            {
                path: 'hotels',
                title: 'Gerenciamento',
                loadComponent: () => import('./components/hotels/hotels.component').then(m => m.HotelsComponent)
            },
            {
                path: 'rooms',
                title: 'Gerenciamento',
                loadComponent: () => import('./components/rooms/rooms.component').then(m => m.RoomsComponent)
            },
            {
                path: 'users',
                title: 'Gerenciamento',
                loadComponent: () => import('./components/users/users.component').then(m => m.UsersComponent)
            },
            {
                path: 'reports',
                title: 'Gerenciamento',
                loadComponent: () => import('./components/reports/reports.component').then(m => m.ReportsComponent)
            }
        ]
    }
]