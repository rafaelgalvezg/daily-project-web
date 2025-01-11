import {Routes} from '@angular/router';
import {LayoutComponent} from './shared/components/layout/layout.component';
import {LoginComponent} from './core/auth/login/login.component';
import {ForbiddenComponent} from './core/error-pages/forbidden/forbidden.component';
import {NotFoundComponent} from './core/error-pages/not-found/not-found.component';
import {certGuard} from './core/guard/cert.guard';
import {PermissionResolver} from './core/services/permission.resolver';

export const routes: Routes = [

  {path: 'login', component: LoginComponent},
  {
    path: 'features',
    component: LayoutComponent,
    canActivate: [certGuard],
    resolve: {permissions: PermissionResolver},
    loadChildren: () => import('./features/features.routes').then((x) => x.featuresRoutes)
  },
  {path: 'forbidden', component: ForbiddenComponent},
  {path: 'not-found', component: NotFoundComponent},
  {path: '', component: LoginComponent},
  {path: '**', redirectTo: 'not-found'}
];
