import { Routes } from '@angular/router';
import { Home } from './components/home/home';

export const routes: Routes = [
    {
        path: '',
        component: Home
    },
    {
        path: 'pais',
        loadChildren: () => import('./components/pais/pais-module').then(m => m.PaisModule)
    },
    {
        path: 'estado',
        loadChildren: () => import('./components/estado/estado-module').then(m => m.EstadoModule)
    },
    {
        path: 'cidade',
        loadChildren: () => import('./components/cidade/cidade-module').then(m => m.CidadeModule)
    },
    {
        path: 'cliente',
        loadChildren: () => import('./components/cliente/cliente-module').then(m => m.ClienteModule)
    },
    {
        path: 'automovel',
        loadChildren: () => import('./components/automovel/automovel-module').then(m => m.AutomovelModule)
    },
    {
        path: 'servico',
        loadChildren: () => import('./components/servico/servico-module').then(m => m.ServicoModule)
    },
    {
        path: 'ordem-servico',
        loadChildren: () => import('./components/ordem-servico/ordem-servico-module').then(m => m.OrdemServicoModule)
    }
];