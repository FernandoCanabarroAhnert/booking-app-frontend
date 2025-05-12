import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'register',
        title: 'Cadastro',
        loadComponent: () => import('./components/register/register.component').then(m => m.RegisterComponent)
    },
    {
        path: 'login',
        title: 'Login',
        loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent)
    },
    {
        path: 'rooms/:roomId',
        title: 'Detalhes do Quarto',
        loadComponent: () => import('./components/room-details/room-details.component').then(m => m.RoomDetailsComponent)
    }
];
