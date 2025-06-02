import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'home'
    },
    {
        path: 'home',
        title: 'Página Inicial',
        loadComponent: () => import('./components/main/main.component').then(m => m.MainComponent)
    },
    {
        path: 'register',
        title: 'Cadastro',
        loadComponent: () => import('./components/register/register.component').then(m => m.RegisterComponent)
    },
    {
        path: 'activate-account',
        title: 'Ativar Conta',
        loadComponent: () => import('./components/activate-account/activate-account.component').then(m => m.ActivateAccountComponent)
    },
    {
        path: 'login',
        title: 'Login',
        loadComponent: () => import('./components/guest-login/guest-login.component').then(m => m.GuestLoginComponent)
    },
    {
        path: 'login/admin',
        title: 'Login de Funcionário/Admin',
        loadComponent: () => import('./components/admin-login/admin-login.component').then(m => m.AdminLoginComponent)
    },
    {
        path: 'admin',
        loadChildren: () => import('./components/admin/admin.routes').then(m => m.adminRoutes)
    },
    {
        path: 'rooms',
        title: 'Quartos',
        loadComponent: () => import('./components/rooms/rooms.component').then(m => m.RoomsComponent)
    },
    {
        path: 'hotels',
        title: 'Hotéis',
        loadComponent: () => import('./components/hotels/hotels.component').then(m => m.HotelsComponent)
    },
    {
        path: 'rooms/:roomId',
        title: 'Detalhes do Quarto',
        loadComponent: () => import('./components/room-details/room-details.component').then(m => m.RoomDetailsComponent)
    },
    {
        path: 'user',
        loadChildren: () => import('./components/user-area/user-area.routes').then(m => m.userAreaRoutes)
    }
];
