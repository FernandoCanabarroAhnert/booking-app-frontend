import { Routes } from "@angular/router";

export const userAreaRoutes: Routes = [
    {
        path: '',
        title: 'Área do Usuário',
        loadComponent: () => import('./user-area.component').then(m => m.UserAreaComponent),
        children: [
            {
                path: '',
                redirectTo: 'infos',
                pathMatch: 'full'
            },
            {
                path: 'infos',
                title: 'Informações do Usuário',
                loadComponent: () => import('./components/user-infos/user-infos.component').then(m => m.UserInfosComponent)
            },
            {
                path: 'bookings',
                title: 'Minhas Reservas',
                loadComponent: () => import('./components/user-bookings/user-bookings.component').then(m => m.UserBookingsComponent)
            },
            {
                path: 'credit-cards',
                title: 'Meus Cartões de Crédito',
                loadComponent: () => import('./components/user-credit-cards/user-credit-cards.component').then(m => m.UserCreditCardsComponent)
            }
        ]
    }
]