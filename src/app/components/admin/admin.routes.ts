import { Routes } from "@angular/router";

export const adminRoutes: Routes = [
    {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
    },
    {
        path: 'dashboard',
        title: 'Gerenciamento',
        loadComponent: () => import('./admin.component').then(m => m.AdminComponent)
    },
    {
        path: 'bookings',
        title: 'Gerenciamento',
        loadComponent: () => import('./admin.component').then(m => m.AdminComponent)
    },
    {
        path: 'hotels',
        title: 'Gerenciamento',
        loadComponent: () => import('./admin.component').then(m => m.AdminComponent)
    },
    {
        path: 'rooms',
        title: 'Gerenciamento',
        loadComponent: () => import('./admin.component').then(m => m.AdminComponent)
    },
    {
        path: 'users',
        title: 'Gerenciamento',
        loadComponent: () => import('./admin.component').then(m => m.AdminComponent)
    },
    {
        path: 'reports',
        title: 'Gerenciamento',
        loadComponent: () => import('./admin.component').then(m => m.AdminComponent)
    },
]