import { Routes } from "@angular/router";
import { AdminComponent } from "./admin.component";
import { authGuard } from "../../guards/auth.guard";
import { rolesGuard } from "../../guards/roles.guard";

export const adminRoutes: Routes = [
    {
        path: '',
        title: 'Gerenciamento',
        component: AdminComponent,
        canActivate: [authGuard(), rolesGuard(['ROLE_OPERATOR', 'ROLE_ADMIN'])],
        canActivateChild: [authGuard(), rolesGuard(['ROLE_OPERATOR', 'ROLE_ADMIN'])],
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
            }
        ]
    }
]