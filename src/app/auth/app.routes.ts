import { Routes } from '@angular/router';

export const routes: Routes =  [
    {
        path: 'auth', loadChildren: () => import('./auth.routes').then(r => r.ROUTES_AUTH)
    }
];